import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCountdown, getNextTickDelay } from '../src/lib/countdown.ts'
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

test('next tick wakes at the moment the displayed second changes', () => {
  assert.equal(getNextTickDelay(target, target - 5400), 400)
  assert.equal(getNextTickDelay(target, target - 5000), 1000)
  assert.equal(getNextTickDelay(target, target - 400), 400)
  assert.equal(getNextTickDelay(target, target - 1), 1)
})

test('next tick stops asking for a delay once the release has passed', () => {
  assert.equal(getNextTickDelay(target, target), 0)
  assert.equal(getNextTickDelay(target, target + 5000), 0)
})

test('ticking by the computed delay never skips or repeats a second, even with timer jitter', () => {
  const jitter = [0, 3, 12, 0, 7, 1, 25, 0, 4, 9]
  let now = target - 60000 - 537
  let shown = getCountdown(target, now).seconds
  let steps = 0
  while (!getCountdown(target, now).isComplete && steps < 200) {
    now += getNextTickDelay(target, now) + jitter[steps % jitter.length]
    const next = getCountdown(target, now)
    if (!next.isComplete) assert.equal((shown - next.seconds + 60) % 60, 1, `step ${steps}`)
    shown = next.seconds
    steps++
  }
  assert.ok(getCountdown(target, now).isComplete)
  assert.ok(now - target < 30, 'completion is detected within the timer jitter of the release')
})
