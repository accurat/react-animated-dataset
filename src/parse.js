export function parseAttributeName(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase()
}

export function parseEventName(str) {
  return str.replace(/on(.*)/, '$1').toLowerCase()
}
