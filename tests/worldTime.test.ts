import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getWorldTime } from '../src/lib/worldTime.ts'

test('Tashkent uses its real zone and 24-hour time across UTC midnight', () => {
  const time = getWorldTime('Asia/Tashkent', Date.parse('2026-10-20T19:00:00Z'))
  assert.equal(time.digital, '00:00:00')
  assert.equal(time.offset, 'UTC+05:00')
  assert.deepEqual(time.angles, { hour: 0, minute: 0, second: 0 })
})

test('London changes from GMT to summer time at the spring boundary', () => {
  const before = getWorldTime('Europe/London', Date.parse('2026-03-29T00:59:59Z'))
  const after = getWorldTime('Europe/London', Date.parse('2026-03-29T01:00:00Z'))
  assert.equal(before.digital, '00:59:59')
  assert.equal(before.offset, 'UTC+00:00')
  assert.equal(after.digital, '02:00:00')
  assert.equal(after.offset, 'UTC+01:00')
})

test('London changes back to GMT at the autumn boundary', () => {
  const before = getWorldTime('Europe/London', Date.parse('2026-10-25T00:59:59Z'))
  const after = getWorldTime('Europe/London', Date.parse('2026-10-25T01:00:00Z'))
  assert.equal(before.digital, '01:59:59')
  assert.equal(before.offset, 'UTC+01:00')
  assert.equal(after.digital, '01:00:00')
  assert.equal(after.offset, 'UTC+00:00')
})

test('hands include fractional seconds and correctly point at 12:30', () => {
  const time = getWorldTime('Asia/Tashkent', Date.parse('2026-10-20T07:30:00.500Z'))
  assert.equal(time.digital, '12:30:00')
  assert.equal(time.angles.second, 3)
  assert.equal(time.angles.minute, 180.05)
  assert.ok(Math.abs(time.angles.hour - 15.0041666667) < 0.000001)
})
