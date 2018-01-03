const Xray = require('x-ray')
const request = require('request')
const _ = require('lodash')
// const fs = require('fs')
const shortid = require('shortid')


var fs = require('fs')

const x = new Xray({
  filters: {
    replace: (value) => {
      return typeof value === 'string' ? value.replace(/(\r\n|\n|\r|\s\s|\s+$)/gm, '') : value
    },
  },
})

const URL = 'https://leginfo.legislature.ca.gov/faces/codes.xhtml'
// const URL = 'https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=HSC&tocTitle=+Health+and+Safety+Code+-+HSC'

const AbrCategories = [
  {
    full: 'Business and Professions Code - BPC',
    abr: 'Bus. & Prof.'
  },
  {
    full: 'Civil Code - CIV',
    abr: 'Civ.'
  },
  {
    full: 'Code of Civil Procedure - CCP',
    abr: 'Civ. Proc.'
  },
  {
    full: 'Commercial Code - COM',
    abr: 'Com.'
  },
  {
    full: 'Corporations Code - CORP',
    abr: 'Corp.'
  },
  {
    full: 'Education Code - EDC',
    abr: 'Educ.'
  },
  {
    full: 'Elections Code - ELEC',
    abr: 'Elec.'
  },
  {
    full: 'Evidence Code - EVID',
    abr: 'Evid.'
  },
  {
    full: 'Family Code - FAM',
    abr: 'Fam.'
  },
  {
    full: 'Financial Code - FIN',
    abr: 'Fin.'
  },
  {
    full: 'Fish and Game Code - FGC',
    abr: 'Fish & Game'
  },
  {
    full: 'Food and Agricultural Code - FAC',
    abr: 'Food & Agric.'
  },
  {
    full: 'Government Code - GOV',
    abr: 'Gov’t'
  },
  {
    full: 'Harbors and Navigation Code - HNC',
    abr: 'Harb. & Nav.'
  },
  {
    full: 'Health and Safety Code - HSC',
    abr: 'Health & Safety'
  },
  {
    full: 'Insurance Code - INS',
    abr: 'Ins.'
  },
  {
    full: 'Labor Code - LAB',
    abr: 'Lab.'
  },
  {
    full: 'Military and Veterans Code - MVC',
    abr: 'Mil. & Vet.'
  },
  {
    full: 'Penal Code - PEN',
    abr: 'Penal'
  },
  {
    full: 'Probate Code - PROB',
    abr: 'Prob.'
  },
  {
    full: 'Public Contract Code - PCC',
    abr: 'Pub. Cont.'
  },
  {
    full: 'Public Resources Code - PRC',
    abr: 'Pub. Res.'
  },
  {
    full: 'Public Utilities Code - PUC',
    abr: 'Pub. Util.'
  },
  {
    full: 'Revenue and Taxation Code - RTC',
    abr: 'Rev. & Tax.'
  },
  {
    full: 'Streets and Highways Code - SHC',
    abr: 'Sts. & High.'
  },
  {
    full: 'Unemployment Insurance Code - UIC',
    abr: 'Unemp. Ins.'
  },
  {
    full: 'Vehicle Code - VEH',
    abr: 'Veh.'
  },
  {
    full: 'Water Code - WAT',
    abr: 'Water'
  },
  {
    full: 'Welfare and Institutions Code - WIC',
    abr: 'Welf. & Inst.'
  },
]

