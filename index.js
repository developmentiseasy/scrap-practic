const Xray = require('x-ray')
const request = require('request')
const _ = require('lodash')
// const fs = require('fs')
const shortid = require('shortid')


var fs = require('fs')
var json2xml = require('json2xml')

// fs.readFile('./results/json/Welfare and Institutions Code - WIC .json', 'utf8', function read(err, data) {
//     if (err) console.log(err);
//     fs.writeFile('./results/xml/Welfare and Institutions Code - WIC .xml', json2xml(JSON.parse(data)));
// });
//
//
const x = new Xray({
  filters: {
    replace: (value) => {
      return typeof value === 'string' ? value.replace(/(\r\n|\n|\r|\s\s|\s+$)/gm, '') : value
    },
  },
})

const URL = 'https://leginfo.legislature.ca.gov/faces/codes.xhtml'
// const URL = 'https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=HSC&tocTitle=+Health+and+Safety+Code+-+HSC'

const statsSelectors = [
  {
    selector: 'div#manylawsections > div > font > div',
    res_body: {
      heading: 'h6 > a',
      p: 'p[style="margin:0;display:inline;"]',
      // note: 'p[style="margin:0 0 2em 0;font-size:0.9em;"] > i'
      note: 'p > i'
    }
  },

]
const selectors = [

  {
    selector: '#codestocheader > div.displaycodeleftmargin > div > div',
    res_body: {
      heading: 'a | replace',
      url: 'a@href',
    },
  },
  {
    selector: '#codestreeForm2 > div.codes_toc_list',
    res_body: {
      heading: 'a > span:nth-child(1) | replace',
      url: 'a@href',
    },
  },

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


  //
  //
  // {
  //   selector: '#codestocheader > div.displaycodeleftmargin[style*="20px"] > div > div',
  //   res_body: {
  //     'stat:Level': {
  //       '-id': shortid.generate(),
  //       'stat:Text': {
  //         'stat:heading':'a | replace',
  //       },
  //     },
  //   },
  // },
  //
  //


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
var secondScrapData = {}
var secondScrapArr = []
var thirdScrapArr = []
var scrapCodesArr = []
var scrapItem = []
var arrara
var CaliforniaCode = 'California Code'
var index1 = 0

getData = (err, res) => {
  if (!err) {
    // console.log(res)

    if (res.length === 0) return
    res.forEach((item) => {
      // if (item.heading === ' ') return
      let doc = {}
      doc = {
        'stat:Document': {}
      }
      doc['stat:Document']['-xmlns:stat'] = 'https://casetext.com/stat'
      doc['stat:Document']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
      doc['stat:Document']['stat:Title'] = CaliforniaCode
      doc['stat:Document']['stat:URL'] = 'https://leginfo.legislature.ca.gov/faces/codes.xhtml'
      doc['stat:Document']['stat:Version'] = '0.1'
      doc['stat:Document']['stat:Currency'] = '2017-07-07'
      doc['stat:Document']['stat:Level'] = {}
      doc['stat:Document']['stat:Level']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
      doc['stat:Document']['stat:Level']['-depth'] = '3'
      doc['stat:Document']['stat:Level']['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
      doc['stat:Document']['stat:Level']['stat:Text'] = {}
      doc['stat:Document']['stat:Level']['stat:Text']['-xmlns:stat'] = 'https://casetext.com/stat'
      doc['stat:Document']['stat:Level']['stat:Text']['stat:Heading'] = item.heading

      var index2 = 0

      x(item.url, selectors[1].selector, [selectors[1].res_body])((err, res) => {
        if (!err) {
          if (res.length === 0) return

          res.forEach((elem, index) => {
            // console.log(elem)

            let codeCategory = {}
            codeCategory['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
            codeCategory['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + elem.heading
            codeCategory['stat:Text'] = {}
            codeCategory['stat:Text']['stat:heading'] = elem.heading
            codeCategory['stat:Text']['stat:Level'] = scrapCodesArr

            statsSelectors.forEach((selector, index) => {
              // console.log(res)
              x(elem.url, selector.selector, selector.res_body)((err, result) => {
                if (err) return err
                // console.log(elem)
                if (!_.isEmpty(result.heading && result.p && result.note)) {
                  let codes = {}
                  codes['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
                  codes['-is_citable'] = true
                  codes['-is_document'] = true
                  codes['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + elem.heading
                  codes['stat:heading'] = result.heading
                  codes['stat:p'] = result.p
                  codes['stat:Note'] = result.note

                  scrapCodesArr[index] = codes

                  console.log(scrapCodesArr)
                } else {
                  console.log('Alalalalalallalall')
                }
              })
            })

            codeCategory['stat:Text']['stat:Level'] = scrapCodesArr
            secondScrapArr[index] = codeCategory

            doc['stat:Document']['stat:Level']['stat:Level'] = []
            doc['stat:Document']['stat:Level']['stat:Level']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
            doc['stat:Document']['stat:Level']['stat:Level']['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
            doc['stat:Document']['stat:Level']['stat:Level'] = secondScrapArr
          })

        }
        fs.writeFile('./results/json/second-scrap/' + item.heading + '/' + item.heading + '.json', JSON.stringify(doc, null, 4), () => {
        })
      })

    })
  }
  else {
    console.log(err)
    console.error(err)
  }
}
x(URL, selectors[0].selector, [selectors[0].res_body])(getData)
