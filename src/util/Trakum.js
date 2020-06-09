import { MatchPattern } from './MatchPattern'
import { Storage } from './Storage'

const { v4: uuidv4 } = require('uuid')

const PAGE_SPEC_KEY = 'TPageSpecs'

export class Trakum {
  constructor () { this.init() }

  get pageSpecs () {
    return [...this._pageSpecs]
  }

  init () {
    this._pageSpecs = []
    Storage.get(PAGE_SPEC_KEY, (_pageSpecs) => {
      if (!_pageSpecs || _pageSpecs.length <= 0) return
      this._pageSpecs = _pageSpecs
    })
  }

  matches (url) {
    return this.pageSpecs.filter(item => MatchPattern(item.pattern)(url))
  }

  save () {
    Storage.set(PAGE_SPEC_KEY, this.pageSpecs)
  }

  addPageSpec (pageSpec) {
    const { pattern, query } = pageSpec
    this._pageSpecs.push({
      id: uuidv4(),
      created: new Date(),
      pattern,
      query
    })
    this.save()
  }

  updatePageSpec (pageSpec = {}) {
    const index = this._pageSpecs.findIndex(s => s.id === pageSpec.id)
    if (index !== -1) {
      this._pageSpecs[index] = { ...this._pageSpecs[index], ...pageSpec }
    }
    this.save()
  }

  deletePageSpec (pageSpec = {}) {
    const index = this._pageSpecs.findIndex(s => s.id === pageSpec.id)
    if (index !== -1) this._pageSpecs.splice(index, 1)
    this.save()
  }
}
