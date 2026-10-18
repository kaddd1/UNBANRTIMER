import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCountdown } from '../src/lib/countdown.ts'
import { countdownConfig } from '../src/config/countdown.ts'

const target = Date.parse(countdownConfig.endsAt)

test('configured release is midnight in Tashkent, independently of device timezone', () => {
  assert.equal(new Date(target).toISOString(), '2027-01-09T19:00:00.000Z')
})

test('splits remaining time into days, hours, minutes and seconds', () => {
  assert.deepEqual(getCountdown(target, target - 90061000), {
    days: 1, hours: 1, minutes: 1, seconds: 1, isComplete: false,
  })
})

test('keeps the last partial second active until the exact release', () => {
  assert.equal(getCountdown(target, target - 1).seconds, 1)
  assert.equal(getCountdown(target, target - 1).isComplete, false)
})

test('returns zero and completion at release and for past targets', () => {
  for (const now of [target, target + 1, target + 86400000]) {
    assert.deepEqual(getCountdown(target, now), {
      days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true,
    })
  }
})

test('recalculates from wall time after a long pause or reload', () => {
  const before = getCountdown(target, target - 100000)
  const after = getCountdown(target, target - 35000)
  assert.equal(before.minutes * 60 + before.seconds, 100)
  assert.equal(after.minutes * 60 + after.seconds, 35)
})

test('rejects invalid date values', () => {
  assert.throws(() => getCountdown(Number.NaN, target))
  assert.throws(() => getCountdown(target, Number.NaN))
})
