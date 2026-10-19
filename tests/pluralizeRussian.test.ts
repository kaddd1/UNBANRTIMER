import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pluralizeRussian } from '../src/lib/pluralizeRussian.ts'

const units = [
  ['ДЕНЬ', 'ДНЯ', 'ДНЕЙ'],
  ['ЧАС', 'ЧАСА', 'ЧАСОВ'],
  ['МИНУТА', 'МИНУТЫ', 'МИНУТ'],
  ['СЕКУНДА', 'СЕКУНДЫ', 'СЕКУНД'],
] as const

for (const forms of units) {
  test(`selects Russian forms for ${forms[0]}`, () => {
    for (const value of [1, 21, 31, 101, 121, 1001]) {
      assert.equal(pluralizeRussian(value, forms), forms[0], String(value))
    }
    for (const value of [2, 3, 4, 22, 23, 24, 82, 102, 122]) {
      assert.equal(pluralizeRussian(value, forms), forms[1], String(value))
    }
    for (const value of [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 100, 110, 111, 112, 113, 114, 115, 1011, 1012, 1013, 1014]) {
      assert.equal(pluralizeRussian(value, forms), forms[2], String(value))
    }
  })
}
