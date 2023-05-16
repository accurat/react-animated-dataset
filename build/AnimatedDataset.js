import React from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { easeCubic } from 'd3-ease';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function mapKeys(obj, fn) {
  var entries = Object.entries(obj);
  var mapped = entries.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];
    return [fn(k), v];
  });
  return Object.fromEntries(mapped);
}

function parseAttributeName(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2').toLowerCase();
}
function parseEventName(str) {
  return str.replace(/on(.*)/, '$1').toLowerCase();
}

function AnimatedDataset(_ref) {
  var dataset = _ref.dataset,
    unparsedAttrs = _ref.attrs,
    _ref$tag = _ref.tag,
    tag = _ref$tag === void 0 ? 'rect' : _ref$tag,
    _ref$init = _ref.init,
    unparsedInit = _ref$init === void 0 ? {} : _ref$init,
    _ref$events = _ref.events,
    unparsedEvents = _ref$events === void 0 ? {} : _ref$events,
    _ref$keyFn = _ref.keyFn,
    keyFn = _ref$keyFn === void 0 ? function (d) {
      return d.key;
    } : _ref$keyFn,
    _ref$duration = _ref.duration,
    duration = _ref$duration === void 0 ? 1000 : _ref$duration,
    _ref$delay = _ref.delay,
    delay = _ref$delay === void 0 ? 0 : _ref$delay,
    _ref$disableAnimation = _ref.disableAnimation,
    disableAnimation = _ref$disableAnimation === void 0 ? false : _ref$disableAnimation,
    _ref$durationByAttr = _ref.durationByAttr,
    durationByAttr = _ref$durationByAttr === void 0 ? {} : _ref$durationByAttr,
    _ref$delayByAttr = _ref.delayByAttr,
    delayByAttr = _ref$delayByAttr === void 0 ? {} : _ref$delayByAttr,
    _ref$easingByAttr = _ref.easingByAttr,
    easingByAttr = _ref$easingByAttr === void 0 ? {} : _ref$easingByAttr,
    _ref$easing = _ref.easing,
    easing = _ref$easing === void 0 ? easeCubic : _ref$easing,
    children = _ref.children;
  var ref = /*#__PURE__*/React.createRef();
  var refOldAttrs = React.useRef();
  React.useLayoutEffect(function () {
    if (!ref.current) return;
    var attrs = mapKeys(unparsedAttrs, parseAttributeName);
    var init = mapKeys(unparsedInit, parseAttributeName);
    var events = mapKeys(unparsedEvents, parseEventName);
    var durationByAttrParsed = mapKeys(durationByAttr, parseAttributeName);
    var delayByAttrParsed = mapKeys(delayByAttr, parseAttributeName);
    var easingByAttrParsed = mapKeys(easingByAttr, parseAttributeName);
    var attrsList = Object.keys(attrs).filter(function (a) {
      return a !== 'text';
    });
    var eventsList = Object.keys(events);
    var oldAttrs = refOldAttrs.current || {};
    var animate = function animate() {
      select(ref.current).selectAll(tag).data(dataset, function (d) {
        return d && keyFn(d) || select(this).attr("data-key");
      }).join(function (enter) {
        var enterEls = enter.append(tag).call(function (sel) {
          attrsList.forEach(function (a) {
            sel.attr(a, init.hasOwnProperty(a) ? init[a] : oldAttrs.hasOwnProperty(a) ? oldAttrs[a] : attrs[a]);
          });
        }).call(function (sel) {
          eventsList.forEach(function (event) {
            sel.on(event, events[event]);
          });
        }).call(function (sel) {
          attrsList.forEach(function (a) {
            var tran = disableAnimation ? sel : sel.transition(a).ease(easingByAttrParsed.hasOwnProperty(a) ? easingByAttrParsed[a] : easing).delay(delayByAttrParsed.hasOwnProperty(a) ? delayByAttrParsed[a] : delay).duration(durationByAttrParsed.hasOwnProperty(a) ? durationByAttrParsed[a] : duration);
            tran.attr(a, attrs[a]);
          });
        });
        if (attrs.text) enterEls.text(attrs.text);
        return enterEls;
      }, function (update) {
        var updateEls = update.call(function (sel) {
          attrsList.forEach(function (a) {
            var tran = disableAnimation ? sel : sel.transition(a).ease(easingByAttrParsed.hasOwnProperty(a) ? easingByAttrParsed[a] : easing).delay(delayByAttrParsed.hasOwnProperty(a) ? delayByAttrParsed[a] : delay).duration(durationByAttrParsed.hasOwnProperty(a) ? durationByAttrParsed[a] : duration);
            tran.attr(a, attrs[a]);
          });
        });
        if (attrs.text) updateEls.text(attrs.text);
        return updateEls;
      }, function (exit) {
        return exit.call(function (sel) {
          attrsList.forEach(function (a) {
            var tran = disableAnimation ? sel : sel.transition(a).ease(easingByAttrParsed.hasOwnProperty(a) ? easingByAttrParsed[a] : easing).delay(delayByAttrParsed.hasOwnProperty(a) ? delayByAttrParsed[a] : delay).duration(durationByAttrParsed.hasOwnProperty(a) ? durationByAttrParsed[a] : duration);
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
  }, [dataset, unparsedInit, keyFn, ref, tag, unparsedAttrs, duration, disableAnimation, unparsedEvents, delay, easing, durationByAttr, delayByAttr, easingByAttr]);
  return /*#__PURE__*/React.createElement('g', {
    ref: ref
  },
  // Create the structure first so that react can add the children
  children && dataset.map(function (data) {
    return /*#__PURE__*/React.createElement(tag, {
      key: keyFn(data),
      'data-key': keyFn(data)
    }, children && React.Children.toArray(children).map(function (child) {
      return /*#__PURE__*/React.cloneElement(child, {
        key: child.toString(),
        dataset: [data]
      });
    }));
  }));
}

export { AnimatedDataset };
