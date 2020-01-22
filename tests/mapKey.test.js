import { mapKeys } from '../src/mapKey'

describe(mapKeys, () => {
  it('should return new object with new keys', () => {
    const ob = { x: 1, y: 2 }
    const res = mapKeys(ob, key => key.toUpperCase())

    expect(res).toEqual({ X: 1, Y: 2 })
  })

  it('should return overrided duplicated keys', () => {
    const ob = { x: 1, y: 2 }
    const res = mapKeys(ob, _ => 'z')

    expect(res).toEqual({ z: 2 })
  })
})
