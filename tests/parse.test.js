import { parseAttributeName, parseEventName } from '../src/parse'

describe(parseAttributeName, () => {
  it('should convert camel case to kebab case', () => {
    expect(parseAttributeName('fontSize')).toEqual('font-size')
    expect(parseAttributeName('HTMLInputElement')).toEqual('html-input-element')
  })

  it('should keep numbers', () => {
    expect(parseAttributeName('x1')).toEqual('x1')
  })
})

describe(parseEventName, () => {
  it('should convert camel case to kebab case', () => {
    expect(parseEventName('onClick')).toEqual('click')
    expect(parseEventName('onMouseDown')).toEqual('mousedown')
  })

  it('should convert camel case to kebab case', () => {
    expect(parseEventName('click')).toEqual('click')
    expect(parseEventName('mousedown')).toEqual('mousedown')
  })
})
