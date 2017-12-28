const Xray = require('x-ray')
const request = require('request')
const _ = require('lodash')
const fs = require('fs')
const mongoose = require('mongoose')

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
      title: 'strong',
    },
  },
]

var finish_result = []
var correctScrapItem = ''

// findData = (result, nextData) => {
//   if (result.length === 0) return
//   result.forEach((obj, index) => {
//     if (obj.url === correctScrapItem.url) {
//       result[index].body = nextData
//     } else findData(obj, nextData)
//   })
// }

var DataModel = mongoose.model('codes', {
  title: String,
  url: String,
  body: Array
})


mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/californiacodesdb', {
  useMongoClient: true
})
  .then(() => {
    console.log('MongoDB has started ...')
    var currentItem = []
    var firstCodes = []

    DataModel.find({}, (err, codes) => {
      if (err) throw err
      console.log(codes)

    }).then((codes) => {
      getData = (err, res) => {
        if (res.length === 0) return
        setTimeout(() => {
          if (_.isEmpty(codes)) {

            //Clear DB
            //
            // DataModel.remove({}, function (err) {
            //   if (err) return handleError(err)
            //   console.log(err)
            // })

            firstCodes = codes

            if (!_.isEqual(firstCodes, codes))
              res.forEach((item, i) => { //Pushing start data to DB
                DataModel.create({
                  title: item.title,
                  url: item.url,
                  body: [],
                }, (err, data) => {
                  if (err) return console.log(err)
                  console.log(data)
                })
              })


            if (!err) { //Scrap data for next cycle
              selectors.forEach((selector) => {
                res.forEach((item) => {
                  currentItem = item
                  x(item.url, selector.selector, [selector.res_body])(getData)
                })
              })
            } else {
              console.log(err)
              console.error(err)
            }


          } else {
            console.log('aaaaaaaaaaaaaaa')
            if (!err) { //Scrap data for next cycle
              selectors.forEach((selector) => {
                res.forEach((item) => {
                  console.log('currentItem = ', currentItem)
                  DataModel.findOneAndUpdate(
                    {title: currentItem.title, url: currentItem.url, body: []},
                    {body: item}).then(() => {
                    DataModel.findOne().then((result) => {
                      assert(result.body === item)
                      done()
                    })
                  })

                  x(item.url, selector.selector, [selector.res_body])(getData)
                })
              })
            } else {
              console.log(err)
              console.error(err)
            }

          }
        }, 1000)
      }
      x(URL, selectors[0].selector, [selectors[0].res_body])(getData)
    })
  })

