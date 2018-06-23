export class Spare {
  constructor (ref) {
    this.id = ''
    this.refId = ref.id
    this.refName = this.initRefName(ref)
    this.rqf = ''
    this.pn = ''
    this.description = ''
    this.quantity = ''
    this.status = ''
    this.priority = ''
    this.reqDate = ''
    this.dueDate = ''
    this.estDate = ''
    this.notes = ''
  }
  initRefName (ref) {
    if (ref.wpItem === null || ref.wpItem === undefined) {
      return 'NRC ' + ref.number
    } else {
      return ref.wpItem
    }
  }
}
