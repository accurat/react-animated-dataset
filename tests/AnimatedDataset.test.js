import React from 'react'
import { mount } from 'enzyme'
import { AnimatedDataset } from '../src/AnimatedDataset'

console.log('React.version', React.version)

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
          keyFn={p => p.x}
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
        <AnimatedDataset tag="rect" dataset={dataset} attrs={attrs} keyFn={p => p.x} />
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
        <AnimatedDataset dataset={[]} attrs={attrs} keyFn={p => p.x} />
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
          keyFn={t => t}
        />
      </svg>
    )

    expect(wrapper.find('g').html()).toMatchInlineSnapshot(`"<g><text>Hello World</text></g>"`)
  })

  it('should accept camel case attribute name', () => {
    const wrapper = mount(
      <svg>
        <AnimatedDataset dataset={dataset} attrs={{ strokeWidth: 10 }} key={p => p.x} />
      </svg>
    )

    expect(wrapper.find('g').html()).toMatchInlineSnapshot(
      `"<g><rect stroke-width=\\"10\\"></rect><rect stroke-width=\\"10\\"></rect></g>"`
    )
  })

  it('should accept events', () => {
    const onClick = jest.fn()

    const wrapper = mount(
      <svg>
        <AnimatedDataset
          tag="rect"
          dataset={dataset}
          attrs={attrs}
          key={p => p.x}
          events={{ onClick }}
          disableAnimation
        />
      </svg>
    )

    expect(onClick).toBeCalledTimes(0)

    const index = 1
    const firstCircle = wrapper
      .find('g')
      .getDOMNode()
      .getElementsByTagName('rect')
      .item(index)
    dispatch(firstCircle, new Event('click'))

    expect(onClick).toBeCalledTimes(1)

    const callArguments = onClick.mock.calls[0]
    expect(callArguments[0]).toEqual(dataset[index])
    expect(callArguments[1]).toEqual(index)
  })

  it('should allow nested nodes', () => {
    const wrapper = mount(
      <svg>
        <AnimatedDataset
          dataset={['Hello World', 'Goodbye World']}
          tag="a"
          attrs={{ href: "#test" }}
          keyFn={t => t}
          disableAnimation
        >
          <AnimatedDataset
            tag="text"
            attrs={{ text: t => t }}
            keyFn={t => t}
            disableAnimation
          />
        </AnimatedDataset>
      </svg>
    )

    expect(wrapper.find('g').first().html()).toMatchInlineSnapshot(
      `"<g><a data-key=\\"Hello World\\" href=\\"#test\\"><g><text>Hello World</text></g></a><a data-key=\\"Goodbye World\\" href=\\"#test\\"><g><text>Goodbye World</text></g></a></g>"`
    )
  })
})
