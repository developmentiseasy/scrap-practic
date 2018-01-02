const Xray = require('x-ray')
const request = require('request')
const _ = require('lodash')
// const fs = require('fs')
const shortid = require('shortid')


var fs = require('fs');
var json2xml = require('json2xml');

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
            // url: 'a@href',
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
var scrapItem = []
var arrara
var CaliforniaCode = 'California Code'

// var secondScrapArr = []
// getSecondStep = (err, res) => {
//     if (!err) {
//         if (res.length === 0) return
//         // console.log(res)
//
//         res.forEach((item, index) => {
//             // console.log(item)
//             // secondScrapData = item
//
//             secondScrapData['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
//             secondScrapData['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
//             secondScrapData['stat:Text'] = {}
//             secondScrapData['stat:Text']['stat:heading'] = item.heading
//
//             secondScrapArr[index] = secondScrapData
//         })
//         correctScrapItem['stat:Document']['stat:Level']['stat:Level'] = []
//         correctScrapItem['stat:Document']['stat:Level']['stat:Level'] = secondScrapArr
//
//         console.log(secondScrapArr)
//
//     }
// }

getData = (err, res) => {
    if (!err) {
        if (res.length === 0) return
        selectors.forEach((selector) => {
            res.forEach((item, i) => {
                // if (item['stat:Text']['stat:heading'] === ' ') return
                // if (!_.isEmpty(finish_result)) {
                // if (!_.isEmpty(item))
                //  arrara = _.concat(scrapItem, [item])
                correctScrapItem = {
                    'stat:Document': {}
                }
                correctScrapItem['stat:Document']['-xmlns:stat'] = 'https://casetext.com/stat'
                correctScrapItem['stat:Document']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
                correctScrapItem['stat:Document']['stat:Title'] = CaliforniaCode
                correctScrapItem['stat:Document']['stat:URL'] = 'https://leginfo.legislature.ca.gov/faces/codes.xhtml'
                correctScrapItem['stat:Document']['stat:Version'] = '0.1'
                correctScrapItem['stat:Document']['stat:Currency'] = '2017-07-07'
                correctScrapItem['stat:Document']['stat:Level'] = {}
                correctScrapItem['stat:Document']['stat:Level']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
                correctScrapItem['stat:Document']['stat:Level']['-depth'] = '3'
                correctScrapItem['stat:Document']['stat:Level']['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
                correctScrapItem['stat:Document']['stat:Level']['stat:Text'] = {}
                correctScrapItem['stat:Document']['stat:Level']['stat:Text']['-xmlns:stat'] = "https://casetext.com/stat"
                correctScrapItem['stat:Document']['stat:Level']['stat:Text']['stat:heading'] = item.heading

                x(item.url, selector.selector, [selector.res_body])((err, res) => {
                    if (!err) {
                        if (res.length === 0) return
                        // console.log(res)

                        res.forEach((item, index) => {
                            // console.log(item)
                            // secondScrapData = item

                            secondScrapData['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
                            secondScrapData['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
                            secondScrapData['stat:Text'] = {}
                            secondScrapData['stat:Text']['stat:heading'] = item.heading

                            secondScrapArr[index] = secondScrapData
                        })
                        correctScrapItem['stat:Document']['stat:Level']['stat:Level'] = []
                        correctScrapItem['stat:Document']['stat:Level']['stat:Level'] = secondScrapArr

                        console.log(secondScrapArr)

                    }

                })
                if (item.heading !== undefined) {
                    console.log('Write to file')
                    fs.writeFile('./results/json/second-scrap/' + item.heading + '/' + item.heading + '.json', JSON.stringify(correctScrapItem, null, 4), () => {
                    })
                }


                // console.log(secondScrapArr)
                // console.log('Ready to add')

                // }

                // } else {
                //   finish_result = res
                // }
            })
        })
        // let aaa = 0
        // if (correctScrapItem['stat:Text'] !== undefined) {
        //     fs.writeFile('./results/json/second-scrap/' + res.heading + '.json', JSON.stringify(res, null, 4), () => {
        //     })
        // }
        // console.log(res)

        // console.log(finish_result)
        // console.log(_.isEmpty(finish_result))
    }
    else {
        console.log(err)
        console.error(err)
    }
}
x(URL, selectors[0].selector, [selectors[0].res_body])(getData)
