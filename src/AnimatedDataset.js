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
  durationByAttr = {},
  delayByAttr = {},
  easingByAttr = {},
  easing = easeCubic,
  children,
}) {
  const ref = React.createRef()
  const refOldAttrs = React.useRef()

  React.useLayoutEffect(() => {
    if (!ref.current) return

    const attrs = mapKeys(unparsedAttrs, parseAttributeName)
    const init = mapKeys(unparsedInit, parseAttributeName)
    const events = mapKeys(unparsedEvents, parseEventName)
    const durationByAttrParsed = mapKeys(durationByAttr, parseAttributeName)
    const delayByAttrParsed = mapKeys(delayByAttr, parseAttributeName)
    const easingByAttrParsed = mapKeys(easingByAttr, parseAttributeName)

    const attrsList = Object.keys(attrs).filter(a => a !== 'text')
    const eventsList = Object.keys(events)
    const oldAttrs = refOldAttrs.current || {}

    const animate = () => {
      select(ref.current)
        .selectAll(tag)
        .data(dataset, function (d) { return (d && keyFn(d)) || select(this).attr("data-key"); })
        .join(
          enter => {
            const enterEls = enter
              .append(tag)
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
                attrsList.forEach(a => {
                  const tran = disableAnimation
                    ? sel
                    : sel
                        .transition(a)
                        .ease(easingByAttrParsed.hasOwnProperty(a) ? easingByAttrParsed[a] : easing)
                        .delay(delayByAttrParsed.hasOwnProperty(a) ? delayByAttrParsed[a] : delay)
                        .duration(
                          durationByAttrParsed.hasOwnProperty(a)
                            ? durationByAttrParsed[a]
                            : duration
                        )

                  tran.attr(a, attrs[a])
                })
              })
            if (attrs.text) enterEls.text(attrs.text)
            return enterEls
          },

          update => {
            const updateEls = update
              .call(sel => {
                attrsList.forEach(a => {
                    const tran = disableAnimation
                      ? sel
                      : sel
                        .transition(a)
                        .ease(easingByAttrParsed.hasOwnProperty(a) ? easingByAttrParsed[a] : easing)
                        .delay(delayByAttrParsed.hasOwnProperty(a) ? delayByAttrParsed[a] : delay)
                        .duration(
                          durationByAttrParsed.hasOwnProperty(a) ? durationByAttrParsed[a] : duration
                        )

                    tran.attr(a, attrs[a])
                  }
                )
              })
            if (attrs.text) updateEls.text(attrs.text)
            return updateEls;
          },

          exit =>
            exit.call(sel => {
              attrsList.forEach(a => {
                const tran = disableAnimation
                  ? sel
                  : sel
                      .transition(a)
                      .ease(easingByAttrParsed.hasOwnProperty(a) ? easingByAttrParsed[a] : easing)
                      .delay(delayByAttrParsed.hasOwnProperty(a) ? delayByAttrParsed[a] : delay)
                      .duration(
                        durationByAttrParsed.hasOwnProperty(a) ? durationByAttrParsed[a] : duration
                      )

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
    durationByAttr,
    delayByAttr,
    easingByAttr,
  ])

  return React.createElement(
    'g',
    { ref },
    // Create the structure first so that react can add the children
    children && dataset.map(
      (data) => React.createElement(
        tag,
        { key: keyFn(data), 'data-key': keyFn(data) },
        children && React.Children.toArray(children)
          .map(child => React.cloneElement(child, { key: child.toString(), dataset: [data] }))
      )
    )
  )
}
