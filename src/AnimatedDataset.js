import React from 'react'
import { select } from 'd3-selection'
import 'd3-transition'
import { easeCubic } from 'd3-ease'
import { mapKeys } from './mapKey'
import { parseAttributeName, parseEventName } from './parse'

export function AnimatedDataset({
  dataset,
  attrs: unparsedAttrs,
  tag = 'rect',
  init: unparsedInit = {},
  events: unparsedEvents = {},
  keyFn = d => d.key,
  duration = 1000,
  delay = 0,
  disableAnimation = false,
  easing = easeCubic,
}) {
  const ref = React.createRef()
  const refOldAttrs = React.useRef()

  React.useLayoutEffect(() => {
    if (!ref.current) return

    const attrs = mapKeys(unparsedAttrs, parseAttributeName)
    const init = mapKeys(unparsedInit, parseAttributeName)
    const events = mapKeys(unparsedEvents, parseEventName)

    const attrsList = Object.keys(attrs).filter(a => a !== 'text')
    const eventsList = Object.keys(events)
    const oldAttrs = refOldAttrs.current || {}

    const animate = () => {
      select(ref.current)
        .selectAll(tag)
        .data(dataset, keyFn)
        .join(
          enter =>
            enter
              .append(tag)
              .text(attrs.text)
              .call(sel => {
                attrsList.forEach(a => {
                  sel.attr(
                    a,
                    init.hasOwnProperty(a)
                      ? init[a]
                      : oldAttrs.hasOwnProperty(a)
                      ? oldAttrs[a]
                      : attrs[a]
                  )
                })
              })
              .call(sel => {
                eventsList.forEach(event => {
                  sel.on(event, events[event])
                })
              })
              .call(sel => {
                const tran = disableAnimation
                  ? sel
                  : sel
                      .transition()
                      .ease(easing)
                      .delay(delay)
                      .duration(duration)

                attrsList.forEach(a => {
                  tran.attr(a, attrs[a])
                })
              }),
          update =>
            update.text(attrs.text).call(sel => {
              const tran = disableAnimation
                ? sel
                : sel
                    .transition()
                    .ease(easing)
                    .delay(delay)
                    .duration(duration)

              attrsList.forEach(a => {
                tran.attr(a, attrs[a])
              })
            }),
          exit =>
            exit.call(sel => {
              const tran = disableAnimation
                ? sel
                : sel
                    .transition()
                    .ease(easing)
                    .delay(delay)
                    .duration(duration)

              attrsList.forEach(a => {
                tran.attr(a, init.hasOwnProperty(a) ? init[a] : attrs[a]).remove()
              })
            })
        )
      refOldAttrs.current = attrs
    }

    if (disableAnimation) {
      animate()
    } else {
      requestAnimationFrame(animate)
    }
  }, [
    dataset,
    unparsedInit,
    keyFn,
    ref,
    tag,
    unparsedAttrs,
    duration,
    disableAnimation,
    unparsedEvents,
    delay,
    easing,
  ])

  return React.createElement('g', { ref })
}
