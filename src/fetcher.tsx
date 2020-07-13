export const fetcher = (endpoint: string, ...args: any[]) =>
  fetch(endpoint, ...args).then((res) => res.json());
