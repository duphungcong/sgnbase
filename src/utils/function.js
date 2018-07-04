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
  }
}
