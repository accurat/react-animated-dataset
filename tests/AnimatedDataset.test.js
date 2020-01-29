import React from 'react'
import { mount } from 'enzyme'
import { AnimatedDataset } from '../src/AnimatedDataset'

afterEach(() => {
  jest.clearAllMocks()
})

describe(AnimatedDataset, () => {
  const x = jest.fn(p => p.x)
  const y = jest.fn(p => p.y)

  const dataset = [
    { x: 0, y: 0 },
    { x: 1, y: 10 },
  ]

  const attrs = { x, y }

  it('should append element with animation disabled', () => {
    const wrapper = mount(
      <svg>
        <AnimatedDataset
          tag="rect"
          dataset={dataset}
          attrs={attrs}
          key={p => p.x}
          disableAnimation
        />
      </svg>
    )

    expect(x).toBeCalledTimes(4)
    expect(y).toBeCalledTimes(4)

    expect(wrapper.find('g').html()).toMatchInlineSnapshot(
      `"<g><rect x=\\"0\\" y=\\"0\\"></rect><rect x=\\"1\\" y=\\"10\\"></rect></g>"`
    )
  })

  it('should append element with animation enabled', () => {
    const spyRaf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb())

    const wrapper = mount(
      <svg>
        <AnimatedDataset tag="rect" dataset={dataset} attrs={attrs} key={p => p.x} />
      </svg>
    )

    expect(spyRaf).toBeCalledTimes(1)
    expect(x).toBeCalledTimes(4)
    expect(y).toBeCalledTimes(4)

    expect(wrapper.find('g').html()).toMatchInlineSnapshot(
      `"<g><rect x=\\"0\\" y=\\"0\\"></rect><rect x=\\"1\\" y=\\"10\\"></rect></g>"`
    )
  })

  it('should render empty <g> with empty dataset', () => {
    const wrapper = mount(
      <svg>
        <AnimatedDataset dataset={[]} attrs={attrs} key={p => p.x} />
      </svg>
    )

    expect(x).toBeCalledTimes(0)
    expect(y).toBeCalledTimes(0)

    expect(wrapper.find('g').html()).toMatchInlineSnapshot(`"<g></g>"`)
  })

  it('should add text attr as child only', () => {
    const wrapper = mount(
      <svg>
        <AnimatedDataset
          dataset={['Hello World']}
          tag="text"
          attrs={{ text: t => t }}
          key={t => t}
        />
      </svg>
    )

    expect(wrapper.find('g').html()).toMatchInlineSnapshot(`"<g><text>Hello World</text></g>"`)
  })
})
