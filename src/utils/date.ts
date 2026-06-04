/**
 * Date utility helpers using dayjs.
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Formats an ISO-8601 date string to a human-readable datetime.
 * Example: "2026-06-05T10:00:00Z" → "Jun 5, 2026 10:00 AM"
 */
export function formatDateTime(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY h:mm A')
}

/**
 * Formats an ISO-8601 date string to a short date.
 * Example: "2026-06-05T10:00:00Z" → "Jun 5, 2026"
 */
export function formatDate(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY')
}

/**
 * Converts a Date or date string to an ISO-8601 string suitable for the
 * backend (OffsetDateTime). Keeps the local timezone offset.
 */
export function toISOString(date: Date | string): string {
  return dayjs(date).toISOString()
}

/** @deprecated Use toISOString instead */
export const toIsoString = toISOString
