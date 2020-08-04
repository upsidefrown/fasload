/* eslint no-undef: 0 */ // --> OFF

const { formatKeyVal, formatToAxios } = require('../format')

test('format nested key value array to key value map', () => {
  const keyValArr = [
    ['key1', 'val1'],
    ['key2', ''], // shouldn't be included
    ['', ''] // shouldn't be included
  ]

  const formatted = formatKeyVal(keyValArr)

  expect(formatted).toHaveProperty('key1', 'val1')
  expect(formatted).toMatchObject({'key1': 'val1'})
})

test('format request object to Axios config object', () => {
  const request = {
    url: 'http://tester',
    method: 'get',
    params: {
      form: [['paramkey', 'paramval']]
    },
    headers: {
      form: [['headerkey', 'headerval']]
    },
    body: {
      active: 'form',
      form: [['formkey', 'formval']],
      text: 'yippie'
    }
  }

  expect(formatToAxios(request)).toMatchObject({
    url: 'http://tester',
    method: 'get',
    params: {paramkey: 'paramval'},
    headers: {headerkey: 'headerval'},
    body: {formkey: 'formval'}
  })

  request.body.active = 'text' // change to 'text type

  expect(formatToAxios(request)).toHaveProperty('body', 'yippie')
})
