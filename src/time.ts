export function getTimePart(date: Date, withColon = true): string {
  const hourStr = `${date.getHours()}`;
  const minStr= `${date.getMinutes()}`;
  const secStr = `${date.getSeconds()}`;
  const timeArray = [hourStr, minStr, secStr];
  const delimiter = withColon ? ":" : "";
  return timeArray.map(timeStr => timeStr.padStart(2, "0")).join(delimiter);
}
