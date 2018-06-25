export class Tar {
  constructor (ref) {
    this.id = ''
    this.refId = ref.id
    this.refName = this.initRefName(ref)
    this.number = ''
    this.content = ''
    this.sendDate = ''
    this.replyDate = ''
    this.status = 'sent'
    this.zoneDivision = 'N/A'
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