const statsSelectors = [
  {
    selector: 'div#manylawsections > div > font > div',
    res_body: {
      heading: 'h6 > a',
      p: ['p[style="margin:0;display:inline;"]'],
      note: 'p[style="margin:0 0 2em 0;font-size:0.9em;"] > i'
    }
  },
  {
    selector: '#expandedbranchcodesid > div',
    res_body: {
      url: 'a@href',
      heading: 'a > div:nth-child(1) | replace',
      range: 'a > div[style="float:right;width:15%;"] | replace',
    }
  },

]
const selectors = [

  {
    selector: '#codestocheader > div.displaycodeleftmargin > div.codesIndexTblLeftdiv > div:nth-child(1)',
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
]

var ListOfCategoties = []
var CaliforniaCode = 'California Code'

getData = (err, res) => {
  if (!err) {

    if (res.length === 0) return
    res.forEach((item) => {
      console.log('item = ', item)

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

      x(item.url, selectors[1].selector, [selectors[1].res_body])((err, categories) => {
        if (!err) {
          if (res.length === 0) return

          categories.forEach((category, i) => {
            let ListOfCodes = []
            x(category.url, statsSelectors[0].selector, [statsSelectors[0].res_body])((err, codes) => {

              // if (codes.length === 0) {
              //   x(category.url, statsSelectors[1].selector, [statsSelectors[1].res_body])((err, categories) => {
              //     if (!err) {
              //       categories.forEach((lvl, index) => {
              //         if (!_.isEmpty(lvl.p)) {
              //           categories.forEach((firstUrl) => {
              //             x(firstUrl.url, statsSelectors[0].selector, [statsSelectors[0].res_body])((err, codes) => {
              //               console.log(categories, ' -------------- ', codes)
              //
              //               codes.forEach((code)=>{
              //                 let Code = {}
              //                 Code['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              //                 Code['-is_citable'] = true
              //                 Code['-is_document'] = true
              //                 Code['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + firstUrl.heading + firstUrl.range
              //                 Code['stat:Citation'] = 'Cal. ' + AbrCategories[0].abr + ' Code § ' + code.heading
              //                 Code['stat:Text'] = {}
              //                 Code['stat:Text']['stat:heading'] = code.heading
              //                 Code['stat:Text']['stat:p'] = code.p
              //                 Code['stat:Text']['stat:Note'] = code.note
              //
              //                 ListOfCodes[index] = Code
              //               })
              //
              //               let Category = {}
              //               Category['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              //               Category['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + category.heading
              //               Category['stat:Text'] = {}
              //               Category['stat:Text']['stat:heading'] = category.heading
              //
              //               Category['stat:Level'] = ListOfCodes
              //
              //               ListOfCategoties[i] = Category
              //
              //               doc['stat:Document']['stat:Level']['stat:Level'] = []
              //               doc['stat:Document']['stat:Level']['stat:Level']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              //               doc['stat:Document']['stat:Level']['stat:Level']['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
              //               doc['stat:Document']['stat:Level']['stat:Level'] = ListOfCategoties
              //
              //               // fs.writeFile('./results/json/second-scrap/' + item.heading + '/' + item.heading + '.json', JSON.stringify(doc, null, 4), () => {
              //               // })
              //             })
              //           })
              //         }
              //         x(lvl.url, statsSelectors[1].selector, [statsSelectors[1].res_body])((err, response) => {
              //           if (response.length !== 0) {
              //             response.forEach((firstUrl) => {
              //               x(firstUrl.url, statsSelectors[0].selector, [statsSelectors[0].res_body])((err, codes) => {
              //                 console.log(response, ' -------------- ', codes)
              //
              //                 codes.forEach((code)=>{
              //                   let Code = {}
              //                   Code['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              //                   Code['-is_citable'] = true
              //                   Code['-is_document'] = true
              //                   Code['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + firstUrl.heading + firstUrl.range
              //                   Code['stat:Citation'] = 'Cal. ' + AbrCategories[0].abr + ' Code § ' + code.heading
              //                   Code['stat:Text'] = {}
              //                   Code['stat:Text']['stat:heading'] = code.heading
              //                   Code['stat:Text']['stat:p'] = code.p
              //                   Code['stat:Text']['stat:Note'] = code.note
              //
              //                   ListOfCodes[index] = Code
              //                 })
              //
              //                 let Category = {}
              //                 Category['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              //                 Category['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + category.heading
              //                 Category['stat:Text'] = {}
              //                 Category['stat:Text']['stat:heading'] = category.heading
              //
              //                 Category['stat:Level'] = ListOfCodes
              //
              //                 ListOfCategoties[i] = Category
              //
              //                 doc['stat:Document']['stat:Level']['stat:Level'] = []
              //                 doc['stat:Document']['stat:Level']['stat:Level']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              //                 doc['stat:Document']['stat:Level']['stat:Level']['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
              //                 doc['stat:Document']['stat:Level']['stat:Level'] = ListOfCategoties
              //
              //                 // fs.writeFile('./results/json/second-scrap/' + item.heading + '/' + item.heading + '.json', JSON.stringify(doc, null, 4), () => {
              //                 // })
              //               })
              //             })
              //           }
              //         })
              //       })
              //       console.log(categories)
              //     }
              //   })
              // }

              codes.forEach((element, index) => {
                // console.log(element)
                let Code = {}
                Code['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
                Code['-is_citable'] = true
                Code['-is_document'] = true
                Code['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
                Code['stat:Citation'] = 'Cal. ' + AbrCategories[0].abr + ' Code § ' + element.heading
                Code['stat:Text'] = {}
                Code['stat:Text']['stat:heading'] = element.heading
                Code['stat:Text']['stat:p'] = element.p
                Code['stat:Text']['stat:Note'] = element.note

                ListOfCodes[index] = Code
                // console.log(ListOfCodes)
              })

              let Category = {}
              Category['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              Category['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading + '/' + category.heading
              Category['stat:Text'] = {}
              Category['stat:Text']['stat:heading'] = category.heading

              Category['stat:Level'] = ListOfCodes

              ListOfCategoties[i] = Category

              doc['stat:Document']['stat:Level']['stat:Level'] = []
              doc['stat:Document']['stat:Level']['stat:Level']['-id'] = shortid.generate() + shortid.generate() + shortid.generate()
              doc['stat:Document']['stat:Level']['stat:Level']['-path'] = '/us/californiacode/' + CaliforniaCode + '/' + item.heading
              doc['stat:Document']['stat:Level']['stat:Level'] = ListOfCategoties

              fs.writeFile('./results/json/second-scrap/' + item.heading + '/' + item.heading + '.json', JSON.stringify(doc, null, 4), () => {
              })

            })


          })
        }
      })


    })
  }
  else {
    console.log(err)
    console.error(err)
  }
}
x(URL, selectors[0].selector, [selectors[0].res_body])(getData)
