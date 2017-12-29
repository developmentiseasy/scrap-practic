const Xray = require('x-ray')
const request = require('request')
const _ = require('lodash')
// const fs = require('fs')
const shortid = require('shortid')


var fs = require('fs');
var json2xml = require('json2xml');

fs.readFile('./results/json/Welfare and Institutions Code - WIC .json', 'utf8', function read (err, data) {
  if (err) console.log(err);
  fs.writeFile('./results/xml/Welfare and Institutions Code - WIC .xml', json2xml(JSON.parse(data)));
});


const x = new Xray({
  filters: {
    replace: (value) => {
      return typeof value === 'string' ? value.replace(/(\r\n|\n|\r|\s\s)/gm, '') : value
    },
  },
})

// const URL = 'https://leginfo.legislature.ca.gov/faces/codes.xhtml'
const URL = 'https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=HSC&tocTitle=+Health+and+Safety+Code+-+HSC'

const selectors = [
  // {
  //   selector: '#codestreeForm2 > div.codes_toc_list',
  //   res_body: {
  //     url: 'a@href',
  //   },
  // },
  // {
  //   selector: '#expandedbranchcodesid > div',
  //   res_body: {
  //     'stat:Text': {
  //       'stat:heading': 'a div@style="margin-left:10px" | replace',
  //     },
  //   },
  // },

  // {
  //   selector: 'div#manylawsections > div:nth-child(2) > font > div',
  //   res_body: {
  //     '-id': shortid.generate(),
  //     'stat:header': 'h6 > a',
  //     'stat:p': ['p'],
  //     'stat:note': 'i'
  //   },
  // }


  {
    selector: '#codestocheader > div.displaycodeleftmargin[style*="20px"] > div > div',
    res_body: {
      'stat:Level': {
        '-id': shortid.generate(),
        'stat:Text': {
          'stat:heading':'a | replace',
        },
      },
    },
  },

  // {
  //   selector: '#codestreeForm2 > div.codes_toc_list',
  //   res_body: {
  //     '-id': shortid.generate(),
  //     'stat:Text': {
  //       'stat:heading': 'a > span | replace',
  //     },
  //   },
  // },


  // {
  //   selector: '#expandedbranchcodesid',
  //   res_body: {
  //     '-id': shortid.generate(),
  //     'stat:header': 'h6 > a',
  //     'stat:p': ['p'],
  //     'stat:note': 'i'
  //   },
  // },

  // {
  //   selector: '#codestocheader > div.displaycodeleftmargin > div > div',
  //   res_body: {
  //     'stat:Level': {
  //       '-id': toString(shortid.generate()),
  //       'stat:Text': {
  //         '-xmlns:stat': 'https://casetext.com/stat',
  //         'stat:heading': 'a | replace',
  //       },
  //     },
  //   },
  // },
  // {
  //   selector: 'form#codestreeForm2 > div.codes_toc_list',
  //   res_body: {
  //     'stat:Level': {
  //       title: 'a',
  //       url: 'a@href',
  //     },
  //   },
  // },
]

var finish_result = []
var correctScrapItem = ''
var scrapItem = []
var arrara

getData = (err, res) => {
  if (!err) {
    if (res.length === 0) return
    selectors.forEach((selector) => {
      res.forEach((item, i) => {
        // if (item['stat:Text']['stat:heading'] === ' ') return
        // if (!_.isEmpty(finish_result)) {
        // if (!_.isEmpty(item))
        //  arrara = _.concat(scrapItem, [item])
        correctScrapItem = item
        correctScrapItem['-id'] = shortid.generate() + shortid.generate() + shortid.generate()

        // console.log(i)

        // correctScrapItem['stat:Level'] ['stat:Text'] ['-xmlns:stat'] = 'https://casetext.com/stat'
        // console.log(item)
        // if (correctScrapItem['stat:Text'] !== undefined) {
        //   fs.writeFile('./results/timeless/' + res['stat:Text']['stat:heading'] + '.json', JSON.stringify(correctScrapItem, null, 4), () => {
        //   })
        // } else {
          // console.log(item)
          x(item.url, selector.selector, [selector.res_body])(getData)
        // }

        // } else {
        //   finish_result = res
        // }
      })
    })
    // let aaa = 0
    // if (correctScrapItem['stat:Text'] !== undefined) {
    //   fs.writeFile('./results/timeless/' + res[0]['stat:Text']['stat:heading'] + '.json', JSON.stringify(res, null, 4), () => {
    //   })
    // }
    console.log(res)

    // console.log(finish_result)
    // console.log(_.isEmpty(finish_result))
  }
  else {
    console.log(err)
    console.error(err)
  }
}
// x(URL, selectors[0].selector, [selectors[0].res_body])(getData)
