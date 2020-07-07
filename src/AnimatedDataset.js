import React from 'react'
import { select } from 'd3-selection'
import 'd3-transition'

export function AnimatedDataset({
  dataset,
  attrs,
  tag = 'rect',
  init = {},
  keyFn = d => d.key,
  duration = 1000,
  delay = 0,
  disableAnimation = false,
}) {
  const ref = React.createRef()
  const refOldAttrs = React.useRef()

  React.useLayoutEffect(() => {
    if (!ref.current) return

    const attrsList = Object.keys(attrs).filter(a => !a.startsWith('on-') && a !== 'text')
    const attrsListListeners = Object.keys(attrs).filter(a => a.startsWith('on-'))
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
                attrsListListeners.forEach(a => {
                  const eventName = a.match(/on-(.*)/)[1]
                  sel.on(eventName, attrs[a])
                })
              })
              .call(sel => {
                const tran = disableAnimation
                  ? sel
                  : sel
                      .transition()
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
  }, [dataset, init, keyFn, ref, tag, attrs, duration, disableAnimation])

  return React.createElement('g', { ref })
}
