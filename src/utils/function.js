export default {
  formatDate (dateStr) {
    if (!dateStr) return null

    const [year, month, day] = dateStr.split('-')
    return day + '-' + month + '-' + year
  },
  priorityColor (priority) {
    if (priority === 'AOG') return 'red--text body-1'
  }
}
