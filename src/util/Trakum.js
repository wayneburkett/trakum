import { MatchPattern } from './MatchPattern'
import { Storage } from './Storage'

const { v4: uuidv4 } = require('uuid')

const PAGE_SPEC_KEY = 'TPageSpecs'

export class Trakum {
  constructor () { this.init() }

  init () {
    this.pageSpecs = []
    Storage.get(PAGE_SPEC_KEY, (pageSpecs) => {
      if (!pageSpecs || pageSpecs.length <= 0) return
      this.pageSpecs = pageSpecs
    })
  }

  allPageSpecs () {
    return [...this.pageSpecs]
  }

  matches (url) {
    return this.allPageSpecs().filter(item => MatchPattern(item.pattern)(url))
  }

  save () {
    Storage.set(PAGE_SPEC_KEY, this.allPageSpecs())
  }

  addPageSpec (pageSpec) {
    const { pattern, query } = pageSpec
    this.pageSpecs.push({
      pattern,
      query,
      uuid: uuidv4(),
      created: new Date()
    })
    this.save()
  }
}
