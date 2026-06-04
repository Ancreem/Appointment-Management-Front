/**
 * Date utility helpers using dayjs.
 * Full implementation in Stage 6/7 when form pages need formatting.
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Formats an ISO-8601 date string to a human-readable local format.
 * Example: "2025-09-01T10:00:00Z" → "Sep 1, 2025 10:00 AM"
 */
export function formatDateTime(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY h:mm A')
}

/**
 * Formats an ISO-8601 date string to a short date.
 * Example: "2025-09-01T10:00:00Z" → "Sep 1, 2025"
 */
export function formatDate(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY')
}

/**
 * Converts a dayjs/Date object to an ISO-8601 string with timezone offset
 * suitable for the backend (OffsetDateTime).
 */
export function toIsoString(date: Date | string): string {
  return dayjs(date).toISOString()
}
