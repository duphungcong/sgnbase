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
          <v-alert :type="alertType" v-model="alert">
            {{ alertMessage }}
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
          <v-list>
            <v-list-tile v-for="item in scanList" :key="item.number">
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
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>

    </v-card>
  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      person: '',
      barcode: '',
      scanList: [],
      alert: false,
      alertType: 'info',
      alertMessage: ''
    }
  },
  computed: {
    ...mapState(['workpack', 'nrcs', 'checkId']),
    check () {
      return this.$store.getters.check
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    onBarcodeScanned (barcode) {
      let scan = this.formatBarcode(this.barcode)
      let itemInWorkpack = scan.isNRC ? this.nrcs.find(item => item.number === scan.number) : this.workpack.find(item => item.wpItem === scan.number)
      let duplicate = this.scanList.find((item) => {
        return item.number === scan.number
      })
      if (itemInWorkpack !== undefined && duplicate === undefined) {
        let now = Date.now(7)
        let time = new Date(now)
        this.scanList.push({
          itemInWorkpack: Object.assign({}, itemInWorkpack),
          number: scan.number,
          isNRC: scan.isNRC,
          person: this.person,
          time: time.toLocaleString(),
          shift: this.appFunction.currentShift(this.check.startDate),
          notes: '',
          updateSuccess: false,
          updateFail: false
        })
      } else if (itemInWorkpack === undefined) {
        this.openAlert('error', 'Item not exist')
        setTimeout(() => {
          this.closeAlert()
        }, 2000)
      } else {
        this.openAlert('info', 'Item already scanned')
        setTimeout(() => {
          this.closeAlert()
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
    update () {
      this.setLoading(true)
      let logRef, itemRef
      this.scanList.forEach(item => {
        if (item.isNRC) {
          logRef = 'nrcLogs/' + this.checkId
          itemRef = 'nrcs/' + this.checkId
        } else {
          logRef = 'taskLogs/' + this.checkId
          itemRef = 'workpacks/' + this.checkId
        }

        if (item.notes !== null && item.notes !== undefined) {
          item.itemInWorkpack.notes = item.notes
        }

        item.itemInWorkpack.status = 'out'

        let log = {
          id: firebase.database().ref(logRef).push().key,
          refId: item.itemInWorkpack.id,
          refName: item.isNRC ? 'NRC ' + item.itemInWorkpack.number : item.itemInWorkpack.wpItem,
          zoneDivision: item.itemInWorkpack.zoneDivision,
          status: 'out',
          person: item.person,
          time: item.time,
          shift: item.shift,
          action: 'take out',
          notes: item.itemInWorkpack.notes
        }

        let updates = {}
        updates[logRef + '/' + log.id] = log
        updates[itemRef + '/' + item.itemInWorkpack.id] = item.itemInWorkpack

        firebase.database().ref().update(updates).then(
          (data) => {
            item.updateSuccess = true
          }, (error) => {
            console.log('ERROR - barcodeout - update -' + error.message)
            item.updateFail = true
          }
        )
      })
      this.setLoading(false)
    },
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
    },
    openAlert (type, message) {
      this.alert = true
      this.alertType = type
      this.alertMessage = message
    },
    closeAlert () {
      this.alert = false
      this.alertType = 'info'
      this.alertMessage = ''
    }
  },
  created () {
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },
  destroyed () {
    this.$barcodeScanner.destroy()
  }
}
</script>
