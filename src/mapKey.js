export function mapKeys(obj, fn) {
  const entries = Object.entries(obj)
  const mapped = entries.map(([k, v]) => [fn(k), v])
  return Object.fromEntries(mapped)
}
