const formatters = new Map<string, Intl.DateTimeFormat>()

export function getWorldTime(timeZone: string, timestamp: number) {
  let formatter = formatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'longOffset',
    })
    formatters.set(timeZone, formatter)
  }

  const parts = formatter.formatToParts(timestamp)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)!.value
  const hour = part('hour')
  const minute = part('minute')
  const second = part('second')
  const offset = part('timeZoneName').replace('GMT', 'UTC')

  // Fractional seconds keep the analog hands moving between digital ticks.
  const seconds = Number(second) + (timestamp % 1000) / 1000
  const minutes = Number(minute) + seconds / 60
  const hours = Number(hour) % 12 + minutes / 60

  return {
    digital: `${hour}:${minute}:${second}`,
    offset: offset === 'UTC' ? 'UTC+00:00' : offset,
    angles: { hour: hours * 30, minute: minutes * 6, second: seconds * 6 },
  }
}
