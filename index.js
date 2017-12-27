const Xray = require('x-ray')
const request = require('request')
const _ = require('lodash')
const fs = require('fs')

const x = new Xray()

const URL = 'http://jedicode.co'
const selectors = [
  {
    selector: 'div.posts > div.post.py3',
    res_body: {
      title: 'a > h3.h1.post-title',
      url: 'a@href',
    },
  },
  {
    selector: 'article.post-content',
    res_body: {
      description: 'strong',
    },
  },
]

var finish_result = []
var correctScrapItem = ''

findData = (result, nextData) => {
  if (result.length === 0) return
  result.forEach((obj, index) => {
    if (obj.url === correctScrapItem.url) {
      result[index].body = nextData
    } else findData(obj, nextData)
  })
}

getData = (err, res) => {
  setTimeout(() => {
    if (!err) {
      if (res.length === 0) return

      selectors.forEach((selector) => {
        res.forEach((item) => {
          if (!_.isEmpty(finish_result)) {
            correctScrapItem = item
            findData(finish_result, item)
            x(item.url, selector.selector, [selector.res_body])(getData)
          } else {
            finish_result = res
          }
        })
      })
      console.log(res)
      // console.log(finish_result)
      console.log(_.isEmpty(finish_result))
      fs.writeFile('result.json', JSON.stringify(finish_result, null, 4), () => {
      })
    } else {
      console.log(err)
      console.error(err)
    }
  }, 1000)
}
x(URL, selectors[0].selector, [selectors[0].res_body])(getData)
