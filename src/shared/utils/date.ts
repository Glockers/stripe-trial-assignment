export function convertUnixTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function getEndOfDayTimestamp(): number {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return Math.floor(now.getTime() / 1000);
}
