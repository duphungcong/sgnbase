export class Check {
  constructor () {
    this.id = ''
    this.name = ''
    this.aircraft = ''
    this.startDate = ''
    this.finishDate = ''
    this.shifts = []
  }
  setShifts () {
    // console.log('set shifts')
    if (this.startDate !== '' && this.finishDate !== '') {
      this.shifts = [] // reset shifts to zero
      let start = new Date(this.startDate)
      let finish = new Date(this.finishDate)
      let diff = new Date(finish - start)
      let numberOfShift = diff.getUTCDate()
      for (let n = 0; n < numberOfShift; n++) {
        this.shifts.push({
          number: n + 1,
          elect: true,
          air: true,
          hyd: true
        })
      }
    }
  }
}
