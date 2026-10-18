/** Edit this ISO date with an explicit UTC offset to change the countdown. */
interface CountdownConfig {
  startsAt: string | null
  endsAt: string
  timeZone: string
}

export const countdownConfig: CountdownConfig = {
  // Укажи фактическую дату начала бана в ISO-формате с часовым поясом.
  startsAt: '2026-10-12T00:00:00+05:00',
  endsAt: '2027-01-10T00:00:00+05:00',
  timeZone: 'Asia/Tashkent',
} as const
