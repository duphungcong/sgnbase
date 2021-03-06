export default {
  formatDate (dateStr) {
    if (!dateStr) return null

    const [year, month, day] = dateStr.split('-')
    return day + '-' + month + '-' + year
  },
  priorityColor (priority) {
    if (priority === 'AOG') return 'red--text body-1'
  },
  spareStatusColor (status) {
    if (status === 'notYet') return 'grey lighten-2'
    if (status === 'avail') return 'blue white--text'
    if (status === 'issued') return 'green white--text'
    if (status === 'cancel') return 'brown lighten-1 white--text'
  },
  tarStatusColor (status) {
    if (status === 'sent') return 'grey lighten-2'
    if (status === 'replied') return 'green white--text'
    if (status === 'cancel') return 'brown lighten-1 white--text'
  },
  nrcStatusColor (status) {
    if (status === 'inProgress') return 'yellow darken-3 white--text'
    if (status === 'out') return 'blue-grey white--text'
    if (status === 'notYet') return 'grey lighten-2'
    if (status === 'ready') return 'blue white--text'
    if (status === 'done') return 'green white--text'
    if (status === 'cancel') return 'brown lighten-1 white--text'
  },
  currentShift (startDate) {
    let today = Date.now()
    let start = new Date(startDate)
    if (today < start) {
      return 0
    }
    let diff = new Date(today - start)
    return diff.getUTCDate()
  },
  timeToShift (time, startDate) {
    let date = new Date(time)
    let start = new Date(startDate)
    if (date < start) {
      return 0
    }
    let diff = new Date(date - start)
    return diff.getUTCDate()
  },
  remainDay (startDate, finishDate) {
    let start = new Date(startDate)
    let finish = new Date(finishDate)
    let today = Date.now(7)
    let diff1 = new Date(start - today)
    let diff2 = new Date(finish - today)
    if (diff1 > 0) {
      let remain1 = diff1.getUTCDate() - 1
      return remain1 + ' days to start'
    }
    if (diff2 > 0) {
      let remain2 = diff2.getUTCDate()
      return remain2 + ' days to finish'
    }
    return 'completed'
  }
}
