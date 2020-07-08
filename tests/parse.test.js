import { parseAttributeName, parseEventName } from '../src/parse'

describe(parseAttributeName, () => {
  it('should convert camel case to kebab case', () => {
    expect(parseAttributeName('fontSize')).toEqual('font-size')
    expect(parseAttributeName('strokeWidth')).toEqual('stroke-width')
    expect(parseAttributeName('dominantBaseline')).toEqual('dominant-baseline')
    expect(parseAttributeName('HTMLInputElement')).toEqual('html-input-element')
  })

  it('should keep numbers', () => {
    expect(parseAttributeName('x1')).toEqual('x1')
  })

  it('should keep attribute name if already parsed', () => {
    expect(parseAttributeName('x')).toEqual('x')
    expect(parseAttributeName('stroke')).toEqual('stroke')
    expect(parseAttributeName('stroke-width')).toEqual('stroke-width')
  })
})

describe(parseEventName, () => {
  it('should convert camel case to kebab case', () => {
    expect(parseEventName('onClick')).toEqual('click')
    expect(parseEventName('onMouseDown')).toEqual('mousedown')
  })

  it('should keep event name if already parsed', () => {
    expect(parseEventName('click')).toEqual('click')
    expect(parseEventName('mousedown')).toEqual('mousedown')
  })
})
