export function getTimePart(date: Date): string {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
