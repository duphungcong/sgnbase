<template>
  <v-flex xs12>
    <v-card class="elevation-0">
      <v-layout pl-2>
        <v-flex xs4>
          <v-text-field
            prepend-icon="person"
            autofocus
            counter="4"
            mask="####"
            clearable
            label="Type vaeco ID (4 digits) to active scan"
            v-model="person"
            @keyup.native.enter="focusToScan()"></v-text-field>
          </v-flex>
        <v-flex xs7 ml-5>
          <v-text-field
            prepend-icon="format_paint"
            ref="scanBox"
            label="Scan Task"
            @change.native="onBarcodeScanned(barcode)"
            v-model="barcode"
            :disabled="person === null || person.length < 4"></v-text-field>
        </v-flex>
        <v-flex xs1 ml-3 pt-2>
          <v-btn depressed small dark color="primary" @click.native="update">OUT</v-btn>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-alert type="success" v-model="duplicateAlert">
            This task is already scanned!
          </v-alert>
        </v-flex>
      </v-layout>

      <v-layout pl-2>
        <v-flex xs12>
          <v-layout row wrap align-center>
            <v-flex xs2>
              <span><strong>Item ({{ scanList.length }})</strong></span>
            </v-flex>
            <v-flex xs2>
              <span><strong>Person</strong></span>
            </v-flex>
            <v-flex xs2>
              <span><strong>Time</strong></span>
            </v-flex>
            <v-flex xs5>
              <span><strong>Notes</strong></span>
            </v-flex>
            <v-flex xs1>
              <v-btn flat icon color="blue" @click.native="clear()">
                <v-icon medium>loop</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <ul>
            <li v-for="item in scanList" :key="item.number">
              <v-card class="elevation-0 pl-2">
                <v-layout row wrap align-center>
                  <v-flex xs2>
                    <span v-if="item.isNRC">NRC </span><span>{{ item.number }}</span>
                  </v-flex>
                  <v-flex xs2>
                    <span>{{ item.person }}</span>
                  </v-flex>
                  <v-flex xs2>
                    <span>{{ item.time }}</span>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field label="Remarks" v-model="item.notes"></v-text-field>
                  </v-flex>
                  <v-flex xs1 pl-3>
                    <v-btn icon @click.native="remove(item)">
                      <v-tooltip bottom>
                        <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
                      </v-tooltip>
                    </v-btn>
                    <v-icon color="green" v-if="item.updateSuccess">check</v-icon>
                    <v-icon color="red" v-if="item.updateFail">close</v-icon>
                  </v-flex>
                </v-layout>
              </v-card>
            </li>
          </ul>
        </v-flex>
      </v-layout>

    </v-card>
  </v-flex>
</template>

<script>
export default {
  data () {
    return {
      person: '',
      barcode: '',
      scanList: [],
      duplicateAlert: false
    }
  },
  methods: {
    onBarcodeScanned (barcode) {
      // console.log(barcode)
      this.duplicateAlert = false
      let scanItem = this.formatBarcode(this.barcode)
      // console.log(scanItem)
      let found = this.scanList.find((item) => {
        return item.number === scanItem.number
      })
      if (found === undefined) {
        let now = Date.now(7)
        let time = new Date(now)
        // console.log(time)
        this.scanList.push({
          number: scanItem.number,
          isNRC: scanItem.isNRC,
          person: this.person,
          time: time.toLocaleString(),
          notes: '',
          updateSuccess: false,
          updateFail: false
        })
      } else {
        this.duplicateAlert = true
        setTimeout(() => {
          this.duplicateAlert = false
        }, 2000)
      }
      this.barcode = ''
    },
    formatBarcode (barcode) {
      let isNRC = barcode.substr(0, 3) === 'nrc'
      if (isNRC) {
        return {
          number: parseInt(barcode.substr(3, 7), 10),
          isNRC: isNRC
        }
      } else {
        return {
          number: 'VN' + barcode.substr(8, 8) + '-' + parseInt(barcode.substr(16, 4), 10), // VN + 00274085 + '-' + 8
          isNRC: isNRC
        }
      }
    },
    update () {},
    clear () {
      this.scanList.forEach(item => {
        item.updateSuccess = false
        item.updateFail = false
      })
    },
    remove (item) {
      let index = this.scanList.indexOf(item)
      if (index > -1) {
        this.scanList.splice(index, 1)
      }
    },
    focusToScan () {
      this.$refs.scanBox.focus()
    }
  },
  created () {
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },
  mounted () {
    this.checkId = this.$store.getters.following
  },
  destroyed () {
    this.$barcodeScanner.destroy()
  }
}
</script>
