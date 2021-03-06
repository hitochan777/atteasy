export function getTimePart(date: Date, withColon = true): string {
  const hourStr = `${date.getHours()}`;
  const minStr = `${date.getMinutes()}`;
  const secStr = `${date.getSeconds()}`;
  const timeArray = [hourStr, minStr, secStr];
  const delimiter = withColon ? ":" : "";
  return timeArray.map((timeStr) => timeStr.padStart(2, "0")).join(delimiter);
}

export function extractTimeInfo(
  timeStr: string
): { hour: number; minute: number; second: number } {
  const hour = +timeStr.substr(0, 2);
  const minute = +timeStr.substr(2, 2);
  const second = +timeStr.substr(4, 2);
  return { hour, minute, second };
}
