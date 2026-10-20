import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatTermProgress, getTermProgress } from '../src/lib/progress.ts'
import { countdownConfig } from '../src/config/countdown.ts'

const start = '2026-01-01T00:00:00Z'
const end = '2026-01-11T00:00:00Z'
const startTime = Date.parse(start)
const endTime = Date.parse(end)

test('calculates actual interval progress and fractional percentages', () => {
  assert.equal(getTermProgress(start, end, (startTime + endTime) / 2), 50)
  assert.equal(getTermProgress(start, end, startTime + (endTime - startTime) / 8), 12.5)
})

test('clamps before the start and after the end', () => {
  assert.equal(getTermProgress(start, end, startTime - 1), 0)
  assert.equal(getTermProgress(start, end, startTime), 0)
  assert.equal(getTermProgress(start, end, endTime), 100)
  assert.equal(getTermProgress(start, end, endTime + 1), 100)
})

test('does not invent a percentage without a start date', () => {
  assert.equal(getTermProgress(null, end, startTime), null)
  assert.equal(getTermProgress(null, end, endTime), 100)
})

test('rejects invalid and reversed intervals without division by zero', () => {
  assert.equal(getTermProgress(end, start, startTime), null)
  assert.equal(getTermProgress(end, end, startTime), null)
  assert.equal(getTermProgress('invalid', end, startTime), null)
  assert.equal(getTermProgress(start, 'invalid', startTime), null)
  assert.equal(getTermProgress(start, end, Number.NaN), null)
})

test('uses wall time after a pause rather than incrementing a saved percentage', () => {
  assert.equal(getTermProgress(start, end, startTime + (endTime - startTime) / 4), 25)
  assert.equal(getTermProgress(start, end, startTime + (endTime - startTime) * .75), 75)
})

test('existing configured release reaches 100 even when the start is missing', () => {
  assert.equal(getTermProgress(null, countdownConfig.endsAt, Date.parse(countdownConfig.endsAt)), 100)
})

test('shows two decimals and never rounds to 100 before the deadline', () => {
  assert.equal(formatTermProgress(null), '—')
  assert.equal(formatTermProgress(0), '0.00%')
  assert.equal(formatTermProgress(12.345), '12.35%')
  assert.equal(formatTermProgress(getTermProgress(start, end, endTime - 1)), '99.99%')
  assert.equal(formatTermProgress(getTermProgress(start, end, endTime)), '100.00%')
})

test('configured 90-day interval uses explicit UTC+05:00 boundaries', () => {
  const configuredStart = Date.parse(countdownConfig.startsAt!)
  const configuredEnd = Date.parse(countdownConfig.endsAt)
  assert.equal(new Date(configuredStart).toISOString(), '2026-10-11T19:00:00.000Z')
  assert.equal(configuredEnd - configuredStart, 90 * 86400000)
  assert.equal(getTermProgress(countdownConfig.startsAt, countdownConfig.endsAt, configuredStart), 0)
  assert.equal(getTermProgress(countdownConfig.startsAt, countdownConfig.endsAt, configuredEnd), 100)
})
