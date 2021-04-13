export default class Dir {
  constructor (
    name = null,
    type = null,
    size = null,
    folder = null,
    href = null,
    dir = []
  ) {
    this.name = name
    this.type = type
    this.size = size
    this.folder = folder
    this.href = href
    this.dir = dir
  }
}
