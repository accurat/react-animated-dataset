import 'core-js/modules/es.array.filter';
import 'core-js/modules/es.array.for-each';
import 'core-js/modules/es.array.join';
import 'core-js/modules/es.object.keys';
import 'core-js/modules/es.regexp.exec';
import 'core-js/modules/es.string.match';
import 'core-js/modules/es.string.starts-with';
import 'core-js/modules/web.dom-collections.for-each';
import React from 'react';
import { select } from 'd3';

function AnimatedDataset(_ref) {
  var dataset = _ref.dataset,
      attrs = _ref.attrs,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? 'rect' : _ref$tag,
      _ref$init = _ref.init,
      init = _ref$init === void 0 ? {} : _ref$init,
      _ref$keyFn = _ref.keyFn,
      keyFn = _ref$keyFn === void 0 ? function (d) {
    return d.key;
  } : _ref$keyFn,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 1000 : _ref$duration,
      _ref$disableAnimation = _ref.disableAnimation,
      disableAnimation = _ref$disableAnimation === void 0 ? false : _ref$disableAnimation;
  var ref = React.createRef();
  var refOldAttrs = React.useRef();
  React.useLayoutEffect(function () {
    if (!ref.current) return;
    var attrsList = Object.keys(attrs).filter(function (a) {
      return !a.startsWith('on-') && a !== 'text';
    });
    var attrsListListeners = Object.keys(attrs).filter(function (a) {
      return a.startsWith('on-');
    });
    var oldAttrs = refOldAttrs.current || {};

    var animate = function animate() {
      select(ref.current).selectAll(tag).data(dataset, keyFn).join(function (enter) {
        return enter.append(tag).text(attrs.text).call(function (sel) {
          attrsList.forEach(function (a) {
            sel.attr(a, init.hasOwnProperty(a) ? init[a] : oldAttrs.hasOwnProperty(a) ? oldAttrs[a] : attrs[a]);
          });
        }).call(function (sel) {
          attrsListListeners.forEach(function (a) {
            var eventName = a.match(/on-(.*)/)[1];
            sel.on(eventName, attrs[a]);
          });
        }).call(function (sel) {
          var tran = disableAnimation ? sel : sel.transition().duration(duration);
          attrsList.forEach(function (a) {
            tran.attr(a, attrs[a]);
          });
        });
      }, function (update) {
        return update.text(attrs.text).call(function (sel) {
          var tran = disableAnimation ? sel : sel.transition().duration(duration);
          attrsList.forEach(function (a) {
            tran.attr(a, attrs[a]);
          });
        });
      }, function (exit) {
        return exit.call(function (sel) {
          var tran = disableAnimation ? sel : sel.transition().duration(duration);
          attrsList.forEach(function (a) {
            tran.attr(a, init.hasOwnProperty(a) ? init[a] : attrs[a]).remove();
          });
        });
      });
      refOldAttrs.current = attrs;
    };

    if (disableAnimation) {
      animate();
    } else {
      requestAnimationFrame(animate);
    }
  }, [dataset, init, keyFn, ref, tag, attrs, duration, disableAnimation]);
  return React.createElement('g', {
    ref: ref
  });
}

export { AnimatedDataset };
