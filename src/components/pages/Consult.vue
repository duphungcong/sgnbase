<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-card-title><h3>Import Mac Consult</h3></v-card-title>
      <v-card-text>
        <v-radio-group v-model="type">
          <v-radio
            label="A321"
            value="amsA321"
            ></v-radio>
          <v-radio
            label="B787"
            value="amsB787"
            ></v-radio>
          <v-radio
            label="ATR72"
            value="amsATR"
            ></v-radio>
        </v-radio-group>
        <v-form>
          <input type="file" id="file" @change="onFileChange">
        </v-form>
        &nbsp;
        <p>Number of task cards: {{ numberTaskCard }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn depressed small @click.native="cancel()">Cancel</v-btn>
        <v-btn depressed small class="primary" @click.native="save()" :disabled="!scanFileDone || type === ''">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>

import { mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import XLSX from 'xlsx'

export default {
  data () {
    return {
      type: '',
      ams: [],
      scanFileDone: false,
      count: 0
    }
  },
  computed: {
    numberTaskCard () {
      return this.ams.length
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    ...mapMutations('snackbar', ['showSnackbar', 'closeSnackbar']),
    save () {
      this.count = 0
      this.setLoading(true)
      this.ams.some(item => {
        item.id = firebase.database().ref(this.type).push().key
        firebase.database().ref(this.type + '/' + item.id).update(item).then(
          (data) => {
            this.count++
            if (this.count === this.numberTaskCard) {
              this.setLoading(false)
              this.openSnackbar({
                text: 'Import success!',
                color: 'success'
              })
              setTimeout(() => {
                this.$router.push({ name: 'Checks' })
              }, 1000)
            }
            return false
          },
          (error) => {
            console.log('item-' + this.count + ':' + error)
            this.setLoading(false)
            this.openSnackbar({
              text: error.message,
              color: 'error'
            })
            return true // stop loop
          }
        )
      })
    },
    cancel () {
      this.$router.push('checks')
    },
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (files && files[0]) {
        this.readFile(files[0])
      }
    },
    readFile (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, {type: 'binary'})
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: ['name', 'zone', 'type', 'title', 'amsMH', 'macMH', 'men', 'hour', 'zoneDivision', 'remarks'] })
        /* Update state */
        data.shift()
        this.ams = data
        // this.cols = makeCols(ws['!ref'])
        this.scanFileDone = true
      }
      reader.readAsBinaryString(file)
    },
    openSnackbar (payload) {
      this.showSnackbar(payload)
    }
  }
}
</script>
