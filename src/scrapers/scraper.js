const Xray = require('x-ray')
const _ = require('lodash')
const shortid = require('shortid')
const fs = require('fs')

const URL = 'https://leginfo.legislature.ca.gov/faces/codes.xhtml'

const xray = new Xray({
  filters: {
    replace: (value) => {
      return typeof value === 'string' ? value.replace(/(\r\n|\n|\r|\s\s)/gm, '') : value
    },
  },
})

const selectors = [
  {
    sel: '#codestocheader > div.displaycodeleftmargin > div > div',
    res: {
      url: 'a@href',
      title: 'a | replace'
    }
  }
]

ModelsOfCodeCategory = (props) => {
  return _(props).pick()
}

scrapeFirstLevel = (err, res) => {
  if (!err) {
    if (_.isEmpty(res)) return



    // res.forEach((item, index) => {
    //   let item
    //   console.log(item)
    // })

    console.log(res)
  } else {
    console.error(err)
  }
}

xray(URL, 'html@html')(scrapeFirstLevel)