interface CountdownConfig {
  startsAt: string | null
  endsAt: string
  timeZone: string
}

export const countdownConfig: CountdownConfig = {
  startsAt: '2026-10-12T00:00:00+05:00',
  endsAt: '2027-01-10T00:00:00+05:00',
  timeZone: 'Asia/Tashkent',
} as const
