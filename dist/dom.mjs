var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement$2(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement$1(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement$1(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement$1(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement$1(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect$1(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement$1(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement$2(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect$1(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement$2(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement$1(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle$1(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement$1(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle$1(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement$1(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement$1(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, getWindow(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement$1(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect$1(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle$1(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement$1(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect$1(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement$2(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement$1(element) ? getOffsetParent(element) : element;

  if (!isElement$2(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement$2(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement$1(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement$2(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect$1(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement$1(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement$1(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement$1(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement$1(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement$1(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement$1(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement$1(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement$1(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement$1(offsetParent);
  var offsetParentIsScaled = isHTMLElement$1(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect$1(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement$1(offsetParent)) {
      offsets = getBoundingClientRect$1(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce$3(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement$2(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce$3(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
  return document.body;
};
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }

  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === 'function' ? value.apply(void 0, args) : value;
}
function debounce$2(fn, ms) {
  // Avoid wrapping in `setTimeout` if ms is 0 anyway
  if (ms === 0) {
    return fn;
  }

  var timeout;
  return function (arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn(arg);
    }, ms);
  };
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement(placement) {
  return placement.split('-')[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function div() {
  return document.createElement('div');
}
function isElement$1(value) {
  return ['Element', 'Fragment'].some(function (type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, 'NodeList');
}
function isMouseEvent(value) {
  return isType(value, 'MouseEvent');
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement$1(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;

  var _normalizeToArray = normalizeToArray(elementOrElements),
      element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX,
      clientY = event.clientY;
  return popperTreeData.every(function (_ref) {
    var popperRect = _ref.popperRect,
        popperState = _ref.popperState,
        props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...

  ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
    box[method](event, listener);
  });
}
/**
 * Compared to xxx.contains, this function works for dom structures with shadow
 * dom
 */

function actualContains(parent, child) {
  var target = child;

  while (target) {
    var _target$getRootNode;

    if (parent.contains(target)) {
      return true;
    }

    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }

  return false;
}

var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */

function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }

  currentInput.isTouch = true;

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */

function onDocumentMouseMove() {
  var now = performance.now();

  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */

function onWindowBlur() {
  var activeElement = document.activeElement;

  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;

    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener('blur', onWindowBlur);
}

var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined';
var isIE11 = isBrowser$1 ? // @ts-ignore
!!window.msCrypto : false;

var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto'
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {},
  onBeforeUpdate: function onBeforeUpdate() {},
  onCreate: function onCreate() {},
  onDestroy: function onDestroy() {},
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  onTrigger: function onTrigger() {},
  onUntrigger: function onUntrigger() {},
  onClickOutside: function onClickOutside() {},
  placement: 'top',
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {

  var keys = Object.keys(partialProps);
  keys.forEach(function (key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps = plugins.reduce(function (acc, plugin) {
    var name = plugin.name,
        defaultValue = plugin.defaultValue;

    if (name) {
      var _name;

      acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }

    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins: plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
  };
  return out;
}

var innerHTML = function innerHTML() {
  return 'innerHTML';
};

function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}

function createArrowElement(value) {
  var arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (isElement$1(value)) {
      arrow.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow, value);
    }
  }

  return arrow;
}

function setContent(content, props) {
  if (isElement$1(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box: box,
    content: boxChildren.find(function (node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function (node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function (node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute('data-state', 'hidden');
  box.setAttribute('tabindex', '-1');
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute('data-state', 'hidden');
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);

  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper),
        box = _getChildren.box,
        content = _getChildren.content,
        arrow = _getChildren.arrow;

    if (nextProps.theme) {
      box.setAttribute('data-theme', nextProps.theme);
    } else {
      box.removeAttribute('data-theme');
    }

    if (typeof nextProps.animation === 'string') {
      box.setAttribute('data-animation', nextProps.animation);
    } else {
      box.removeAttribute('data-animation');
    }

    if (nextProps.inertia) {
      box.setAttribute('data-inertia', '');
    } else {
      box.removeAttribute('data-inertia');
    }

    box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

    if (nextProps.role) {
      box.setAttribute('role', nextProps.role);
    } else {
      box.removeAttribute('role');
    }

    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content, instance.props);
    }

    if (nextProps.arrow) {
      if (!arrow) {
        box.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box.removeChild(arrow);
        box.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow) {
      box.removeChild(arrow);
    }
  }

  return {
    popper: popper,
    onUpdate: onUpdate
  };
} // Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away

render.$$tippy = true;

var idCounter = 1;
var mouseMoveListeners = []; // Used by `hideAll()`

var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
  // 🔒 Private members
  // ===========================================================================

  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce$2(onMouseMove, props.interactiveDebounce);
  var currentTarget; // ===========================================================================
  // 🔑 Public members
  // ===========================================================================

  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: div(),
    popperInstance: popperInstance,
    props: props,
    state: state,
    plugins: plugins,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    setProps: setProps,
    setContent: setContent,
    show: show,
    hide: hide,
    hideWithInteractivity: hideWithInteractivity,
    enable: enable,
    disable: disable,
    unmount: unmount,
    destroy: destroy
  }; // TODO: Investigate why this early return causes a TDZ error in the tests —
  // it doesn't seem to happen in the browser

  /* istanbul ignore if */

  if (!props.render) {

    return instance;
  } // ===========================================================================
  // Initial mutations
  // ===========================================================================


  var _props$render = props.render(instance),
      popper = _props$render.popper,
      onUpdate = _props$render.onUpdate;

  popper.setAttribute('data-tippy-root', '');
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function (plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute('aria-expanded');
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook('onCreate', [instance]);

  if (props.showOnCreate) {
    scheduleShow();
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function () {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance; // ===========================================================================
  // 🔒 Private methods
  // ===========================================================================

  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }

  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === 'hold';
  }

  function getIsDefaultRenderFn() {
    var _instance$props$rende;

    // @ts-ignore
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }

  function getCurrentTarget() {
    return currentTarget || reference;
  }

  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }

  function getDefaultTemplateChildren() {
    return getChildren(popper);
  }

  function getDelay(isShow) {
    // For touch or keyboard input, force `0` delay for UX reasons
    // Also if the instance is mounted but not visible (transitioning out),
    // ignore delay
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
      return 0;
    }

    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }

  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }

    popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
    popper.style.zIndex = "" + instance.props.zIndex;
  }

  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }

    pluginsHooks.forEach(function (pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });

    if (shouldInvokePropsHook) {
      var _instance$props;

      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }

  function handleAriaContentAttribute() {
    var aria = instance.props.aria;

    if (!aria.content) {
      return;
    }

    var attr = "aria-" + aria.content;
    var id = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      var currentValue = node.getAttribute(attr);

      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
      } else {
        var nextValue = currentValue && currentValue.replace(id, '').trim();

        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }

  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      if (instance.props.interactive) {
        node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
      } else {
        node.removeAttribute('aria-expanded');
      }
    });
  }

  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
      return listener !== debouncedOnMouseMove;
    });
  }

  function onDocumentPress(event) {
    // Moved finger to scroll instead of an intentional tap outside
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === 'mousedown') {
        return;
      }
    }

    var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    } // Clicked on the event listeners target


    if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }

      if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
        return;
      }
    } else {
      invokeHook('onClickOutside', [instance, event]);
    }

    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
      // currentTarget. This lets a tippy with `focus` trigger know that it
      // should not show

      didHideDueToDocumentMouseDown = true;
      setTimeout(function () {
        didHideDueToDocumentMouseDown = false;
      }); // The listener gets added in `scheduleShow()`, but this may be hiding it
      // before it shows, and hide()'s early bail-out behavior can prevent it
      // from being cleaned up

      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }

  function onTouchMove() {
    didTouchMove = true;
  }

  function onTouchStart() {
    didTouchMove = false;
  }

  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener('mousedown', onDocumentPress, true);
    doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener('mousedown', onDocumentPress, true);
    doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }

  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }

  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;

    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(box, 'add', listener);
    currentTransitionEndListener = listener;
  }

  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    });
  }

  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on('touchstart', onTrigger, {
        passive: true
      });
      on('touchend', onMouseLeave, {
        passive: true
      });
    }

    splitBySpaces(instance.props.trigger).forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      }

      on(eventType, onTrigger);

      switch (eventType) {
        case 'mouseenter':
          on('mouseleave', onMouseLeave);
          break;

        case 'focus':
          on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
          break;

        case 'focusin':
          on('focusout', onBlurOrFocusOut);
          break;
      }
    });
  }

  function removeListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function onTrigger(event) {
    var _lastTriggerEvent;

    var shouldScheduleClickHide = false;

    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }

    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();

    if (!instance.state.isVisible && isMouseEvent(event)) {
      // If scrolling, `mouseenter` events can be fired if the cursor lands
      // over a new target, but `mousemove` events don't get fired. This
      // causes interactive tooltips to get stuck open until the cursor is
      // moved
      mouseMoveListeners.forEach(function (listener) {
        return listener(event);
      });
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }

    if (event.type === 'click') {
      isVisibleFromClick = !shouldScheduleClickHide;
    }

    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }

  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

    if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
      return;
    }

    var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
      var _instance$popperInsta;

      var instance = popper._tippy;
      var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

      if (state) {
        return {
          popperRect: popper.getBoundingClientRect(),
          popperState: state,
          props: props
        };
      }

      return null;
    }).filter(Boolean);

    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }

  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

    if (shouldBail) {
      return;
    }

    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }

    scheduleHide(event);
  }

  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
      return;
    } // If focus was moved to within the popper


    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide(event);
  }

  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
  }

  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props,
        popperOptions = _instance$props2.popperOptions,
        placement = _instance$props2.placement,
        offset = _instance$props2.offset,
        getReferenceClientRect = _instance$props2.getReferenceClientRect,
        moveTransition = _instance$props2.moveTransition;
    var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: '$$tippy',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(),
              box = _getDefaultTemplateCh.box;

          ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
            if (attr === 'placement') {
              box.setAttribute('data-placement', state.placement);
            } else {
              if (state.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, '');
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: 'offset',
      options: {
        offset: offset
      }
    }, {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: 'flip',
      options: {
        padding: 5
      }
    }, {
      name: 'computeStyles',
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];

    if (getIsDefaultRenderFn() && arrow) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrow,
          padding: 3
        }
      });
    }

    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = createPopper(computedReference, popper, Object.assign({}, popperOptions, {
      placement: placement,
      onFirstUpdate: onFirstUpdate,
      modifiers: modifiers
    }));
  }

  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }

  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
    // it's directly after the reference element so the elements inside the
    // tippy can be tabbed to
    // If there are clipping issues, the user can specify a different appendTo
    // and ensure focus management is handled correctly manually

    var node = getCurrentTarget();

    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    } // The popper element needs to exist on the DOM before its position can be
    // updated as Popper needs to read its dimensions


    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }

    instance.state.isMounted = true;
    createPopperInstance();
  }

  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
  }

  function scheduleShow(event) {
    instance.clearDelayTimeouts();

    if (event) {
      invokeHook('onTrigger', [instance, event]);
    }

    addDocumentPress();
    var delay = getDelay(true);

    var _getNormalizedTouchSe = getNormalizedTouchSettings(),
        touchValue = _getNormalizedTouchSe[0],
        touchDelay = _getNormalizedTouchSe[1];

    if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
      delay = touchDelay;
    }

    if (delay) {
      showTimeout = setTimeout(function () {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }

  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook('onUntrigger', [instance, event]);

    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    } // For interactive tippies, scheduleHide is added to a document.body handler
    // from onMouseLeave so must intercept scheduled hides from mousemove/leave
    // events when trigger contains mouseenter and click, and the tip is
    // currently shown as a result of a click.


    if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }

    var delay = getDelay(false);

    if (delay) {
      hideTimeout = setTimeout(function () {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      scheduleHideAnimationFrame = requestAnimationFrame(function () {
        instance.hide();
      });
    }
  } // ===========================================================================
  // 🔑 Public methods
  // ===========================================================================


  function enable() {
    instance.state.isEnabled = true;
  }

  function disable() {
    // Disabling the instance should also hide it
    // https://github.com/atomiks/tippy.js-react/issues/106
    instance.hide();
    instance.state.isEnabled = false;
  }

  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }

  function setProps(partialProps) {

    if (instance.state.isDestroyed) {
      return;
    }

    invokeHook('onBeforeUpdate', [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();

    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce$2(onMouseMove, nextProps.interactiveDebounce);
    } // Ensure stale aria-expanded attributes are removed


    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
        node.removeAttribute('aria-expanded');
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute('aria-expanded');
    }

    handleAriaExpandedAttribute();
    handleStyles();

    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }

    if (instance.popperInstance) {
      createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
      // and the nested ones get re-rendered first.
      // https://github.com/atomiks/tippyjs-react/issues/177
      // TODO: find a cleaner / more efficient solution(!)

      getNestedPopperTree().forEach(function (nestedPopper) {
        // React (and other UI libs likely) requires a rAF wrapper as it flushes
        // its work in one
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }

    invokeHook('onAfterUpdate', [instance, partialProps]);
  }

  function setContent(content) {
    instance.setProps({
      content: content
    });
  }

  function show() {


    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    } // Normalize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (getCurrentTarget().hasAttribute('disabled')) {
      return;
    }

    invokeHook('onShow', [instance], false);

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.state.isVisible = true;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'visible';
    }

    handleStyles();
    addDocumentPress();

    if (!instance.state.isMounted) {
      popper.style.transition = 'none';
    } // If flipping to the opposite side after hiding at least once, the
    // animation will use the wrong placement without resetting the duration


    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh2.box,
          content = _getDefaultTemplateCh2.content;

      setTransitionDuration([box, content], 0);
    }

    onFirstUpdate = function onFirstUpdate() {
      var _instance$popperInsta2;

      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }

      ignoreOnFirstUpdate = true; // reflow

      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;

      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
            _box = _getDefaultTemplateCh3.box,
            _content = _getDefaultTemplateCh3.content;

        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], 'visible');
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
      // popper has been positioned for the first time

      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook('onMount', [instance]);

      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function () {
          instance.state.isShown = true;
          invokeHook('onShown', [instance]);
        });
      }
    };

    mount();
  }

  function hide() {


    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }

    invokeHook('onHide', [instance], false);

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'hidden';
    }

    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);

    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh4.box,
          content = _getDefaultTemplateCh4.content;

      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], 'hidden');
      }
    }

    handleAriaContentAttribute();
    handleAriaExpandedAttribute();

    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }

  function hideWithInteractivity(event) {

    getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }

  function unmount() {

    if (instance.state.isVisible) {
      instance.hide();
    }

    if (!instance.state.isMounted) {
      return;
    }

    destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
    // tree by default. This seems mainly for interactive tippies, but we should
    // find a workaround if possible

    getNestedPopperTree().forEach(function (nestedPopper) {
      nestedPopper._tippy.unmount();
    });

    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }

    mountedInstances = mountedInstances.filter(function (i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook('onHidden', [instance]);
  }

  function destroy() {

    if (instance.state.isDestroyed) {
      return;
    }

    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook('onDestroy', [instance]);
  }
}

function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }

  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);

  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins: plugins
  });
  var elements = getArrayOfElements(targets);

  var instances = elements.reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, passedProps);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return isElement$1(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;

// every time the popper is destroyed (i.e. a new target), removing the styles
// and causing transitions to break for singletons when the console is open, but
// most notably for non-transform styles being used, `gpuAcceleration: false`.

Object.assign({}, applyStyles$1, {
  effect: function effect(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    } // intentionally return no cleanup function
    // return () => { ... }

  }
});

tippy.setDefaultProps({
  render: render
});

/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry$1 = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry$1(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

((function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
}))();

/*!
 * OverlayScrollbars
 * Version: 2.10.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const createCache = (t, n) => {
  const {o: o, i: s, u: e} = t;
  let c = o;
  let r;
  const cacheUpdateContextual = (t, n) => {
    const o = c;
    const l = t;
    const i = n || (s ? !s(o, l) : o !== l);
    if (i || e) {
      c = l;
      r = o;
    }
    return [ c, i, r ];
  };
  const cacheUpdateIsolated = t => cacheUpdateContextual(n(c, r), t);
  const getCurrentCache = t => [ c, !!t, r ];
  return [ n ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache ];
};

const t = typeof window !== "undefined" && typeof HTMLElement !== "undefined" && !!window.document;

const n = t ? window : {};

const o = Math.max;

const s$1 = Math.min;

const e = Math.round;

const c = Math.abs;

const r = Math.sign;

const l = n.cancelAnimationFrame;

const i$1 = n.requestAnimationFrame;

const a = n.setTimeout;

const u = n.clearTimeout;

const getApi = t => typeof n[t] !== "undefined" ? n[t] : void 0;

const _ = getApi("MutationObserver");

const d = getApi("IntersectionObserver");

const f = getApi("ResizeObserver");

const v = getApi("ScrollTimeline");

const isUndefined = t => t === void 0;

const isNull = t => t === null;

const isNumber = t => typeof t === "number";

const isString = t => typeof t === "string";

const isBoolean = t => typeof t === "boolean";

const isFunction = t => typeof t === "function";

const isArray = t => Array.isArray(t);

const isObject = t => typeof t === "object" && !isArray(t) && !isNull(t);

const isArrayLike = t => {
  const n = !!t && t.length;
  const o = isNumber(n) && n > -1 && n % 1 == 0;
  return isArray(t) || !isFunction(t) && o ? n > 0 && isObject(t) ? n - 1 in t : true : false;
};

const isPlainObject = t => !!t && t.constructor === Object;

const isHTMLElement = t => t instanceof HTMLElement;

const isElement = t => t instanceof Element;

const animationCurrentTime = () => performance.now();

const animateNumber = (t, n, s, e, c) => {
  let r = 0;
  const a = animationCurrentTime();
  const u = o(0, s);
  const frame = s => {
    const l = animationCurrentTime();
    const _ = l - a;
    const d = _ >= u;
    const f = s ? 1 : 1 - (o(0, a + u - l) / u || 0);
    const v = (n - t) * (isFunction(c) ? c(f, f * u, 0, 1, u) : f) + t;
    const p = d || f === 1;
    e && e(v, f, p);
    r = p ? 0 : i$1((() => frame()));
  };
  frame();
  return t => {
    l(r);
    t && frame(t);
  };
};

function each(t, n) {
  if (isArrayLike(t)) {
    for (let o = 0; o < t.length; o++) {
      if (n(t[o], o, t) === false) {
        break;
      }
    }
  } else if (t) {
    each(Object.keys(t), (o => n(t[o], o, t)));
  }
  return t;
}

const inArray = (t, n) => t.indexOf(n) >= 0;

const concat = (t, n) => t.concat(n);

const push = (t, n, o) => {
  !isString(n) && isArrayLike(n) ? Array.prototype.push.apply(t, n) : t.push(n);
  return t;
};

const from = t => Array.from(t || []);

const createOrKeepArray = t => {
  if (isArray(t)) {
    return t;
  }
  return !isString(t) && isArrayLike(t) ? from(t) : [ t ];
};

const isEmptyArray = t => !!t && !t.length;

const deduplicateArray = t => from(new Set(t));

const runEachAndClear = (t, n, o) => {
  const runFn = t => t ? t.apply(void 0, n || []) : true;
  each(t, runFn);
  !o && (t.length = 0);
};

const p = "paddingTop";

const h = "paddingRight";

const g = "paddingLeft";

const b = "paddingBottom";

const w = "marginLeft";

const y = "marginRight";

const S = "marginBottom";

const m = "overflowX";

const O = "overflowY";

const $$1 = "width";

const C = "height";

const x = "visible";

const H = "hidden";

const E = "scroll";

const capitalizeFirstLetter = t => {
  const n = String(t || "");
  return n ? n[0].toUpperCase() + n.slice(1) : "";
};

const equal = (t, n, o, s) => {
  if (t && n) {
    let e = true;
    each(o, (o => {
      const c = t[o];
      const r = n[o];
      if (c !== r) {
        e = false;
      }
    }));
    return e;
  }
  return false;
};

const equalWH = (t, n) => equal(t, n, [ "w", "h" ]);

const equalXY = (t, n) => equal(t, n, [ "x", "y" ]);

const equalTRBL = (t, n) => equal(t, n, [ "t", "r", "b", "l" ]);

const noop = () => {};

const bind = (t, ...n) => t.bind(0, ...n);

const selfClearTimeout = t => {
  let n;
  const o = t ? a : i$1;
  const s = t ? u : l;
  return [ e => {
    s(n);
    n = o((() => e()), isFunction(t) ? t() : t);
  }, () => s(n) ];
};

const debounce$1 = (t, n) => {
  const {_: o, v: s, p: e, S: c} = n || {};
  let r;
  let _;
  let d;
  let f;
  let v = noop;
  const p = function invokeFunctionToDebounce(n) {
    v();
    u(r);
    f = r = _ = void 0;
    v = noop;
    t.apply(this, n);
  };
  const mergeParms = t => c && _ ? c(_, t) : t;
  const flush = () => {
    if (v !== noop) {
      p(mergeParms(d) || d);
    }
  };
  const h = function debouncedFn() {
    const t = from(arguments);
    const n = isFunction(o) ? o() : o;
    const c = isNumber(n) && n >= 0;
    if (c) {
      const o = isFunction(s) ? s() : s;
      const c = isNumber(o) && o >= 0;
      const h = n > 0 ? a : i$1;
      const g = n > 0 ? u : l;
      const b = mergeParms(t);
      const w = b || t;
      const y = p.bind(0, w);
      let S;
      v();
      if (e && !f) {
        y();
        f = true;
        S = h((() => f = void 0), n);
      } else {
        S = h(y, n);
        if (c && !r) {
          r = a(flush, o);
        }
      }
      v = () => g(S);
      _ = d = w;
    } else {
      p(t);
    }
  };
  h.m = flush;
  return h;
};

const hasOwnProperty = (t, n) => Object.prototype.hasOwnProperty.call(t, n);

const keys = t => t ? Object.keys(t) : [];

const assignDeep = (t, n, o, s, e, c, r) => {
  const l = [ n, o, s, e, c, r ];
  if ((typeof t !== "object" || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(l, (n => {
    each(n, ((o, s) => {
      const e = n[s];
      if (t === e) {
        return true;
      }
      const c = isArray(e);
      if (e && isPlainObject(e)) {
        const n = t[s];
        let o = n;
        if (c && !isArray(n)) {
          o = [];
        } else if (!c && !isPlainObject(n)) {
          o = {};
        }
        t[s] = assignDeep(o, e);
      } else {
        t[s] = c ? e.slice() : e;
      }
    }));
  }));
  return t;
};

const removeUndefinedProperties = (t, n) => each(assignDeep({}, t), ((t, o, s) => {
  if (t === void 0) {
    delete s[o];
  } else if (t && isPlainObject(t)) {
    s[o] = removeUndefinedProperties(t);
  }
}));

const isEmptyObject = t => !keys(t).length;

const capNumber = (t, n, e) => o(t, s$1(n, e));

const getDomTokensArray = t => deduplicateArray((isArray(t) ? t : (t || "").split(" ")).filter((t => t)));

const getAttr = (t, n) => t && t.getAttribute(n);

const hasAttr = (t, n) => t && t.hasAttribute(n);

const setAttrs = (t, n, o) => {
  each(getDomTokensArray(n), (n => {
    t && t.setAttribute(n, String(o || ""));
  }));
};

const removeAttrs = (t, n) => {
  each(getDomTokensArray(n), (n => t && t.removeAttribute(n)));
};

const domTokenListAttr = (t, n) => {
  const o = getDomTokensArray(getAttr(t, n));
  const s = bind(setAttrs, t, n);
  const domTokenListOperation = (t, n) => {
    const s = new Set(o);
    each(getDomTokensArray(t), (t => {
      s[n](t);
    }));
    return from(s).join(" ");
  };
  return {
    O: t => s(domTokenListOperation(t, "delete")),
    $: t => s(domTokenListOperation(t, "add")),
    C: t => {
      const n = getDomTokensArray(t);
      return n.reduce(((t, n) => t && o.includes(n)), n.length > 0);
    }
  };
};

const removeAttrClass = (t, n, o) => {
  domTokenListAttr(t, n).O(o);
  return bind(addAttrClass, t, n, o);
};

const addAttrClass = (t, n, o) => {
  domTokenListAttr(t, n).$(o);
  return bind(removeAttrClass, t, n, o);
};

const addRemoveAttrClass = (t, n, o, s) => (s ? addAttrClass : removeAttrClass)(t, n, o);

const hasAttrClass = (t, n, o) => domTokenListAttr(t, n).C(o);

const createDomTokenListClass = t => domTokenListAttr(t, "class");

const removeClass = (t, n) => {
  createDomTokenListClass(t).O(n);
};

const addClass = (t, n) => {
  createDomTokenListClass(t).$(n);
  return bind(removeClass, t, n);
};

const find$1 = (t, n) => {
  const o = n ? isElement(n) && n : document;
  return o ? from(o.querySelectorAll(t)) : [];
};

const findFirst = (t, n) => {
  const o = n ? isElement(n) && n : document;
  return o && o.querySelector(t);
};

const is = (t, n) => isElement(t) && t.matches(n);

const isBodyElement = t => is(t, "body");

const contents = t => t ? from(t.childNodes) : [];

const parent = t => t && t.parentElement;

const closest$1 = (t, n) => isElement(t) && t.closest(n);

const getFocusedElement = t => (document).activeElement;

const liesBetween = (t, n, o) => {
  const s = closest$1(t, n);
  const e = t && findFirst(o, s);
  const c = closest$1(e, n) === s;
  return s && e ? s === t || e === t || c && closest$1(closest$1(t, o), n) !== s : false;
};

const removeElements = t => {
  each(createOrKeepArray(t), (t => {
    const n = parent(t);
    t && n && n.removeChild(t);
  }));
};

const appendChildren = (t, n) => bind(removeElements, t && n && each(createOrKeepArray(n), (n => {
  n && t.appendChild(n);
})));

const createDiv = t => {
  const n = document.createElement("div");
  setAttrs(n, "class", t);
  return n;
};

const createDOM = t => {
  const n = createDiv();
  n.innerHTML = t.trim();
  return each(contents(n), (t => removeElements(t)));
};

const getCSSVal = (t, n) => t.getPropertyValue(n) || t[n] || "";

const validFiniteNumber = t => {
  const n = t || 0;
  return isFinite(n) ? n : 0;
};

const parseToZeroOrNumber = t => validFiniteNumber(parseFloat(t || ""));

const roundCssNumber = t => Math.round(t * 1e4) / 1e4;

const numberToCssPx = t => `${roundCssNumber(validFiniteNumber(t))}px`;

function setStyles(t, n) {
  t && n && each(n, ((n, o) => {
    try {
      const s = t.style;
      const e = isNull(n) || isBoolean(n) ? "" : isNumber(n) ? numberToCssPx(n) : n;
      if (o.indexOf("--") === 0) {
        s.setProperty(o, e);
      } else {
        s[o] = e;
      }
    } catch (s) {}
  }));
}

function getStyles(t, o, s) {
  const e = isString(o);
  let c = e ? "" : {};
  if (t) {
    const r = n.getComputedStyle(t, s) || t.style;
    c = e ? getCSSVal(r, o) : from(o).reduce(((t, n) => {
      t[n] = getCSSVal(r, n);
      return t;
    }), c);
  }
  return c;
}

const topRightBottomLeft = (t, n, o) => {
  const s = n ? `${n}-` : "";
  const e = o ? `-${o}` : "";
  const c = `${s}top${e}`;
  const r = `${s}right${e}`;
  const l = `${s}bottom${e}`;
  const i = `${s}left${e}`;
  const a = getStyles(t, [ c, r, l, i ]);
  return {
    t: parseToZeroOrNumber(a[c]),
    r: parseToZeroOrNumber(a[r]),
    b: parseToZeroOrNumber(a[l]),
    l: parseToZeroOrNumber(a[i])
  };
};

const getTrasformTranslateValue = (t, n) => `translate${isObject(t) ? `(${t.x},${t.y})` : `${"Y"}(${t})`}`;

const elementHasDimensions = t => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);

const z = {
  w: 0,
  h: 0
};

const getElmWidthHeightProperty = (t, n) => n ? {
  w: n[`${t}Width`],
  h: n[`${t}Height`]
} : z;

const getWindowSize = t => getElmWidthHeightProperty("inner", t || n);

const I = bind(getElmWidthHeightProperty, "offset");

const A = bind(getElmWidthHeightProperty, "client");

const D = bind(getElmWidthHeightProperty, "scroll");

const getFractionalSize = t => {
  const n = parseFloat(getStyles(t, $$1)) || 0;
  const o = parseFloat(getStyles(t, C)) || 0;
  return {
    w: n - e(n),
    h: o - e(o)
  };
};

const getBoundingClientRect = t => t.getBoundingClientRect();

const hasDimensions = t => !!t && elementHasDimensions(t);

const domRectHasDimensions = t => !!(t && (t[C] || t[$$1]));

const domRectAppeared = (t, n) => {
  const o = domRectHasDimensions(t);
  const s = domRectHasDimensions(n);
  return !s && o;
};

const removeEventListener = (t, n, o, s) => {
  each(getDomTokensArray(n), (n => {
    t && t.removeEventListener(n, o, s);
  }));
};

const addEventListener = (t, n, o, s) => {
  var e;
  const c = (e = s && s.H) != null ? e : true;
  const r = s && s.I || false;
  const l = s && s.A || false;
  const i = {
    passive: c,
    capture: r
  };
  return bind(runEachAndClear, getDomTokensArray(n).map((n => {
    const s = l ? e => {
      removeEventListener(t, n, s, r);
      o && o(e);
    } : o;
    t && t.addEventListener(n, s, i);
    return bind(removeEventListener, t, n, s, r);
  })));
};

const stopPropagation = t => t.stopPropagation();

const preventDefault = t => t.preventDefault();

const stopAndPrevent = t => stopPropagation(t) || preventDefault(t);

const scrollElementTo = (t, n) => {
  const {x: o, y: s} = isNumber(n) ? {
    x: n,
    y: n
  } : n || {};
  isNumber(o) && (t.scrollLeft = o);
  isNumber(s) && (t.scrollTop = s);
};

const getElementScroll = t => ({
  x: t.scrollLeft,
  y: t.scrollTop
});

const getZeroScrollCoordinates = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
});

const sanitizeScrollCoordinates = (t, n) => {
  const {D: o, M: s} = t;
  const {w: e, h: l} = n;
  const sanitizeAxis = (t, n, o) => {
    let s = r(t) * o;
    let e = r(n) * o;
    if (s === e) {
      const o = c(t);
      const r = c(n);
      e = o > r ? 0 : e;
      s = o < r ? 0 : s;
    }
    s = s === e ? 0 : s;
    return [ s + 0, e + 0 ];
  };
  const [i, a] = sanitizeAxis(o.x, s.x, e);
  const [u, _] = sanitizeAxis(o.y, s.y, l);
  return {
    D: {
      x: i,
      y: u
    },
    M: {
      x: a,
      y: _
    }
  };
};

const isDefaultDirectionScrollCoordinates = ({D: t, M: n}) => {
  const getAxis = (t, n) => t === 0 && t <= n;
  return {
    x: getAxis(t.x, n.x),
    y: getAxis(t.y, n.y)
  };
};

const getScrollCoordinatesPercent = ({D: t, M: n}, o) => {
  const getAxis = (t, n, o) => capNumber(0, 1, (t - o) / (t - n) || 0);
  return {
    x: getAxis(t.x, n.x, o.x),
    y: getAxis(t.y, n.y, o.y)
  };
};

const focusElement = t => {
  if (t && t.focus) {
    t.focus({
      preventScroll: true
    });
  }
};

const manageListener = (t, n) => {
  each(createOrKeepArray(n), t);
};

const createEventListenerHub = t => {
  const n = new Map;
  const removeEvent = (t, o) => {
    if (t) {
      const s = n.get(t);
      manageListener((t => {
        if (s) {
          s[t ? "delete" : "clear"](t);
        }
      }), o);
    } else {
      n.forEach((t => {
        t.clear();
      }));
      n.clear();
    }
  };
  const addEvent = (t, o) => {
    if (isString(t)) {
      const s = n.get(t) || new Set;
      n.set(t, s);
      manageListener((t => {
        isFunction(t) && s.add(t);
      }), o);
      return bind(removeEvent, t, o);
    }
    if (isBoolean(o) && o) {
      removeEvent();
    }
    const s = keys(t);
    const e = [];
    each(s, (n => {
      const o = t[n];
      o && push(e, addEvent(n, o));
    }));
    return bind(runEachAndClear, e);
  };
  const triggerEvent = (t, o) => {
    each(from(n.get(t)), (t => {
      if (o && !isEmptyArray(o)) {
        t.apply(0, o);
      } else {
        t();
      }
    }));
  };
  addEvent(t || {});
  return [ addEvent, removeEvent, triggerEvent ];
};

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw 0;
  }
  return n;
}));

const getPropByPath = (t, n) => t ? `${n}`.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;

const M = {
  paddingAbsolute: false,
  showNativeOverlaidScrollbars: false,
  update: {
    elementEvents: [ [ "img", "load" ] ],
    debounce: [ 0, 33 ],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: false,
    dragScroll: true,
    clickScroll: false,
    pointers: [ "mouse", "touch", "pen" ]
  }
};

const getOptionsDiff = (t, n) => {
  const o = {};
  const s = concat(keys(n), keys(t));
  each(s, (s => {
    const e = t[s];
    const c = n[s];
    if (isObject(e) && isObject(c)) {
      assignDeep(o[s] = {}, getOptionsDiff(e, c));
      if (isEmptyObject(o[s])) {
        delete o[s];
      }
    } else if (hasOwnProperty(n, s) && c !== e) {
      let t = true;
      if (isArray(e) || isArray(c)) {
        try {
          if (opsStringify(e) === opsStringify(c)) {
            t = false;
          }
        } catch (r) {}
      }
      if (t) {
        o[s] = c;
      }
    }
  }));
  return o;
};

const createOptionCheck = (t, n, o) => s => [ getPropByPath(t, s), o || getPropByPath(n, s) !== void 0 ];

const T = `data-overlayscrollbars`;

const k = "os-environment";

const R = `${k}-scrollbar-hidden`;

const V = `${T}-initialize`;

const L = "noClipping";

const U = `${T}-body`;

const P = T;

const N = "host";

const q = `${T}-viewport`;

const B = m;

const F = O;

const j = "arrange";

const X = "measuring";

const Y = "scrolling";

const W = "scrollbarHidden";

const J = "noContent";

const G = `${T}-padding`;

const K = `${T}-content`;

const Q = "os-size-observer";

const Z = `${Q}-appear`;

const tt = `${Q}-listener`;

const nt = `${tt}-scroll`;

const ot = `${tt}-item`;

const st = `${ot}-final`;

const et = "os-trinsic-observer";

const ct = "os-theme-none";

const rt = "os-scrollbar";

const lt = `${rt}-rtl`;

const it = `${rt}-horizontal`;

const at = `${rt}-vertical`;

const ut = `${rt}-track`;

const _t = `${rt}-handle`;

const dt = `${rt}-visible`;

const ft = `${rt}-cornerless`;

const vt = `${rt}-interaction`;

const pt = `${rt}-unusable`;

const ht = `${rt}-auto-hide`;

const gt = `${ht}-hidden`;

const bt = `${rt}-wheel`;

const wt = `${ut}-interactive`;

const yt = `${_t}-interactive`;

let St;

const getNonce = () => St;

const setNonce = t => {
  St = t;
};

let mt;

const createEnvironment = () => {
  const getNativeScrollbarSize = (t, n, o) => {
    appendChildren(document.body, t);
    appendChildren(document.body, t);
    const s = A(t);
    const e = I(t);
    const c = getFractionalSize(n);
    o && removeElements(t);
    return {
      x: e.h - s.h + c.h,
      y: e.w - s.w + c.w
    };
  };
  const getNativeScrollbarsHiding = t => {
    let n = false;
    const o = addClass(t, R);
    try {
      n = getStyles(t, "scrollbar-width") === "none" || getStyles(t, "display", "::-webkit-scrollbar") === "none";
    } catch (s) {}
    o();
    return n;
  };
  const t = `.${k}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${k} div{width:200%;height:200%;margin:10px 0}.${R}{scrollbar-width:none!important}.${R}::-webkit-scrollbar,.${R}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`;
  const o = createDOM(`<div class="${k}"><div></div><style>${t}</style></div>`);
  const s = o[0];
  const e = s.firstChild;
  const c = s.lastChild;
  const r = getNonce();
  if (r) {
    c.nonce = r;
  }
  const [l, , i] = createEventListenerHub();
  const [a, u] = createCache({
    o: getNativeScrollbarSize(s, e),
    i: equalXY
  }, bind(getNativeScrollbarSize, s, e, true));
  const [_] = u();
  const d = getNativeScrollbarsHiding(s);
  const f = {
    x: _.x === 0,
    y: _.y === 0
  };
  const p = {
    elements: {
      host: null,
      padding: !d,
      viewport: t => d && isBodyElement(t) && t,
      content: false
    },
    scrollbars: {
      slot: true
    },
    cancel: {
      nativeScrollbarsOverlaid: false,
      body: null
    }
  };
  const h = assignDeep({}, M);
  const g = bind(assignDeep, {}, h);
  const b = bind(assignDeep, {}, p);
  const w = {
    T: _,
    k: f,
    R: d,
    V: !!v,
    L: bind(l, "r"),
    U: b,
    P: t => assignDeep(p, t) && b(),
    N: g,
    q: t => assignDeep(h, t) && g(),
    B: assignDeep({}, p),
    F: assignDeep({}, h)
  };
  removeAttrs(s, "style");
  removeElements(s);
  addEventListener(n, "resize", (() => {
    i("r", []);
  }));
  if (isFunction(n.matchMedia) && !d && (!f.x || !f.y)) {
    const addZoomListener = t => {
      const o = n.matchMedia(`(resolution: ${n.devicePixelRatio}dppx)`);
      addEventListener(o, "change", (() => {
        t();
        addZoomListener(t);
      }), {
        A: true
      });
    };
    addZoomListener((() => {
      const [t, n] = a();
      assignDeep(w.T, t);
      i("r", [ n ]);
    }));
  }
  return w;
};

const getEnvironment = () => {
  if (!mt) {
    mt = createEnvironment();
  }
  return mt;
};

const resolveInitialization = (t, n) => isFunction(n) ? n.apply(0, t) : n;

const staticInitializationElement = (t, n, o, s) => {
  const e = isUndefined(s) ? o : s;
  const c = resolveInitialization(t, e);
  return c || n.apply(0, t);
};

const dynamicInitializationElement = (t, n, o, s) => {
  const e = isUndefined(s) ? o : s;
  const c = resolveInitialization(t, e);
  return !!c && (isHTMLElement(c) ? c : n.apply(0, t));
};

const cancelInitialization = (t, n) => {
  const {nativeScrollbarsOverlaid: o, body: s} = n || {};
  const {k: e, R: c, U: r} = getEnvironment();
  const {nativeScrollbarsOverlaid: l, body: i} = r().cancel;
  const a = o != null ? o : l;
  const u = isUndefined(s) ? i : s;
  const _ = (e.x || e.y) && a;
  const d = t && (isNull(u) ? !c : u);
  return !!_ || !!d;
};

const Ot = new WeakMap;

const addInstance = (t, n) => {
  Ot.set(t, n);
};

const removeInstance = t => {
  Ot.delete(t);
};

const getInstance = t => Ot.get(t);

const createEventContentChange = (t, n, o) => {
  let s = false;
  const e = o ? new WeakMap : false;
  const destroy = () => {
    s = true;
  };
  const updateElements = c => {
    if (e && o) {
      const r = o.map((n => {
        const [o, s] = n || [];
        const e = s && o ? (c || find$1)(o, t) : [];
        return [ e, s ];
      }));
      each(r, (o => each(o[0], (c => {
        const r = o[1];
        const l = e.get(c) || [];
        const i = t.contains(c);
        if (i && r) {
          const t = addEventListener(c, r, (o => {
            if (s) {
              t();
              e.delete(c);
            } else {
              n(o);
            }
          }));
          e.set(c, push(l, t));
        } else {
          runEachAndClear(l);
          e.delete(c);
        }
      }))));
    }
  };
  updateElements();
  return [ destroy, updateElements ];
};

const createDOMObserver = (t, n, o, s) => {
  let e = false;
  const {j: c, X: r, Y: l, W: i, J: a, G: u} = s || {};
  const d = debounce$1((() => e && o(true)), {
    _: 33,
    v: 99
  });
  const [f, v] = createEventContentChange(t, d, l);
  const p = c || [];
  const h = r || [];
  const g = concat(p, h);
  const observerCallback = (e, c) => {
    if (!isEmptyArray(c)) {
      const r = a || noop;
      const l = u || noop;
      const _ = [];
      const d = [];
      let f = false;
      let p = false;
      each(c, (o => {
        const {attributeName: e, target: c, type: a, oldValue: u, addedNodes: v, removedNodes: g} = o;
        const b = a === "attributes";
        const w = a === "childList";
        const y = t === c;
        const S = b && e;
        const m = S && getAttr(c, e || "");
        const O = isString(m) ? m : null;
        const $ = S && u !== O;
        const C = inArray(h, e) && $;
        if (n && (w || !y)) {
          const n = b && $;
          const a = n && i && is(c, i);
          const d = a ? !r(c, e, u, O) : !b || n;
          const f = d && !l(o, !!a, t, s);
          each(v, (t => push(_, t)));
          each(g, (t => push(_, t)));
          p = p || f;
        }
        if (!n && y && $ && !r(c, e, u, O)) {
          push(d, e);
          f = f || C;
        }
      }));
      v((t => deduplicateArray(_).reduce(((n, o) => {
        push(n, find$1(t, o));
        return is(o, t) ? push(n, o) : n;
      }), [])));
      if (n) {
        !e && p && o(false);
        return [ false ];
      }
      if (!isEmptyArray(d) || f) {
        const t = [ deduplicateArray(d), f ];
        !e && o.apply(0, t);
        return t;
      }
    }
  };
  const b = new _(bind(observerCallback, false));
  return [ () => {
    b.observe(t, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: g,
      subtree: n,
      childList: n,
      characterData: n
    });
    e = true;
    return () => {
      if (e) {
        f();
        b.disconnect();
        e = false;
      }
    };
  }, () => {
    if (e) {
      d.m();
      return observerCallback(true, b.takeRecords());
    }
  } ];
};

const $t = {};

const Ct = {};

const addPlugins = t => {
  each(t, (t => each(t, ((n, o) => {
    $t[o] = t[o];
  }))));
};

const registerPluginModuleInstances = (t, n, o) => keys(t).map((s => {
  const {static: e, instance: c} = t[s];
  const [r, l, i] = o || [];
  const a = o ? c : e;
  if (a) {
    const t = o ? a(r, l, n) : a(n);
    return (i || Ct)[s] = t;
  }
}));

const getStaticPluginModuleInstance = t => Ct[t];

const xt = "__osOptionsValidationPlugin";

const Ht = "__osSizeObserverPlugin";

const Et = /* @__PURE__ */ (() => ({
  [Ht]: {
    static: () => (t, n, o) => {
      const s = 3333333;
      const e = "scroll";
      const c = createDOM(`<div class="${ot}" dir="ltr"><div class="${ot}"><div class="${st}"></div></div><div class="${ot}"><div class="${st}" style="width: 200%; height: 200%"></div></div></div>`);
      const r = c[0];
      const a = r.lastChild;
      const u = r.firstChild;
      const _ = u == null ? void 0 : u.firstChild;
      let d = I(r);
      let f = d;
      let v = false;
      let p;
      const reset = () => {
        scrollElementTo(u, s);
        scrollElementTo(a, s);
      };
      const onResized = t => {
        p = 0;
        if (v) {
          d = f;
          n(t === true);
        }
      };
      const onScroll = t => {
        f = I(r);
        v = !t || !equalWH(f, d);
        if (t) {
          stopPropagation(t);
          if (v && !p) {
            l(p);
            p = i$1(onResized);
          }
        } else {
          onResized(t === false);
        }
        reset();
      };
      const h = [ appendChildren(t, c), addEventListener(u, e, onScroll), addEventListener(a, e, onScroll) ];
      addClass(t, nt);
      setStyles(_, {
        [$$1]: s,
        [C]: s
      });
      i$1(reset);
      return [ o ? bind(onScroll, false) : reset, h ];
    }
  }
}))();

const getShowNativeOverlaidScrollbars = (t, n) => {
  const {k: o} = n;
  const [s, e] = t("showNativeOverlaidScrollbars");
  return [ s && o.x && o.y, e ];
};

const overflowIsVisible = t => t.indexOf(x) === 0;

const createViewportOverflowState = (t, n) => {
  const getAxisOverflowStyle = (t, n, o, s) => {
    const e = t === x ? H : t.replace(`${x}-`, "");
    const c = overflowIsVisible(t);
    const r = overflowIsVisible(o);
    if (!n && !s) {
      return H;
    }
    if (c && r) {
      return x;
    }
    if (c) {
      const t = n ? x : H;
      return n && s ? e : t;
    }
    const l = r && s ? x : H;
    return n ? e : l;
  };
  const o = {
    x: getAxisOverflowStyle(n.x, t.x, n.y, t.y),
    y: getAxisOverflowStyle(n.y, t.y, n.x, t.x)
  };
  return {
    K: o,
    Z: {
      x: o.x === E,
      y: o.y === E
    }
  };
};

const zt = "__osScrollbarsHidingPlugin";

const It = /* @__PURE__ */ (() => ({
  [zt]: {
    static: () => ({
      tt: (t, n, o, s, e) => {
        const {nt: c, ot: r} = t;
        const {R: l, k: i, T: a} = s;
        const u = !c && !l && (i.x || i.y);
        const [_] = getShowNativeOverlaidScrollbars(e, s);
        const readViewportOverflowState = () => {
          const getStatePerAxis = t => {
            const n = getStyles(r, t);
            const o = n === E;
            return [ n, o ];
          };
          const [t, n] = getStatePerAxis(m);
          const [o, s] = getStatePerAxis(O);
          return {
            K: {
              x: t,
              y: o
            },
            Z: {
              x: n,
              y: s
            }
          };
        };
        const _getViewportOverflowHideOffset = t => {
          const {Z: n} = t;
          const o = l || _ ? 0 : 42;
          const getHideOffsetPerAxis = (t, n, s) => {
            const e = t ? o : s;
            const c = n && !l ? e : 0;
            const r = t && !!o;
            return [ c, r ];
          };
          const [s, e] = getHideOffsetPerAxis(i.x, n.x, a.x);
          const [c, r] = getHideOffsetPerAxis(i.y, n.y, a.y);
          return {
            st: {
              x: s,
              y: c
            },
            et: {
              x: e,
              y: r
            }
          };
        };
        const _hideNativeScrollbars = (t, {ct: o}, s) => {
          if (!c) {
            const e = assignDeep({}, {
              [y]: 0,
              [S]: 0,
              [w]: 0
            });
            const {st: c, et: r} = _getViewportOverflowHideOffset(t);
            const {x: l, y: i} = r;
            const {x: a, y: u} = c;
            const {rt: _} = n;
            const d = o ? w : y;
            const f = o ? g : h;
            const v = _[d];
            const p = _[S];
            const m = _[f];
            const O = _[b];
            e[$$1] = `calc(100% + ${u + v * -1}px)`;
            e[d] = -u + v;
            e[S] = -a + p;
            if (s) {
              e[f] = m + (i ? u : 0);
              e[b] = O + (l ? a : 0);
            }
            return e;
          }
        };
        const _arrangeViewport = (t, s, e) => {
          if (u) {
            const {rt: c} = n;
            const {st: l, et: i} = _getViewportOverflowHideOffset(t);
            const {x: a, y: u} = i;
            const {x: _, y: d} = l;
            const {ct: f} = o;
            const v = f ? h : g;
            const p = c[v];
            const b = c.paddingTop;
            const w = s.w + e.w;
            const y = s.h + e.h;
            const S = {
              w: d && u ? `${d + w - p}px` : "",
              h: _ && a ? `${_ + y - b}px` : ""
            };
            setStyles(r, {
              "--os-vaw": S.w,
              "--os-vah": S.h
            });
          }
          return u;
        };
        const _undoViewportArrange = t => {
          if (u) {
            const s = t || readViewportOverflowState();
            const {rt: e} = n;
            const {et: c} = _getViewportOverflowHideOffset(s);
            const {x: l, y: i} = c;
            const a = {};
            const assignProps = t => each(t, (t => {
              a[t] = e[t];
            }));
            if (l) {
              assignProps([ S, p, b ]);
            }
            if (i) {
              assignProps([ w, y, g, h ]);
            }
            const _ = getStyles(r, keys(a));
            const d = removeAttrClass(r, q, j);
            setStyles(r, a);
            return [ () => {
              setStyles(r, assignDeep({}, _, _hideNativeScrollbars(s, o, u)));
              d();
            }, s ];
          }
          return [ noop ];
        };
        return {
          lt: _getViewportOverflowHideOffset,
          it: _arrangeViewport,
          ut: _undoViewportArrange,
          _t: _hideNativeScrollbars
        };
      }
    })
  }
}))();

const At = "__osClickScrollPlugin";

const Dt = /* @__PURE__ */ (() => ({
  [At]: {
    static: () => (t, n, o, s) => {
      let e = false;
      let c = noop;
      const r = 133;
      const l = 222;
      const [i, a] = selfClearTimeout(r);
      const u = Math.sign(n);
      const _ = o * u;
      const d = _ / 2;
      const easing = t => 1 - (1 - t) * (1 - t);
      const easedEndPressAnimation = (n, o) => animateNumber(n, o, l, t, easing);
      const linearPressAnimation = (o, s) => animateNumber(o, n - _, r * s, ((o, s, e) => {
        t(o);
        if (e) {
          c = easedEndPressAnimation(o, n);
        }
      }));
      const f = animateNumber(0, _, l, ((r, l, a) => {
        t(r);
        if (a) {
          s(e);
          if (!e) {
            const t = n - r;
            const s = Math.sign(t - d) === u;
            s && i((() => {
              const s = t - _;
              const e = Math.sign(s) === u;
              c = e ? linearPressAnimation(r, Math.abs(s) / o) : easedEndPressAnimation(r, n);
            }));
          }
        }
      }), easing);
      return t => {
        e = true;
        if (t) {
          f();
        }
        a();
        c();
      };
    }
  }
}))();

const createSizeObserver = (t, n, o) => {
  const {dt: s} = o || {};
  const e = getStaticPluginModuleInstance(Ht);
  const [c] = createCache({
    o: false,
    u: true
  });
  return () => {
    const o = [];
    const r = createDOM(`<div class="${Q}"><div class="${tt}"></div></div>`);
    const l = r[0];
    const i = l.firstChild;
    const onSizeChangedCallbackProxy = t => {
      const o = t instanceof ResizeObserverEntry;
      let s = false;
      let e = false;
      if (o) {
        const [n, , o] = c(t.contentRect);
        const r = domRectHasDimensions(n);
        e = domRectAppeared(n, o);
        s = !e && !r;
      } else {
        e = t === true;
      }
      if (!s) {
        n({
          ft: true,
          dt: e
        });
      }
    };
    if (f) {
      const t = new f((t => onSizeChangedCallbackProxy(t.pop())));
      t.observe(i);
      push(o, (() => {
        t.disconnect();
      }));
    } else if (e) {
      const [t, n] = e(i, onSizeChangedCallbackProxy, s);
      push(o, concat([ addClass(l, Z), addEventListener(l, "animationstart", t) ], n));
    } else {
      return noop;
    }
    return bind(runEachAndClear, push(o, appendChildren(t, l)));
  };
};

const createTrinsicObserver = (t, n) => {
  let o;
  const isHeightIntrinsic = t => t.h === 0 || t.isIntersecting || t.intersectionRatio > 0;
  const s = createDiv(et);
  const [e] = createCache({
    o: false
  });
  const triggerOnTrinsicChangedCallback = (t, o) => {
    if (t) {
      const s = e(isHeightIntrinsic(t));
      const [, c] = s;
      return c && !o && n(s) && [ s ];
    }
  };
  const intersectionObserverCallback = (t, n) => triggerOnTrinsicChangedCallback(n.pop(), t);
  return [ () => {
    const n = [];
    if (d) {
      o = new d(bind(intersectionObserverCallback, false), {
        root: t
      });
      o.observe(s);
      push(n, (() => {
        o.disconnect();
      }));
    } else {
      const onSizeChanged = () => {
        const t = I(s);
        triggerOnTrinsicChangedCallback(t);
      };
      push(n, createSizeObserver(s, onSizeChanged)());
      onSizeChanged();
    }
    return bind(runEachAndClear, push(n, appendChildren(t, s)));
  }, () => o && intersectionObserverCallback(true, o.takeRecords()) ];
};

const createObserversSetup = (t, n, o, s) => {
  let e;
  let c;
  let r;
  let l;
  let i;
  let a;
  const u = `[${P}]`;
  const _ = `[${q}]`;
  const d = [ "id", "class", "style", "open", "wrap", "cols", "rows" ];
  const {vt: v, ht: p, ot: h, gt: g, bt: b, nt: w, wt: y, yt: S, St: m, Ot: O} = t;
  const getDirectionIsRTL = t => getStyles(t, "direction") === "rtl";
  const $ = {
    $t: false,
    ct: getDirectionIsRTL(v)
  };
  const C = getEnvironment();
  const x = getStaticPluginModuleInstance(zt);
  const [H] = createCache({
    i: equalWH,
    o: {
      w: 0,
      h: 0
    }
  }, (() => {
    const s = x && x.tt(t, n, $, C, o).ut;
    const e = y && w;
    const c = !e && hasAttrClass(p, P, L);
    const r = !w && S(j);
    const l = r && getElementScroll(g);
    const i = l && O();
    const a = m(X, c);
    const u = r && s && s()[0];
    const _ = D(h);
    const d = getFractionalSize(h);
    u && u();
    scrollElementTo(g, l);
    i && i();
    c && a();
    return {
      w: _.w + d.w,
      h: _.h + d.h
    };
  }));
  const E = debounce$1(s, {
    _: () => e,
    v: () => c,
    S(t, n) {
      const [o] = t;
      const [s] = n;
      return [ concat(keys(o), keys(s)).reduce(((t, n) => {
        t[n] = o[n] || s[n];
        return t;
      }), {}) ];
    }
  });
  const setDirection = t => {
    const n = getDirectionIsRTL(v);
    assignDeep(t, {
      Ct: a !== n
    });
    assignDeep($, {
      ct: n
    });
    a = n;
  };
  const onTrinsicChanged = (t, n) => {
    const [o, e] = t;
    const c = {
      xt: e
    };
    assignDeep($, {
      $t: o
    });
    !n && s(c);
    return c;
  };
  const onSizeChanged = ({ft: t, dt: n}) => {
    const o = t && !n;
    const e = !o && C.R ? E : s;
    const c = {
      ft: t || n,
      dt: n
    };
    setDirection(c);
    e(c);
  };
  const onContentMutation = (t, n) => {
    const [, o] = H();
    const e = {
      Ht: o
    };
    setDirection(e);
    const c = t ? s : E;
    o && !n && c(e);
    return e;
  };
  const onHostMutation = (t, n, o) => {
    const s = {
      Et: n
    };
    setDirection(s);
    if (n && !o) {
      E(s);
    }
    return s;
  };
  const [z, I] = b ? createTrinsicObserver(p, onTrinsicChanged) : [];
  const A = !w && createSizeObserver(p, onSizeChanged, {
    dt: true
  });
  const [M, T] = createDOMObserver(p, false, onHostMutation, {
    X: d,
    j: d
  });
  const k = w && f && new f((t => {
    const n = t[t.length - 1].contentRect;
    onSizeChanged({
      ft: true,
      dt: domRectAppeared(n, i)
    });
    i = n;
  }));
  const R = debounce$1((() => {
    const [, t] = H();
    s({
      Ht: t
    });
  }), {
    _: 222,
    p: true
  });
  return [ () => {
    k && k.observe(p);
    const t = A && A();
    const n = z && z();
    const o = M();
    const s = C.L((t => {
      if (t) {
        E({
          zt: t
        });
      } else {
        R();
      }
    }));
    return () => {
      k && k.disconnect();
      t && t();
      n && n();
      l && l();
      o();
      s();
    };
  }, ({It: t, At: n, Dt: o}) => {
    const s = {};
    const [i] = t("update.ignoreMutation");
    const [a, f] = t("update.attributes");
    const [v, p] = t("update.elementEvents");
    const [g, y] = t("update.debounce");
    const S = p || f;
    const m = n || o;
    const ignoreMutationFromOptions = t => isFunction(i) && i(t);
    if (S) {
      r && r();
      l && l();
      const [t, n] = createDOMObserver(b || h, true, onContentMutation, {
        j: concat(d, a || []),
        Y: v,
        W: u,
        G: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s && !w ? liesBetween(o, u, _) : false;
          return e || !!closest$1(o, `.${rt}`) || !!ignoreMutationFromOptions(t);
        }
      });
      l = t();
      r = n;
    }
    if (y) {
      E.m();
      if (isArray(g)) {
        const t = g[0];
        const n = g[1];
        e = isNumber(t) && t;
        c = isNumber(n) && n;
      } else if (isNumber(g)) {
        e = g;
        c = false;
      } else {
        e = false;
        c = false;
      }
    }
    if (m) {
      const t = T();
      const n = I && I();
      const o = r && r();
      t && assignDeep(s, onHostMutation(t[0], t[1], m));
      n && assignDeep(s, onTrinsicChanged(n[0], m));
      o && assignDeep(s, onContentMutation(o[0], m));
    }
    setDirection(s);
    return s;
  }, $ ];
};

const createScrollbarsSetupElements = (t, n, o, s) => {
  const e = "--os-viewport-percent";
  const c = "--os-scroll-percent";
  const r = "--os-scroll-direction";
  const {U: l} = getEnvironment();
  const {scrollbars: i} = l();
  const {slot: a} = i;
  const {vt: u, ht: _, ot: d, Mt: f, gt: p, wt: h, nt: g} = n;
  const {scrollbars: b} = f ? {} : t;
  const {slot: w} = b || {};
  const y = [];
  const S = [];
  const m = [];
  const O = dynamicInitializationElement([ u, _, d ], (() => g && h ? u : _), a, w);
  const initScrollTimeline = t => {
    if (v) {
      const n = new v({
        source: p,
        axis: t
      });
      const _addScrollPercentAnimation = t => {
        const o = t.Tt.animate({
          clear: [ "left" ],
          [c]: [ 0, 1 ]
        }, {
          timeline: n
        });
        return () => o.cancel();
      };
      return {
        kt: _addScrollPercentAnimation
      };
    }
  };
  const $ = {
    x: initScrollTimeline("x"),
    y: initScrollTimeline("y")
  };
  const getViewportPercent = () => {
    const {Rt: t, Vt: n} = o;
    const getAxisValue = (t, n) => capNumber(0, 1, t / (t + n) || 0);
    return {
      x: getAxisValue(n.x, t.x),
      y: getAxisValue(n.y, t.y)
    };
  };
  const scrollbarStructureAddRemoveClass = (t, n, o) => {
    const s = o ? addClass : removeClass;
    each(t, (t => {
      s(t.Tt, n);
    }));
  };
  const scrollbarStyle = (t, n) => {
    each(t, (t => {
      const [o, s] = n(t);
      setStyles(o, s);
    }));
  };
  const scrollbarsAddRemoveClass = (t, n, o) => {
    const s = isBoolean(o);
    const e = s ? o : true;
    const c = s ? !o : true;
    e && scrollbarStructureAddRemoveClass(S, t, n);
    c && scrollbarStructureAddRemoveClass(m, t, n);
  };
  const refreshScrollbarsHandleLength = () => {
    const t = getViewportPercent();
    const createScrollbarStyleFn = t => n => [ n.Tt, {
      [e]: roundCssNumber(t) + ""
    } ];
    scrollbarStyle(S, createScrollbarStyleFn(t.x));
    scrollbarStyle(m, createScrollbarStyleFn(t.y));
  };
  const refreshScrollbarsHandleOffset = () => {
    if (!v) {
      const {Lt: t} = o;
      const n = getScrollCoordinatesPercent(t, getElementScroll(p));
      const createScrollbarStyleFn = t => n => [ n.Tt, {
        [c]: roundCssNumber(t) + ""
      } ];
      scrollbarStyle(S, createScrollbarStyleFn(n.x));
      scrollbarStyle(m, createScrollbarStyleFn(n.y));
    }
  };
  const refreshScrollbarsScrollCoordinates = () => {
    const {Lt: t} = o;
    const n = isDefaultDirectionScrollCoordinates(t);
    const createScrollbarStyleFn = t => n => [ n.Tt, {
      [r]: t ? "0" : "1"
    } ];
    scrollbarStyle(S, createScrollbarStyleFn(n.x));
    scrollbarStyle(m, createScrollbarStyleFn(n.y));
  };
  const refreshScrollbarsScrollbarOffset = () => {
    if (g && !h) {
      const {Rt: t, Lt: n} = o;
      const s = isDefaultDirectionScrollCoordinates(n);
      const e = getScrollCoordinatesPercent(n, getElementScroll(p));
      const styleScrollbarPosition = n => {
        const {Tt: o} = n;
        const c = parent(o) === d && o;
        const getTranslateValue = (t, n, o) => {
          const s = n * t;
          return numberToCssPx(o ? s : -s);
        };
        return [ c, c && {
          transform: getTrasformTranslateValue({
            x: getTranslateValue(e.x, t.x, s.x),
            y: getTranslateValue(e.y, t.y, s.y)
          })
        } ];
      };
      scrollbarStyle(S, styleScrollbarPosition);
      scrollbarStyle(m, styleScrollbarPosition);
    }
  };
  const generateScrollbarDOM = t => {
    const n = t ? "x" : "y";
    const o = t ? it : at;
    const e = createDiv(`${rt} ${o}`);
    const c = createDiv(ut);
    const r = createDiv(_t);
    const l = {
      Tt: e,
      Ut: c,
      Pt: r
    };
    const i = $[n];
    push(t ? S : m, l);
    push(y, [ appendChildren(e, c), appendChildren(c, r), bind(removeElements, e), i && i.kt(l), s(l, scrollbarsAddRemoveClass, t) ]);
    return l;
  };
  const C = bind(generateScrollbarDOM, true);
  const x = bind(generateScrollbarDOM, false);
  const appendElements = () => {
    appendChildren(O, S[0].Tt);
    appendChildren(O, m[0].Tt);
    return bind(runEachAndClear, y);
  };
  C();
  x();
  return [ {
    Nt: refreshScrollbarsHandleLength,
    qt: refreshScrollbarsHandleOffset,
    Bt: refreshScrollbarsScrollCoordinates,
    Ft: refreshScrollbarsScrollbarOffset,
    jt: scrollbarsAddRemoveClass,
    Xt: {
      Yt: S,
      Wt: C,
      Jt: bind(scrollbarStyle, S)
    },
    Gt: {
      Yt: m,
      Wt: x,
      Jt: bind(scrollbarStyle, m)
    }
  }, appendElements ];
};

const createScrollbarsSetupEvents = (t, n, o, s) => (r, l, i) => {
  const {ht: u, ot: _, nt: d, gt: f, Kt: v, Ot: p} = n;
  const {Tt: h, Ut: g, Pt: b} = r;
  const [w, y] = selfClearTimeout(333);
  const [S, m] = selfClearTimeout(444);
  const scrollOffsetElementScrollBy = t => {
    isFunction(f.scrollBy) && f.scrollBy({
      behavior: "smooth",
      left: t.x,
      top: t.y
    });
  };
  const createInteractiveScrollEvents = () => {
    const n = "pointerup pointercancel lostpointercapture";
    const s = `client${i ? "X" : "Y"}`;
    const r = i ? $$1 : C;
    const l = i ? "left" : "top";
    const a = i ? "w" : "h";
    const u = i ? "x" : "y";
    const createRelativeHandleMove = (t, n) => s => {
      const {Rt: e} = o;
      const c = I(g)[a] - I(b)[a];
      const r = n * s / c;
      const l = r * e[u];
      scrollElementTo(f, {
        [u]: t + l
      });
    };
    const _ = [];
    return addEventListener(g, "pointerdown", (o => {
      const i = closest$1(o.target, `.${_t}`) === b;
      const d = i ? b : g;
      const h = t.scrollbars;
      const w = h[i ? "dragScroll" : "clickScroll"];
      const {button: y, isPrimary: O, pointerType: $} = o;
      const {pointers: C} = h;
      const x = y === 0 && O && w && (C || []).includes($);
      if (x) {
        runEachAndClear(_);
        m();
        const t = !i && (o.shiftKey || w === "instant");
        const h = bind(getBoundingClientRect, b);
        const y = bind(getBoundingClientRect, g);
        const getHandleOffset = (t, n) => (t || h())[l] - (n || y())[l];
        const O = e(getBoundingClientRect(f)[r]) / I(f)[a] || 1;
        const $ = createRelativeHandleMove(getElementScroll(f)[u], 1 / O);
        const C = o[s];
        const x = h();
        const H = y();
        const E = x[r];
        const z = getHandleOffset(x, H) + E / 2;
        const A = C - H[l];
        const D = i ? 0 : A - z;
        const releasePointerCapture = t => {
          runEachAndClear(k);
          d.releasePointerCapture(t.pointerId);
        };
        const M = i || t;
        const T = p();
        const k = [ addEventListener(v, n, releasePointerCapture), addEventListener(v, "selectstart", (t => preventDefault(t)), {
          H: false
        }), addEventListener(g, n, releasePointerCapture), M && addEventListener(g, "pointermove", (t => $(D + (t[s] - C)))), M && (() => {
          const t = getElementScroll(f);
          T();
          const n = getElementScroll(f);
          const o = {
            x: n.x - t.x,
            y: n.y - t.y
          };
          if (c(o.x) > 3 || c(o.y) > 3) {
            p();
            scrollElementTo(f, t);
            scrollOffsetElementScrollBy(o);
            S(T);
          }
        }) ];
        d.setPointerCapture(o.pointerId);
        if (t) {
          $(D);
        } else if (!i) {
          const t = getStaticPluginModuleInstance(At);
          if (t) {
            const n = t($, D, E, (t => {
              if (t) {
                T();
              } else {
                push(k, T);
              }
            }));
            push(k, n);
            push(_, bind(n, true));
          }
        }
      }
    }));
  };
  let O = true;
  return bind(runEachAndClear, [ addEventListener(b, "pointermove pointerleave", s), addEventListener(h, "pointerenter", (() => {
    l(vt, true);
  })), addEventListener(h, "pointerleave pointercancel", (() => {
    l(vt, false);
  })), !d && addEventListener(h, "mousedown", (() => {
    const t = getFocusedElement();
    if (hasAttr(t, q) || hasAttr(t, P) || t === document.body) {
      a(bind(focusElement, _), 25);
    }
  })), addEventListener(h, "wheel", (t => {
    const {deltaX: n, deltaY: o, deltaMode: s} = t;
    if (O && s === 0 && parent(h) === u) {
      scrollOffsetElementScrollBy({
        x: n,
        y: o
      });
    }
    O = false;
    l(bt, true);
    w((() => {
      O = true;
      l(bt);
    }));
    preventDefault(t);
  }), {
    H: false,
    I: true
  }), addEventListener(h, "pointerdown", bind(addEventListener, v, "click", stopAndPrevent, {
    A: true,
    I: true,
    H: false
  }), {
    I: true
  }), createInteractiveScrollEvents(), y, m ]);
};

const createScrollbarsSetup = (t, n, o, s, e, c) => {
  let r;
  let l;
  let i;
  let a;
  let u;
  let _ = noop;
  let d = 0;
  const isHoverablePointerType = t => t.pointerType === "mouse";
  const [f, v] = selfClearTimeout();
  const [p, h] = selfClearTimeout(100);
  const [g, b] = selfClearTimeout(100);
  const [w, y] = selfClearTimeout((() => d));
  const [S, m] = createScrollbarsSetupElements(t, e, s, createScrollbarsSetupEvents(n, e, s, (t => isHoverablePointerType(t) && manageScrollbarsAutoHideInstantInteraction())));
  const {ht: O, Qt: $, wt: C} = e;
  const {jt: H, Nt: z, qt: I, Bt: A, Ft: D} = S;
  const manageScrollbarsAutoHide = (t, n) => {
    y();
    if (t) {
      H(gt);
    } else {
      const t = bind(H, gt, true);
      if (d > 0 && !n) {
        w(t);
      } else {
        t();
      }
    }
  };
  const manageScrollbarsAutoHideInstantInteraction = () => {
    if (i ? !r : !a) {
      manageScrollbarsAutoHide(true);
      p((() => {
        manageScrollbarsAutoHide(false);
      }));
    }
  };
  const manageAutoHideSuspension = t => {
    H(ht, t, true);
    H(ht, t, false);
  };
  const onHostMouseEnter = t => {
    if (isHoverablePointerType(t)) {
      r = i;
      i && manageScrollbarsAutoHide(true);
    }
  };
  const M = [ y, h, b, v, () => _(), addEventListener(O, "pointerover", onHostMouseEnter, {
    A: true
  }), addEventListener(O, "pointerenter", onHostMouseEnter), addEventListener(O, "pointerleave", (t => {
    if (isHoverablePointerType(t)) {
      r = false;
      i && manageScrollbarsAutoHide(false);
    }
  })), addEventListener(O, "pointermove", (t => {
    isHoverablePointerType(t) && l && manageScrollbarsAutoHideInstantInteraction();
  })), addEventListener($, "scroll", (t => {
    f((() => {
      I();
      manageScrollbarsAutoHideInstantInteraction();
    }));
    c(t);
    D();
  })) ];
  return [ () => bind(runEachAndClear, push(M, m())), ({It: t, Dt: n, Zt: e, tn: c}) => {
    const {nn: r, sn: f, en: v, cn: p} = c || {};
    const {Ct: h, dt: b} = e || {};
    const {ct: w} = o;
    const {k: y} = getEnvironment();
    const {K: S, rn: m} = s;
    const [O, M] = t("showNativeOverlaidScrollbars");
    const [T, k] = t("scrollbars.theme");
    const [R, V] = t("scrollbars.visibility");
    const [L, U] = t("scrollbars.autoHide");
    const [P, N] = t("scrollbars.autoHideSuspend");
    const [q] = t("scrollbars.autoHideDelay");
    const [B, F] = t("scrollbars.dragScroll");
    const [j, X] = t("scrollbars.clickScroll");
    const [Y, W] = t("overflow");
    const J = b && !n;
    const G = m.x || m.y;
    const K = r || f || p || h || n;
    const Q = v || V || W;
    const Z = O && y.x && y.y;
    const setScrollbarVisibility = (t, n, o) => {
      const s = t.includes(E) && (R === x || R === "auto" && n === E);
      H(dt, s, o);
      return s;
    };
    d = q;
    if (J) {
      if (P && G) {
        manageAutoHideSuspension(false);
        _();
        g((() => {
          _ = addEventListener($, "scroll", bind(manageAutoHideSuspension, true), {
            A: true
          });
        }));
      } else {
        manageAutoHideSuspension(true);
      }
    }
    if (M) {
      H(ct, Z);
    }
    if (k) {
      H(u);
      H(T, true);
      u = T;
    }
    if (N && !P) {
      manageAutoHideSuspension(true);
    }
    if (U) {
      l = L === "move";
      i = L === "leave";
      a = L === "never";
      manageScrollbarsAutoHide(a, true);
    }
    if (F) {
      H(yt, B);
    }
    if (X) {
      H(wt, !!j);
    }
    if (Q) {
      const t = setScrollbarVisibility(Y.x, S.x, true);
      const n = setScrollbarVisibility(Y.y, S.y, false);
      const o = t && n;
      H(ft, !o);
    }
    if (K) {
      I();
      z();
      D();
      p && A();
      H(pt, !m.x, true);
      H(pt, !m.y, false);
      H(lt, w && !C);
    }
  }, {}, S ];
};

const createStructureSetupElements = t => {
  const o = getEnvironment();
  const {U: s, R: e} = o;
  const {elements: c} = s();
  const {padding: r, viewport: l, content: i} = c;
  const a = isHTMLElement(t);
  const u = a ? {} : t;
  const {elements: _} = u;
  const {padding: d, viewport: f, content: v} = _ || {};
  const p = a ? t : u.target;
  const h = isBodyElement(p);
  const g = p.ownerDocument;
  const b = g.documentElement;
  const getDocumentWindow = () => g.defaultView || n;
  const w = bind(staticInitializationElement, [ p ]);
  const y = bind(dynamicInitializationElement, [ p ]);
  const S = bind(createDiv, "");
  const $ = bind(w, S, l);
  const C = bind(y, S, i);
  const elementHasOverflow = t => {
    const n = I(t);
    const o = D(t);
    const s = getStyles(t, m);
    const e = getStyles(t, O);
    return o.w - n.w > 0 && !overflowIsVisible(s) || o.h - n.h > 0 && !overflowIsVisible(e);
  };
  const x = $(f);
  const H = x === p;
  const E = H && h;
  const z = !H && C(v);
  const A = !H && x === z;
  const M = E ? b : x;
  const T = E ? M : p;
  const k = !H && y(S, r, d);
  const R = !A && z;
  const L = [ R, M, k, T ].map((t => isHTMLElement(t) && !parent(t) && t));
  const elementIsGenerated = t => t && inArray(L, t);
  const B = !elementIsGenerated(M) && elementHasOverflow(M) ? M : p;
  const F = E ? b : M;
  const j = E ? g : M;
  const X = {
    vt: p,
    ht: T,
    ot: M,
    ln: k,
    bt: R,
    gt: F,
    Qt: j,
    an: h ? b : B,
    Kt: g,
    wt: h,
    Mt: a,
    nt: H,
    un: getDocumentWindow,
    yt: t => hasAttrClass(M, q, t),
    St: (t, n) => addRemoveAttrClass(M, q, t, n),
    Ot: () => addRemoveAttrClass(F, q, Y, true)
  };
  const {vt: J, ht: Q, ln: Z, ot: tt, bt: nt} = X;
  const ot = [ () => {
    removeAttrs(Q, [ P, V ]);
    removeAttrs(J, V);
    if (h) {
      removeAttrs(b, [ V, P ]);
    }
  } ];
  let st = contents([ nt, tt, Z, Q, J ].find((t => t && !elementIsGenerated(t))));
  const et = E ? J : nt || tt;
  const ct = bind(runEachAndClear, ot);
  const appendElements = () => {
    const t = getDocumentWindow();
    const n = getFocusedElement();
    const unwrap = t => {
      appendChildren(parent(t), contents(t));
      removeElements(t);
    };
    const prepareWrapUnwrapFocus = t => addEventListener(t, "focusin focusout focus blur", stopAndPrevent, {
      I: true,
      H: false
    });
    const o = "tabindex";
    const s = getAttr(tt, o);
    const c = prepareWrapUnwrapFocus(n);
    setAttrs(Q, P, H ? "" : N);
    setAttrs(Z, G, "");
    setAttrs(tt, q, "");
    setAttrs(nt, K, "");
    if (!H) {
      setAttrs(tt, o, s || "-1");
      h && setAttrs(b, U, "");
    }
    appendChildren(et, st);
    appendChildren(Q, Z);
    appendChildren(Z || Q, !H && tt);
    appendChildren(tt, nt);
    push(ot, [ c, () => {
      const t = getFocusedElement();
      const n = elementIsGenerated(tt);
      const e = n && t === tt ? J : t;
      const c = prepareWrapUnwrapFocus(e);
      removeAttrs(Z, G);
      removeAttrs(nt, K);
      removeAttrs(tt, q);
      h && removeAttrs(b, U);
      s ? setAttrs(tt, o, s) : removeAttrs(tt, o);
      elementIsGenerated(nt) && unwrap(nt);
      n && unwrap(tt);
      elementIsGenerated(Z) && unwrap(Z);
      focusElement(e);
      c();
    } ]);
    if (e && !H) {
      addAttrClass(tt, q, W);
      push(ot, bind(removeAttrs, tt, q));
    }
    focusElement(!H && h && n === J && t.top === t ? tt : n);
    c();
    st = 0;
    return ct;
  };
  return [ X, appendElements, ct ];
};

const createTrinsicUpdateSegment = ({bt: t}) => ({Zt: n, _n: o, Dt: s}) => {
  const {xt: e} = n || {};
  const {$t: c} = o;
  const r = t && (e || s);
  if (r) {
    setStyles(t, {
      [C]: c && "100%"
    });
  }
};

const createPaddingUpdateSegment = ({ht: t, ln: n, ot: o, nt: s}, e) => {
  const [c, r] = createCache({
    i: equalTRBL,
    o: topRightBottomLeft()
  }, bind(topRightBottomLeft, t, "padding", ""));
  return ({It: t, Zt: l, _n: i, Dt: a}) => {
    let [u, _] = r(a);
    const {R: d} = getEnvironment();
    const {ft: f, Ht: v, Ct: m} = l || {};
    const {ct: O} = i;
    const [C, x] = t("paddingAbsolute");
    const H = a || v;
    if (f || _ || H) {
      [u, _] = c(a);
    }
    const E = !s && (x || m || _);
    if (E) {
      const t = !C || !n && !d;
      const s = u.r + u.l;
      const c = u.t + u.b;
      const r = {
        [y]: t && !O ? -s : 0,
        [S]: t ? -c : 0,
        [w]: t && O ? -s : 0,
        top: t ? -u.t : 0,
        right: t ? O ? -u.r : "auto" : 0,
        left: t ? O ? "auto" : -u.l : 0,
        [$$1]: t && `calc(100% + ${s}px)`
      };
      const l = {
        [p]: t ? u.t : 0,
        [h]: t ? u.r : 0,
        [b]: t ? u.b : 0,
        [g]: t ? u.l : 0
      };
      setStyles(n || o, r);
      setStyles(o, l);
      assignDeep(e, {
        ln: u,
        dn: !t,
        rt: n ? l : assignDeep({}, r, l)
      });
    }
    return {
      fn: E
    };
  };
};

const createOverflowUpdateSegment = (t, s) => {
  const e = getEnvironment();
  const {ht: c, ln: r, ot: l, nt: a, Qt: u, gt: _, wt: d, St: f, un: v} = t;
  const {R: p} = e;
  const h = d && a;
  const g = bind(o, 0);
  const b = {
    display: () => false,
    direction: t => t !== "ltr",
    flexDirection: t => t.endsWith("-reverse"),
    writingMode: t => t !== "horizontal-tb"
  };
  const w = keys(b);
  const y = {
    i: equalWH,
    o: {
      w: 0,
      h: 0
    }
  };
  const S = {
    i: equalXY,
    o: {}
  };
  const setMeasuringMode = t => {
    f(X, !h && t);
  };
  const getMeasuredScrollCoordinates = t => {
    const n = w.some((n => {
      const o = t[n];
      return o && b[n](o);
    }));
    if (!n) {
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    }
    setMeasuringMode(true);
    const o = getElementScroll(_);
    const s = f(J, true);
    const e = addEventListener(u, E, (t => {
      const n = getElementScroll(_);
      if (t.isTrusted && n.x === o.x && n.y === o.y) {
        stopPropagation(t);
      }
    }), {
      I: true,
      A: true
    });
    scrollElementTo(_, {
      x: 0,
      y: 0
    });
    s();
    const c = getElementScroll(_);
    const r = D(_);
    scrollElementTo(_, {
      x: r.w,
      y: r.h
    });
    const l = getElementScroll(_);
    scrollElementTo(_, {
      x: l.x - c.x < 1 && -r.w,
      y: l.y - c.y < 1 && -r.h
    });
    const a = getElementScroll(_);
    scrollElementTo(_, o);
    i$1((() => e()));
    return {
      D: c,
      M: a
    };
  };
  const getOverflowAmount = (t, o) => {
    const s = n.devicePixelRatio % 1 !== 0 ? 1 : 0;
    const e = {
      w: g(t.w - o.w),
      h: g(t.h - o.h)
    };
    return {
      w: e.w > s ? e.w : 0,
      h: e.h > s ? e.h : 0
    };
  };
  const [m, O] = createCache(y, bind(getFractionalSize, l));
  const [$, C] = createCache(y, bind(D, l));
  const [z, I] = createCache(y);
  const [M] = createCache(S);
  const [T, k] = createCache(y);
  const [R] = createCache(S);
  const [V] = createCache({
    i: (t, n) => equal(t, n, w),
    o: {}
  }, (() => hasDimensions(l) ? getStyles(l, w) : {}));
  const [U, N] = createCache({
    i: (t, n) => equalXY(t.D, n.D) && equalXY(t.M, n.M),
    o: getZeroScrollCoordinates()
  });
  const q = getStaticPluginModuleInstance(zt);
  const createViewportOverflowStyleClassName = (t, n) => {
    const o = n ? B : F;
    return `${o}${capitalizeFirstLetter(t)}`;
  };
  const setViewportOverflowStyle = t => {
    const createAllOverflowStyleClassNames = t => [ x, H, E ].map((n => createViewportOverflowStyleClassName(n, t)));
    const n = createAllOverflowStyleClassNames(true).concat(createAllOverflowStyleClassNames()).join(" ");
    f(n);
    f(keys(t).map((n => createViewportOverflowStyleClassName(t[n], n === "x"))).join(" "), true);
  };
  return ({It: n, Zt: o, _n: i, Dt: a}, {fn: u}) => {
    const {ft: _, Ht: d, Ct: b, dt: w, zt: y} = o || {};
    const S = q && q.tt(t, s, i, e, n);
    const {it: x, ut: H, _t: E} = S || {};
    const [D, B] = getShowNativeOverlaidScrollbars(n, e);
    const [F, j] = n("overflow");
    const X = overflowIsVisible(F.x);
    const Y = overflowIsVisible(F.y);
    const J = true;
    let K = O(a);
    let Q = C(a);
    let Z = I(a);
    let tt = k(a);
    if (B && p) {
      f(W, !D);
    }
    {
      if (hasAttrClass(c, P, L)) {
        setMeasuringMode(true);
      }
      const [t] = H ? H() : [];
      const [n] = K = m(a);
      const [o] = Q = $(a);
      const s = A(l);
      const e = h && getWindowSize(v());
      const r = {
        w: g(o.w + n.w),
        h: g(o.h + n.h)
      };
      const i = {
        w: g((e ? e.w : s.w + g(s.w - o.w)) + n.w),
        h: g((e ? e.h : s.h + g(s.h - o.h)) + n.h)
      };
      t && t();
      tt = T(i);
      Z = z(getOverflowAmount(r, i), a);
    }
    const [nt, ot] = tt;
    const [st, et] = Z;
    const [ct, rt] = Q;
    const [lt, it] = K;
    const [at, ut] = M({
      x: st.w > 0,
      y: st.h > 0
    });
    const _t = X && Y && (at.x || at.y) || X && at.x && !at.y || Y && at.y && !at.x;
    const dt = u || b || y || it || rt || ot || et || j || B || J;
    const ft = createViewportOverflowState(at, F);
    const [vt, pt] = R(ft.K);
    const [ht, gt] = V(a);
    const bt = b || w || gt || ut || a;
    const [wt, yt] = bt ? U(getMeasuredScrollCoordinates(ht), a) : N();
    if (dt) {
      pt && setViewportOverflowStyle(ft.K);
      if (E && x) {
        setStyles(l, E(ft, i, x(ft, ct, lt)));
      }
    }
    setMeasuringMode(false);
    addRemoveAttrClass(c, P, L, _t);
    addRemoveAttrClass(r, G, L, _t);
    assignDeep(s, {
      K: vt,
      Vt: {
        x: nt.w,
        y: nt.h
      },
      Rt: {
        x: st.w,
        y: st.h
      },
      rn: at,
      Lt: sanitizeScrollCoordinates(wt, st)
    });
    return {
      en: pt,
      nn: ot,
      sn: et,
      cn: yt || et,
      vn: bt
    };
  };
};

const createStructureSetup = t => {
  const [n, o, s] = createStructureSetupElements(t);
  const e = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    dn: false,
    rt: {
      [y]: 0,
      [S]: 0,
      [w]: 0,
      [p]: 0,
      [h]: 0,
      [b]: 0,
      [g]: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    Rt: {
      x: 0,
      y: 0
    },
    K: {
      x: H,
      y: H
    },
    rn: {
      x: false,
      y: false
    },
    Lt: getZeroScrollCoordinates()
  };
  const {vt: c, gt: r, nt: l, Ot: i} = n;
  const {R: a, k: u} = getEnvironment();
  const _ = !a && (u.x || u.y);
  const d = [ createTrinsicUpdateSegment(n), createPaddingUpdateSegment(n, e), createOverflowUpdateSegment(n, e) ];
  return [ o, t => {
    const n = {};
    const o = _;
    const s = o && getElementScroll(r);
    const e = s && i();
    each(d, (o => {
      assignDeep(n, o(t, n) || {});
    }));
    scrollElementTo(r, s);
    e && e();
    !l && scrollElementTo(c, 0);
    return n;
  }, e, n, s ];
};

const createSetups = (t, n, o, s, e) => {
  let c = false;
  const r = createOptionCheck(n, {});
  const [l, i, a, u, _] = createStructureSetup(t);
  const [d, f, v] = createObserversSetup(u, a, r, (t => {
    update({}, t);
  }));
  const [p, h, , g] = createScrollbarsSetup(t, n, v, a, u, e);
  const updateHintsAreTruthy = t => keys(t).some((n => !!t[n]));
  const update = (t, e) => {
    if (o()) {
      return false;
    }
    const {pn: r, Dt: l, At: a, hn: u} = t;
    const _ = r || {};
    const d = !!l || !c;
    const p = {
      It: createOptionCheck(n, _, d),
      pn: _,
      Dt: d
    };
    if (u) {
      h(p);
      return false;
    }
    const g = e || f(assignDeep({}, p, {
      At: a
    }));
    const b = i(assignDeep({}, p, {
      _n: v,
      Zt: g
    }));
    h(assignDeep({}, p, {
      Zt: g,
      tn: b
    }));
    const w = updateHintsAreTruthy(g);
    const y = updateHintsAreTruthy(b);
    const S = w || y || !isEmptyObject(_) || d;
    c = true;
    S && s(t, {
      Zt: g,
      tn: b
    });
    return S;
  };
  return [ () => {
    const {an: t, gt: n, Ot: o} = u;
    const s = getElementScroll(t);
    const e = [ d(), l(), p() ];
    const c = o();
    scrollElementTo(n, s);
    c();
    return bind(runEachAndClear, e);
  }, update, () => ({
    gn: v,
    bn: a
  }), {
    wn: u,
    yn: g
  }, _ ];
};

const OverlayScrollbars = (t, n, o) => {
  const {N: s} = getEnvironment();
  const e = isHTMLElement(t);
  const c = e ? t : t.target;
  const r = getInstance(c);
  if (n && !r) {
    let r = false;
    const l = [];
    const i = {};
    const validateOptions = t => {
      const n = removeUndefinedProperties(t);
      const o = getStaticPluginModuleInstance(xt);
      return o ? o(n, true) : n;
    };
    const a = assignDeep({}, s(), validateOptions(n));
    const [u, _, d] = createEventListenerHub();
    const [f, v, p] = createEventListenerHub(o);
    const triggerEvent = (t, n) => {
      p(t, n);
      d(t, n);
    };
    const [h, g, b, w, y] = createSetups(t, a, (() => r), (({pn: t, Dt: n}, {Zt: o, tn: s}) => {
      const {ft: e, Ct: c, xt: r, Ht: l, Et: i, dt: a} = o;
      const {nn: u, sn: _, en: d, cn: f} = s;
      triggerEvent("updated", [ S, {
        updateHints: {
          sizeChanged: !!e,
          directionChanged: !!c,
          heightIntrinsicChanged: !!r,
          overflowEdgeChanged: !!u,
          overflowAmountChanged: !!_,
          overflowStyleChanged: !!d,
          scrollCoordinatesChanged: !!f,
          contentMutation: !!l,
          hostMutation: !!i,
          appear: !!a
        },
        changedOptions: t || {},
        force: !!n
      } ]);
    }), (t => triggerEvent("scroll", [ S, t ])));
    const destroy = t => {
      removeInstance(c);
      runEachAndClear(l);
      r = true;
      triggerEvent("destroyed", [ S, t ]);
      _();
      v();
    };
    const S = {
      options(t, n) {
        if (t) {
          const o = n ? s() : {};
          const e = getOptionsDiff(a, assignDeep(o, validateOptions(t)));
          if (!isEmptyObject(e)) {
            assignDeep(a, e);
            g({
              pn: e
            });
          }
        }
        return assignDeep({}, a);
      },
      on: f,
      off: (t, n) => {
        t && n && v(t, n);
      },
      state() {
        const {gn: t, bn: n} = b();
        const {ct: o} = t;
        const {Vt: s, Rt: e, K: c, rn: l, ln: i, dn: a, Lt: u} = n;
        return assignDeep({}, {
          overflowEdge: s,
          overflowAmount: e,
          overflowStyle: c,
          hasOverflow: l,
          scrollCoordinates: {
            start: u.D,
            end: u.M
          },
          padding: i,
          paddingAbsolute: a,
          directionRTL: o,
          destroyed: r
        });
      },
      elements() {
        const {vt: t, ht: n, ln: o, ot: s, bt: e, gt: c, Qt: r} = w.wn;
        const {Xt: l, Gt: i} = w.yn;
        const translateScrollbarStructure = t => {
          const {Pt: n, Ut: o, Tt: s} = t;
          return {
            scrollbar: s,
            track: o,
            handle: n
          };
        };
        const translateScrollbarsSetupElement = t => {
          const {Yt: n, Wt: o} = t;
          const s = translateScrollbarStructure(n[0]);
          return assignDeep({}, s, {
            clone: () => {
              const t = translateScrollbarStructure(o());
              g({
                hn: true
              });
              return t;
            }
          });
        };
        return assignDeep({}, {
          target: t,
          host: n,
          padding: o || s,
          viewport: s,
          content: e || s,
          scrollOffsetElement: c,
          scrollEventElement: r,
          scrollbarHorizontal: translateScrollbarsSetupElement(l),
          scrollbarVertical: translateScrollbarsSetupElement(i)
        });
      },
      update: t => g({
        Dt: t,
        At: true
      }),
      destroy: bind(destroy, false),
      plugin: t => i[keys(t)[0]]
    };
    push(l, [ y ]);
    addInstance(c, S);
    registerPluginModuleInstances($t, OverlayScrollbars, [ S, u, i ]);
    if (cancelInitialization(w.wn.wt, !e && t.cancel)) {
      destroy(true);
      return S;
    }
    push(l, h());
    triggerEvent("initialized", [ S ]);
    S.update();
    return S;
  }
  return r;
};

OverlayScrollbars.plugin = t => {
  const n = isArray(t);
  const o = n ? t : [ t ];
  const s = o.map((t => registerPluginModuleInstances(t, OverlayScrollbars)[0]));
  addPlugins(o);
  return n ? s : s[0];
};

OverlayScrollbars.valid = t => {
  const n = t && t.elements;
  const o = isFunction(n) && n();
  return isPlainObject(o) && !!getInstance(o.target);
};

OverlayScrollbars.env = () => {
  const {T: t, k: n, R: o, V: s, B: e, F: c, U: r, P: l, N: i, q: a} = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: n,
    scrollbarsHiding: o,
    scrollTimeline: s,
    staticDefaultInitialization: e,
    staticDefaultOptions: c,
    getDefaultInitialization: r,
    setDefaultInitialization: l,
    getDefaultOptions: i,
    setDefaultOptions: a
  });
};

OverlayScrollbars.nonce = setNonce;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lib = {exports: {}};

(function (module, exports) {
	!function(r,n){module.exports=n();}("undefined"!=typeof self?self:commonjsGlobal,(function(){return function(r){var n={};function e(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return r[t].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=r,e.c=n,e.d=function(r,n,t){e.o(r,n)||Object.defineProperty(r,n,{enumerable:!0,get:t});},e.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0});},e.t=function(r,n){if(1&n&&(r=e(r)),8&n)return r;if(4&n&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(e.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&n&&"string"!=typeof r)for(var o in r)e.d(t,o,function(n){return r[n]}.bind(null,o));return t},e.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(n,"a",n),n},e.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},e.p="",e(e.s=0)}([function(r,n,e){e.r(n),e.d(n,"md5",(function(){return p}));var t="0123456789abcdef".split("");var o=function(r){for(var n="",e=0;e<4;e++)n+=t[r>>8*e+4&15]+t[r>>8*e&15];return n};var u=function(r){for(var n=r.length,e=0;e<n;e++)r[e]=o(r[e]);return r.join("")};var f=function(r,n){return r+n&4294967295};var i=function(r,n,e,t,o,u,i){return function(r,n,e){return f(r<<n|r>>>32-n,e)}(n=function(r,n,e,t){return n=f(f(n,r),f(e,t))}(r,n,t,u),o,e)};var a=function(r,n,e,t,o,u,f,a){return i(e&t|~e&o,n,e,u,f,a)};var c=function(r,n,e,t,o,u,f,a){return i(e&o|t&~o,n,e,u,f,a)};var l=function(r,n,e,t,o,u,f,a){return i(e^t^o,n,e,u,f,a)};var d=function(r,n,e,t,o,u,f,a){return i(t^(e|~o),n,e,u,f,a)};var v=function(r,n,e){void 0===e&&(e=f);var t=r[0],o=r[1],u=r[2],i=r[3],v=a.bind(null,e);t=v(t,o,u,i,n[0],7,-680876936),i=v(i,t,o,u,n[1],12,-389564586),u=v(u,i,t,o,n[2],17,606105819),o=v(o,u,i,t,n[3],22,-1044525330),t=v(t,o,u,i,n[4],7,-176418897),i=v(i,t,o,u,n[5],12,1200080426),u=v(u,i,t,o,n[6],17,-1473231341),o=v(o,u,i,t,n[7],22,-45705983),t=v(t,o,u,i,n[8],7,1770035416),i=v(i,t,o,u,n[9],12,-1958414417),u=v(u,i,t,o,n[10],17,-42063),o=v(o,u,i,t,n[11],22,-1990404162),t=v(t,o,u,i,n[12],7,1804603682),i=v(i,t,o,u,n[13],12,-40341101),u=v(u,i,t,o,n[14],17,-1502002290),o=v(o,u,i,t,n[15],22,1236535329);var s=c.bind(null,e);t=s(t,o,u,i,n[1],5,-165796510),i=s(i,t,o,u,n[6],9,-1069501632),u=s(u,i,t,o,n[11],14,643717713),o=s(o,u,i,t,n[0],20,-373897302),t=s(t,o,u,i,n[5],5,-701558691),i=s(i,t,o,u,n[10],9,38016083),u=s(u,i,t,o,n[15],14,-660478335),o=s(o,u,i,t,n[4],20,-405537848),t=s(t,o,u,i,n[9],5,568446438),i=s(i,t,o,u,n[14],9,-1019803690),u=s(u,i,t,o,n[3],14,-187363961),o=s(o,u,i,t,n[8],20,1163531501),t=s(t,o,u,i,n[13],5,-1444681467),i=s(i,t,o,u,n[2],9,-51403784),u=s(u,i,t,o,n[7],14,1735328473),o=s(o,u,i,t,n[12],20,-1926607734);var b=l.bind(null,e);t=b(t,o,u,i,n[5],4,-378558),i=b(i,t,o,u,n[8],11,-2022574463),u=b(u,i,t,o,n[11],16,1839030562),o=b(o,u,i,t,n[14],23,-35309556),t=b(t,o,u,i,n[1],4,-1530992060),i=b(i,t,o,u,n[4],11,1272893353),u=b(u,i,t,o,n[7],16,-155497632),o=b(o,u,i,t,n[10],23,-1094730640),t=b(t,o,u,i,n[13],4,681279174),i=b(i,t,o,u,n[0],11,-358537222),u=b(u,i,t,o,n[3],16,-722521979),o=b(o,u,i,t,n[6],23,76029189),t=b(t,o,u,i,n[9],4,-640364487),i=b(i,t,o,u,n[12],11,-421815835),u=b(u,i,t,o,n[15],16,530742520),o=b(o,u,i,t,n[2],23,-995338651);var p=d.bind(null,e);t=p(t,o,u,i,n[0],6,-198630844),i=p(i,t,o,u,n[7],10,1126891415),u=p(u,i,t,o,n[14],15,-1416354905),o=p(o,u,i,t,n[5],21,-57434055),t=p(t,o,u,i,n[12],6,1700485571),i=p(i,t,o,u,n[3],10,-1894986606),u=p(u,i,t,o,n[10],15,-1051523),o=p(o,u,i,t,n[1],21,-2054922799),t=p(t,o,u,i,n[8],6,1873313359),i=p(i,t,o,u,n[15],10,-30611744),u=p(u,i,t,o,n[6],15,-1560198380),o=p(o,u,i,t,n[13],21,1309151649),t=p(t,o,u,i,n[4],6,-145523070),i=p(i,t,o,u,n[11],10,-1120210379),u=p(u,i,t,o,n[2],15,718787259),o=p(o,u,i,t,n[9],21,-343485551),r[0]=e(t,r[0]),r[1]=e(o,r[1]),r[2]=e(u,r[2]),r[3]=e(i,r[3]);};var s=function(r){for(var n=[],e=0;e<64;e+=4)n[e>>2]=r.charCodeAt(e)+(r.charCodeAt(e+1)<<8)+(r.charCodeAt(e+2)<<16)+(r.charCodeAt(e+3)<<24);return n};var b=function(r,n){var e,t=r.length,o=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=t;e+=64)v(o,s(r.substring(e-64,e)),n);var u=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],f=(r=r.substring(e-64)).length;for(e=0;e<f;e++)u[e>>2]|=r.charCodeAt(e)<<(e%4<<3);if(u[e>>2]|=128<<(e%4<<3),e>55)for(v(o,u,n),e=16;e--;)u[e]=0;return u[14]=8*t,v(o,u,n),o};function p(r){var n;return "5d41402abc4b2a76b9719d911017c592"!==u(b("hello"))&&(n=function(r,n){var e=(65535&r)+(65535&n);return (r>>16)+(n>>16)+(e>>16)<<16|65535&e}),u(b(r,n))}}])}));
	
} (lib));

function _createForOfIteratorHelper$1(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray$1(r)) || e) { t && (r = t); var _n2 = 0, F = function F() {}; return { s: F, n: function n() { return _n2 >= r.length ? { done: !0 } : { done: !1, value: r[_n2++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray$1(r) { return _arrayWithoutHoles$1(r) || _iterableToArray$1(r) || _unsupportedIterableToArray$1(r) || _nonIterableSpread$1(); }
function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray$1(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles$1(r) { if (Array.isArray(r)) return _arrayLikeToArray$1(r); }
function _typeof$1(o) { "@babel/helpers - typeof"; return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$1(o); }
function _defineProperty$1(e, r, t) { return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _unsupportedIterableToArray$1(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$1(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$1(r, a) : void 0; } }
function _arrayLikeToArray$1(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties$1(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey$1(o.key), o); } }
function _createClass$1(e, r, t) { return r && _defineProperties$1(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey$1(t) { var i = _toPrimitive$1(t, "string"); return "symbol" == _typeof$1(i) ? i : i + ""; }
function _toPrimitive$1(t, r) { if ("object" != _typeof$1(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$1(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
function _classCallCheck$1(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper$1(t, o, e) { return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn$1(t, e) { if (e && ("object" == _typeof$1(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized$1(t); }
function _assertThisInitialized$1(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits$1(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf$1(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf$1(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf$1(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct$1()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf$1(p, r.prototype), p; }
function _isNativeReflectConstruct$1() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf$1(t, e) { return _setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf$1(t, e); }
function _getPrototypeOf$1(t) { return _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf$1(t); }
var RefException = /*#__PURE__*/function (_Error) {
  function RefException(str) {
    _classCallCheck$1(this, RefException);
    return _callSuper$1(this, RefException, ["Invalid reference : ".concat(str)]);
  }
  _inherits$1(RefException, _Error);
  return _createClass$1(RefException);
}(/*#__PURE__*/_wrapNativeSuper(Error));
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck$1(this, EventEmitter);
    _defineProperty$1(this, "_events", {});
    this.addEventListener = this.on;
    this.addListener = this.on;
    this.removeEventListener = this.off;
    this.removeListener = this.off;
  }
  return _createClass$1(EventEmitter, [{
    key: "on",
    value: function on(event, listener) {
      if (_typeof$1(this._events[event]) !== 'object') this._events[event] = [];
      this._events[event].push(listener);
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      clear(this._events);
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!event) {
        this.removeAllListeners();
        return;
      }
      if (_typeof$1(this._events[event]) !== 'object') return;
      if (listener) array_remove(this._events[event], listener);else clear(this._events[event]);
    }
  }, {
    key: "emit",
    value: function emit(event) {
      if (_typeof$1(this._events[event]) !== 'object') return;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      for (var _i = 0, _arr = _toConsumableArray$1(this._events[event]); _i < _arr.length; _i++) {
        var l = _arr[_i];
        l.apply(this, args);
      }
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      var _this4 = this;
      var _listener_wrapped = function listener_wrapped() {
        _this4.removeListener(event, _listener_wrapped);
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        listener.apply(_this4, args);
      };
      this.on(event, _listener_wrapped);
    }
  }]);
}();
var Timer = /*#__PURE__*/function (_EventEmitter2) {
  function Timer() {
    var _this5;
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var autostart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _classCallCheck$1(this, Timer);
    _this5 = _callSuper$1(this, Timer);
    _this5._total_time = time;
    _this5._interval_id;
    _this5._last_seconds_left;
    _this5._stopwatch = new StopWatch();
    _this5._stopwatch.on("pause", function () {
      clearInterval(_this5._interval_id);
      _this5.emit("pause");
    });
    _this5._stopwatch.on("start", function () {
      _this5._interval_id = setInterval(function () {
        return _this5.tick();
      }, Timer.TICK_INTERVAL);
      _this5.emit("start");
    });
    _this5._stopwatch.on("reset", function () {
      _this5._last_seconds_left = _this5.seconds_left;
      _this5.emit("reset");
      _this5.emit("second", _this5._last_seconds_left);
    });
    if (autostart) _this5.restart();
    return _this5;
  }
  _inherits$1(Timer, _EventEmitter2);
  return _createClass$1(Timer, [{
    key: "time_left",
    get: function get() {
      return Math.max(0, this._total_time - this._stopwatch.time);
    }
  }, {
    key: "seconds_left",
    get: function get() {
      return Math.ceil(this.time_left / 1000);
    }
  }, {
    key: "finished",
    get: function get() {
      return this.time_left <= 0;
    }
  }, {
    key: "paused",
    get: function get() {
      return this._stopwatch.paused;
    }
  }, {
    key: "restart",
    value: function restart(time) {
      if (time !== undefined) this._total_time = time;
      this._stopwatch.reset();
      this.resume();
    }
  }, {
    key: "tick",
    value: function tick() {
      var seconds_left = this.seconds_left;
      for (var i = this._last_seconds_left - 1; i >= seconds_left; i--) {
        this.emit("second", i);
      }
      this._last_seconds_left = seconds_left;
      this.emit("tick");
      if (this.finished) {
        this.pause();
        this.emit("finish");
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this._stopwatch.pause();
    }
  }, {
    key: "resume",
    value: function resume() {
      this._stopwatch.resume();
    }
  }, {
    key: "reset",
    value: function reset() {
      this._stopwatch.reset();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._stopwatch.destroy();
      this.removeAllListeners();
    }
  }]);
}(EventEmitter);
Timer.TICK_INTERVAL = 1000 / 60;
var StopWatch = /*#__PURE__*/function (_EventEmitter3) {
  function StopWatch() {
    var _this6;
    _classCallCheck$1(this, StopWatch);
    _this6 = _callSuper$1(this, StopWatch);
    _this6._start_time = 0;
    _this6._pause_time = 0;
    _this6._paused = true;
    return _this6;
  }
  _inherits$1(StopWatch, _EventEmitter3);
  return _createClass$1(StopWatch, [{
    key: "time",
    get: function get() {
      return (this._paused ? this._pause_time : Date.now()) - this._start_time;
    }
  }, {
    key: "paused",
    get: function get() {
      return this._paused;
    }
  }, {
    key: "start",
    value: function start() {
      var now = Date.now();
      if (!this._start_time) this._start_time = now;
      if (this._paused) {
        this._paused = false;
        this._start_time += now - this._pause_time;
        this._pause_time = 0;
        this.emit("start");
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      this.start();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this._paused) return;
      this._paused = true;
      this._pause_time = Date.now();
      this.emit("pause");
    }
  }, {
    key: "reset",
    value: function reset() {
      this._start_time = Date.now();
      if (this._paused) this._pause_time = this._start_time;
      this.emit("reset");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAllListeners();
    }
  }]);
}(EventEmitter);
var Diff = /*#__PURE__*/_createClass$1(function Diff(old_value, new_value) {
  _classCallCheck$1(this, Diff);
  if (old_value === new_value) this.type = 0;
  if (old_value === undefined) this.type = Diff.CREATED;else if (new_value === undefined) this.type = Diff.DELETED;else this.type = Diff.CHANGED;
  this.old_value = old_value;
  this.new_value = new_value;
  Object.freeze(this);
});
Diff.CREATED = 1;
Diff.DELETED = 2;
Diff.CHANGED = 3;
var Point = /*#__PURE__*/_createClass$1(function Point(x, y) {
  _classCallCheck$1(this, Point);
  this.x = x;
  this.y = y;
});
Point.distance = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2), Math.pow(y2 - y1, 2));
};
var Rectangle = /*#__PURE__*/function () {
  function Rectangle() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    _classCallCheck$1(this, Rectangle);
    args = function () {
      if (args.length == 4) return args;
      if (args.length == 2) return [0, 0].concat(_toConsumableArray$1(args));
      if (args.length == 1) {
        if (Array.isArray(args[0])) return args[0];
        if (_typeof$1(args[0]) === "object") {
          var _args$ = args[0],
            x = _args$.x,
            y = _args$.y,
            width = _args$.width,
            height = _args$.height,
            left = _args$.left,
            right = _args$.right,
            bottom = _args$.bottom,
            top = _args$.top;
          if (x == undefined) x = left;
          if (y == undefined) y = top;
          if (width == undefined) width = right - left;
          if (height == undefined) height = bottom - top;
          return [x, y, width, height];
        }
      }
      if (args.length == 0) return [0, 0, 0, 0];
    }();
    this.x = +args[0] || 0;
    this.y = +args[1] || 0;
    this.width = +args[2] || 0;
    this.height = +args[3] || 0;
  }
  return _createClass$1(Rectangle, [{
    key: "left",
    get: function get() {
      return this.x;
    },
    set: function set(value) {
      var d = value - this.x;
      this.x += d;
      this.width -= d;
    }
  }, {
    key: "top",
    get: function get() {
      return this.y;
    },
    set: function set(value) {
      var d = value - this.y;
      this.y += d;
      this.height -= d;
    }
  }, {
    key: "right",
    get: function get() {
      return this.x + this.width;
    },
    set: function set(value) {
      this.width += value - this.right;
    }
  }, {
    key: "bottom",
    get: function get() {
      return this.y + this.height;
    },
    set: function set(value) {
      this.height += value - this.bottom;
    }
  }, {
    key: "center",
    get: function get() {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
    }
  }, {
    key: "contains",
    value: function contains(obj) {
      if (!obj.width && !obj.height) return obj.x > this.left && obj.x < this.right && obj.y > this.top && obj.y < this.bottom;
      return obj.x > this.left && obj.x + obj.width < this.right && obj.y > this.top && obj.y + obj.height < this.bottom;
    }
  }, {
    key: "intersects",
    value: function intersects(obj) {
      return obj.x + obj.width > this.left && obj.x < this.right && obj.y + obj.height > this.top && obj.y < this.bottom;
    }
  }, {
    key: "union",
    value: function union(obj) {
      var x = Math.min(obj.x, this.x);
      var y = Math.min(obj.y, this.y);
      var right = Math.max(obj.x + (obj.width || 0), this.right);
      var bottom = Math.max(obj.y + (obj.height || 0), this.bottom);
      return new Rectangle(x, y, right - x, bottom - y);
    }
  }, {
    key: "intersection",
    value: function intersection(obj) {
      var x = Math.max(obj.x, this.x);
      var y = Math.max(obj.y, this.y);
      var right = Math.min(obj.x + obj.width, this.right);
      var bottom = Math.min(obj.y + obj.height, this.bottom);
      return new Rectangle(x, y, right - x, bottom - y);
    }
  }, {
    key: "scale",
    value: function scale(x, y) {
      if (y === undefined) y = x;
      this.x *= x;
      this.y *= y;
      this.width *= x;
      this.height *= y;
      return this;
    }
  }, {
    key: "expand",
    value: function expand(x, y) {
      if (y === undefined) y = x;
      this.x -= x / 2;
      this.y -= y / 2;
      this.width += x;
      this.height += y;
      return this;
    }
  }, {
    key: "fix",
    value: function fix() {
      if (this.width < 0) {
        this.x += this.width;
        this.width *= -1;
      }
      if (this.height < 0) {
        this.y += this.height;
        this.height *= -1;
      }
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Rectangle(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "equals",
    value: function equals(obj) {
      try {
        return this.x === obj.x && this.y === obj.y && this.width === obj.width && this.height === obj.height;
      } catch (_unused) {
        return false;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[Rectangle x:".concat(this.x, " y:").concat(this.y, " width:").concat(this.width, " height:").concat(this.height, "]");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  }]);
}();
Rectangle.union = function () {
  for (var _len4 = arguments.length, rects = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    rects[_key4] = arguments[_key4];
  }
  var x = Math.min.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.x;
  })));
  var y = Math.min.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.y;
  })));
  var right = Math.max.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.x + r.width;
  })));
  var bottom = Math.max.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.y + r.height;
  })));
  return new Rectangle(x, y, right - x, bottom - y);
};
Rectangle.intersection = function () {
  for (var _len5 = arguments.length, rects = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    rects[_key5] = arguments[_key5];
  }
  var x = Math.max.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.x;
  })));
  var y = Math.max.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.y;
  })));
  var right = Math.min.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.x + r.width;
  })));
  var bottom = Math.min.apply(Math, _toConsumableArray$1(rects.map(function (r) {
    return r.y + r.height;
  })));
  return new Rectangle(x, y, right - x, bottom - y);
};
var TimeoutError = /*#__PURE__*/function (_Error2) {
  function TimeoutError(message) {
    var _this7;
    _classCallCheck$1(this, TimeoutError);
    _this7 = _callSuper$1(this, TimeoutError, [message]);
    _this7.name = "TimeoutError";
    return _this7;
  }
  _inherits$1(TimeoutError, _Error2);
  return _createClass$1(TimeoutError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
var Color = /*#__PURE__*/function () {
  function Color() {
    for (var _len6 = arguments.length, components = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      components[_key6] = arguments[_key6];
    }
    _classCallCheck$1(this, Color);
    this._r = 0;
    this._g = 0;
    this._b = 0;
    this._h = 0;
    this._s = 0;
    this._l = 0;
    this._a = 1.0;
    if (components.length == 1) {
      var c = components[0];
      if (Array.isArray(c)) {
        s;
        components = _toConsumableArray$1(c);
      } else if (_typeof$1(c) === "object") {
        components = [c.r || c.red || 0, c.g || c.green || 0, c.b || c.blue || 0, c.a || c.alpha || 1];
      } else if (typeof c === "string") {
        if (c.charAt(0) === "#") c = c.slice(1);else if (c.substring(0, 2) === "0x") c = c.slice(2);
        if (c.length < 6) components = c.split("").map(function (a) {
          return a + a;
        });else components = c.match(/.{1,2}/g);
      }
    }
    components = components.map(function (c) {
      if (typeof c === "string" && c.match(/^[0-9a-f]{2}$/)) return parseInt(c, 16);
      return +c;
    });
    this.from_rgba.apply(this, _toConsumableArray$1(components));
  }
  return _createClass$1(Color, [{
    key: "r",
    get: function get() {
      return this._r;
    }
  }, {
    key: "g",
    get: function get() {
      return this._g;
    }
  }, {
    key: "b",
    get: function get() {
      return this._b;
    }
  }, {
    key: "h",
    get: function get() {
      return this._h;
    }
  }, {
    key: "s",
    get: function get() {
      return this._s;
    }
  }, {
    key: "l",
    get: function get() {
      return this._l;
    }
  }, {
    key: "a",
    get: function get() {
      return this._a;
    }
  }, {
    key: "from_hsl",
    value: function from_hsl() {
      var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return this.from_hsla(h, s, l, 1);
    }
  }, {
    key: "from_hsla",
    value: function from_hsla() {
      var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      this._h = h = clamp(h, 0, 1);
      this._s = s = clamp(s, 0, 1);
      this._l = l = clamp(l, 0, 1);
      this._a = a = clamp(a, 0, 1);
      var r, g, b;
      if (s == 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Color.hue2rgb(p, q, h + 1 / 3);
        g = Color.hue2rgb(p, q, h);
        b = Color.hue2rgb(p, q, h - 1 / 3);
      }
      this._r = Math.round(r * 255);
      this._g = Math.round(g * 255);
      this._b = Math.round(b * 255);
      return this;
    }
  }, {
    key: "from_rgb",
    value: function from_rgb() {
      var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return this.from_rgba(r, g, b, 1);
    }
  }, {
    key: "from_rgba",
    value: function from_rgba() {
      var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      this._r = r = Math.round(clamp(r, 0, 255));
      this._g = g = Math.round(clamp(g, 0, 255));
      this._b = b = Math.round(clamp(b, 0, 255));
      this._a = a = Math.round(clamp(a, 0, 1));
      r /= 255;
      g /= 255;
      b /= 255;
      var cMax = Math.max(r, g, b);
      var cMin = Math.min(r, g, b);
      var delta = cMax - cMin;
      var l = (cMax + cMin) / 2;
      var h = 0;
      var s = 0;
      if (delta == 0) h = 0;else if (cMax == r) h = 60 * ((g - b) / delta % 6);else if (cMax == g) h = 60 * ((b - r) / delta + 2);else h = 60 * ((r - g) / delta + 4);
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      this._h = h;
      this._s = s;
      this._l = l;
      return this;
    }
  }, {
    key: "rgb_mix",
    value: function rgb_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      return this.rgba_mix(c, m);
    }
  }, {
    key: "rgba_mix",
    value: function rgba_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      c = Color.from(c);
      return new Color(lerp(this._r, c.r, m), lerp(this._g, c.g, m), lerp(this._b, c.b, m), lerp(this._a, c.a, m));
    }
  }, {
    key: "hsl_mix",
    value: function hsl_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      return this.hsla_mix(c, m);
    }
  }, {
    key: "hsla_mix",
    value: function hsla_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      c = Color.from(c);
      return new Color(lerp(this._h, c.h, m), lerp(this._s, c.s, m), lerp(this._l, c.l, m), lerp(this._a, c.a, m));
    }
  }, {
    key: "to_hsl_array",
    value: function to_hsl_array() {
      return [this._h, this._s, this._l];
    }
  }, {
    key: "to_rgb_array",
    value: function to_rgb_array() {
      return [this._r, this._g, this._b];
    }
  }, {
    key: "to_hsla_array",
    value: function to_hsla_array() {
      return [this._h, this._s, this._l, this._a];
    }
  }, {
    key: "to_rgba_array",
    value: function to_rgba_array() {
      return [this._r, this._g, this._b, this._a];
    }
  }, {
    key: "to_hsl_string",
    value: function to_hsl_string() {
      return "hsl(".concat(this._h, ", ").concat(this._s, ", ").concat(this._l, ")");
    }
  }, {
    key: "to_rgb_string",
    value: function to_rgb_string() {
      return "rgb(".concat(this._r, ", ").concat(this._g, ", ").concat(this._b, ")");
    }
  }, {
    key: "to_hsla_string",
    value: function to_hsla_string() {
      return "hsla(".concat(this._h, ", ").concat(this._s, ", ").concat(this._l, ", ").concat(this._a, ")");
    }
  }, {
    key: "to_rgba_string",
    value: function to_rgba_string() {
      return "rgba(".concat(this._r, ", ").concat(this._g, ", ").concat(this._b, ", ").concat(this._a, ")");
    }
  }, {
    key: "to_rgb_hex",
    value: function to_rgb_hex() {
      return "#".concat(this._r.toString(16)).concat(this._g.toString(16)).concat(this._b.toString(16));
    }
  }, {
    key: "to_rgba_hex",
    value: function to_rgba_hex() {
      return "#".concat(this._r.toString(16)).concat(this._g.toString(16)).concat(this._b.toString(16)).concat(this._a.toString(16));
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.to_rgba_string();
    }
  }, {
    key: "copy",
    value: function copy() {
      var c = new Color();
      c._r = this._r;
      c._g = this._g;
      c._b = this._b;
      c._h = this._h;
      c._s = this._s;
      c._l = this._l;
      c._a = this._a;
      return c;
    }
  }]);
}();
Color.from = function () {
  for (var _len7 = arguments.length, components = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    components[_key7] = arguments[_key7];
  }
  if (components.length === 1 && components[0] instanceof Color) {
    return components[0];
  }
  return _construct(Color, components);
};
Color.mix = function (c1, c2) {
  var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
  return Color.from(c1).mix(c2, m);
};
Color.hue_to_rgb = function (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};
function is_valid_url(str) {
  return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i.test(str);
}
function is_valid_rtmp_url(str) {
  return /^rtmps?\:\/\//i.test(str);
}
function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var timeout, previous, args, result, context;
  var _later = function later() {
    var passed = Date.now() - previous;
    if (wait > passed) {
      timeout = setTimeout(_later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      if (!timeout) args = context = null;
    }
  };
  var debounced = function debounced() {
    context = this;
    for (var _len10 = arguments.length, p = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      p[_key10] = arguments[_key10];
    }
    args = p;
    previous = Date.now();
    if (!timeout) {
      timeout = setTimeout(_later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };
  return debounced;
}
function promise_timeout(promise) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
  if (typeof promise === "function") promise = new Promise(promise);
  if (!ms || ms <= 0) return promise;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new TimeoutError("Timed out in ".concat(ms, "ms.")));
    }, ms);
    promise.then(resolve)["catch"](reject);
  });
}
function timespan_str_to_seconds(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  return timespan_str_to_ms(str, format) / 1000;
}
// will also handle decimal points (milliseconds)
function timespan_str_to_ms(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  var multiply = 1;
  if (str.startsWith("-")) {
    multiply = -1;
    str = str.slice(1);
  }
  var parts = String(str).split(/:/);
  var format_parts = format.split(/:/);
  if (format_parts.length > parts.length) format_parts = format_parts.slice(-parts.length); // so if str = "10:00" and format = "hh:mm:ss", the assumed format will be "mm:ss"
  else parts = parts.slice(-format_parts.length);
  var ms = 0;
  for (var i = 0; i < parts.length; i++) {
    var v = parseFloat(parts[i]);
    var f = format_parts[i][0];
    if (!Number.isFinite(v)) v = 0; // handles NaN & Infinity
    if (f == "d") ms += v * 24 * 60 * 60 * 1000;else if (f == "h") ms += v * 60 * 60 * 1000;else if (f == "m") ms += v * 60 * 1000;else if (f == "s") ms += v * 1000;
  }
  return ms * multiply;
}
// ms
function ms_to_timespan_str(num) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  var negative = num < 0;
  num = Math.abs(+num) || 0;
  var format_parts = format.split(/([^a-z])/i).filter(function (m) {
    return m;
  });
  var parts = [];
  for (var i = 0; i < format_parts.length; i++) {
    var p = format_parts[i];
    var divider = null;
    if (p.startsWith("d")) divider = 24 * 60 * 60 * 1000;else if (p.startsWith("h")) divider = 60 * 60 * 1000;else if (p.startsWith("m")) divider = 60 * 1000;else if (p.startsWith("s")) divider = 1000;else if (p.startsWith("S")) divider = 1;else if (parts.length == 0) continue;
    if (p == "?") {
      if (parts[parts.length - 1] == 0) parts.pop();
      continue;
    }
    if (divider) {
      var v = Math.floor(num / divider);
      p = v.toString().padStart(p.length, "0");
      num -= v * divider;
    }
    parts.push(p);
  }
  return (negative ? "-" : "") + parts.join("");
}
function array_remove(arr, item) {
  var index = arr.indexOf(item);
  if (index === -1) return false;
  arr.splice(index, 1);
  return true;
}
function random_string(length) {
  var chars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = new Array(length),
    num_chars = chars.length;
  for (var i = length; i > 0; --i) result[i] = chars[Math.floor(Math.random() * num_chars)];
  return result.join("");
}
function all_equal(array) {
  if (array.length <= 1) return true;
  for (var i = 1; i < array.length; i++) {
    if (array[0] !== array[i]) return false;
  }
  return true;
}
/** @template T1 @param {function():T1} cb @param {*} [default_value] @returns {T1} */
function _try(cb) {
  var default_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  try {
    return cb();
  } catch (_unused4) {
    return default_value;
  }
}
function clear(obj) {
  if (Array.isArray(obj)) {
    obj.splice(0, obj.length);
  } else if (_typeof$1(obj) === "object") {
    for (var _i8 = 0, _Object$keys4 = Object.keys(obj); _i8 < _Object$keys4.length; _i8++) {
      var k = _Object$keys4[_i8];
      delete obj[k];
    }
  }
}
function round_to_factor(num) {
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
  return Math.round(num / f) * f;
}
function clamp(a) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return Math.min(max, Math.max(min, a));
}
function lerp(x, y, a) {
  return x * (1 - a) + y * a;
}
function split_datetime(date) {
  var apply_timezone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (date) {
    var date = +new Date(date);
    if (apply_timezone) date += -(+new Date(date).getTimezoneOffset() * 60 * 1000);
    var parts = new Date(date).toISOString().slice(0, -1).split("T");
    if (parts[0][0] == "+") parts[0] = parts[0].slice(1);
    return parts;
  }(date);
}
function join_datetime(parts) {
  var apply_timezone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var date = +new Date("".concat(parts.join(" "), "Z"));
  if (apply_timezone) date += +new Date(date).getTimezoneOffset() * 60 * 1000;
  return new Date(date);
}
function get_property_descriptor(obj, property) {
  while (obj) {
    var d = Object.getOwnPropertyDescriptor(obj, property);
    if (d) return d;
    obj = Object.getPrototypeOf(obj);
  }
  return null;
}
/** @template T @param {T} obj @param {Function(any):any} replacer @return {T} */
function deep_copy(obj, replacer) {
  if (_typeof$1(obj) !== 'object' || obj === null) return obj;
  return JSON.parse(JSON.stringify(obj));
}
function get(fn_this, fn_path) {
  // if (typeof fn_path === "string") fn_path = fn_path.split(/\./);
  if (!Array.isArray(fn_path)) fn_path = [fn_path];
  var fn_ref = fn_this;
  try {
    var _iterator23 = _createForOfIteratorHelper$1(fn_path),
      _step23;
    try {
      for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
        var fn_part = _step23.value;
        fn_this = fn_ref;
        var descriptor = get_property_descriptor(fn_ref, fn_part);
        if (descriptor && descriptor.get) fn_ref = descriptor.get.call(fn_this);else fn_ref = fn_ref[fn_part];
        // fn_ref = descriptor ? (descriptor.get ? descriptor.get.call(fn_this) : descriptor.value) : undefined;
      }
    } catch (err) {
      _iterator23.e(err);
    } finally {
      _iterator23.f();
    }
  } catch (_unused5) {
    throw new RefException("".concat(fn_this, " -> ").concat(fn_path));
  }
  return fn_ref;
}
function nearest(num) {
  var minDiff = Number.MAX_VALUE;
  for (var _len15 = arguments.length, values = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
    values[_key15 - 1] = arguments[_key15];
  }
  for (var _i14 = 0, _values = values; _i14 < _values.length; _i14++) {
    var val = _values[_i14];
    var m = Math.abs(num - values[i]);
    if (m < minDiff) {
      minDiff = m;
      curr = val;
    }
  }
  return curr;
}

var _marked = /*#__PURE__*/_regeneratorRuntime().mark(find);
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _superPropGet(t, e, o, r) { var p = _get(_getPrototypeOf(t.prototype ), e, o); return "function" == typeof p ? function (t) { return p.apply(o, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var _temp_div = document.createElement('div');
var _div2 = document.createElement('div');
var $ = function $(html) {
  var elems = render_html(html);
  if (!elems) return null;
  return Array.isArray(elems) ? elems : [elems];
};
var textarea_input_events = ["input", "propertychange", "paste"];
var entity_table = {
  34: 'quot',
  38: 'amp',
  39: 'apos',
  60: 'lt',
  62: 'gt',
  160: 'nbsp',
  161: 'iexcl',
  162: 'cent',
  163: 'pound',
  164: 'curren',
  165: 'yen',
  166: 'brvbar',
  167: 'sect',
  168: 'uml',
  169: 'copy',
  170: 'ordf',
  171: 'laquo',
  172: 'not',
  173: 'shy',
  174: 'reg',
  175: 'macr',
  176: 'deg',
  177: 'plusmn',
  178: 'sup2',
  179: 'sup3',
  180: 'acute',
  181: 'micro',
  182: 'para',
  183: 'middot',
  184: 'cedil',
  185: 'sup1',
  186: 'ordm',
  187: 'raquo',
  188: 'frac14',
  189: 'frac12',
  190: 'frac34',
  191: 'iquest',
  192: 'Agrave',
  193: 'Aacute',
  194: 'Acirc',
  195: 'Atilde',
  196: 'Auml',
  197: 'Aring',
  198: 'AElig',
  199: 'Ccedil',
  200: 'Egrave',
  201: 'Eacute',
  202: 'Ecirc',
  203: 'Euml',
  204: 'Igrave',
  205: 'Iacute',
  206: 'Icirc',
  207: 'Iuml',
  208: 'ETH',
  209: 'Ntilde',
  210: 'Ograve',
  211: 'Oacute',
  212: 'Ocirc',
  213: 'Otilde',
  214: 'Ouml',
  215: 'times',
  216: 'Oslash',
  217: 'Ugrave',
  218: 'Uacute',
  219: 'Ucirc',
  220: 'Uuml',
  221: 'Yacute',
  222: 'THORN',
  223: 'szlig',
  224: 'agrave',
  225: 'aacute',
  226: 'acirc',
  227: 'atilde',
  228: 'auml',
  229: 'aring',
  230: 'aelig',
  231: 'ccedil',
  232: 'egrave',
  233: 'eacute',
  234: 'ecirc',
  235: 'euml',
  236: 'igrave',
  237: 'iacute',
  238: 'icirc',
  239: 'iuml',
  240: 'eth',
  241: 'ntilde',
  242: 'ograve',
  243: 'oacute',
  244: 'ocirc',
  245: 'otilde',
  246: 'ouml',
  247: 'divide',
  248: 'oslash',
  249: 'ugrave',
  250: 'uacute',
  251: 'ucirc',
  252: 'uuml',
  253: 'yacute',
  254: 'thorn',
  255: 'yuml',
  402: 'fnof',
  913: 'Alpha',
  914: 'Beta',
  915: 'Gamma',
  916: 'Delta',
  917: 'Epsilon',
  918: 'Zeta',
  919: 'Eta',
  920: 'Theta',
  921: 'Iota',
  922: 'Kappa',
  923: 'Lambda',
  924: 'Mu',
  925: 'Nu',
  926: 'Xi',
  927: 'Omicron',
  928: 'Pi',
  929: 'Rho',
  931: 'Sigma',
  932: 'Tau',
  933: 'Upsilon',
  934: 'Phi',
  935: 'Chi',
  936: 'Psi',
  937: 'Omega',
  945: 'alpha',
  946: 'beta',
  947: 'gamma',
  948: 'delta',
  949: 'epsilon',
  950: 'zeta',
  951: 'eta',
  952: 'theta',
  953: 'iota',
  954: 'kappa',
  955: 'lambda',
  956: 'mu',
  957: 'nu',
  958: 'xi',
  959: 'omicron',
  960: 'pi',
  961: 'rho',
  962: 'sigmaf',
  963: 'sigma',
  964: 'tau',
  965: 'upsilon',
  966: 'phi',
  967: 'chi',
  968: 'psi',
  969: 'omega',
  977: 'thetasym',
  978: 'upsih',
  982: 'piv',
  8226: 'bull',
  8230: 'hellip',
  8242: 'prime',
  8243: 'Prime',
  8254: 'oline',
  8260: 'frasl',
  8472: 'weierp',
  8465: 'image',
  8476: 'real',
  8482: 'trade',
  8501: 'alefsym',
  8592: 'larr',
  8593: 'uarr',
  8594: 'rarr',
  8595: 'darr',
  8596: 'harr',
  8629: 'crarr',
  8656: 'lArr',
  8657: 'uArr',
  8658: 'rArr',
  8659: 'dArr',
  8660: 'hArr',
  8704: 'forall',
  8706: 'part',
  8707: 'exist',
  8709: 'empty',
  8711: 'nabla',
  8712: 'isin',
  8713: 'notin',
  8715: 'ni',
  8719: 'prod',
  8721: 'sum',
  8722: 'minus',
  8727: 'lowast',
  8730: 'radic',
  8733: 'prop',
  8734: 'infin',
  8736: 'ang',
  8743: 'and',
  8744: 'or',
  8745: 'cap',
  8746: 'cup',
  8747: 'int',
  8756: 'there4',
  8764: 'sim',
  8773: 'cong',
  8776: 'asymp',
  8800: 'ne',
  8801: 'equiv',
  8804: 'le',
  8805: 'ge',
  8834: 'sub',
  8835: 'sup',
  8836: 'nsub',
  8838: 'sube',
  8839: 'supe',
  8853: 'oplus',
  8855: 'otimes',
  8869: 'perp',
  8901: 'sdot',
  8968: 'lceil',
  8969: 'rceil',
  8970: 'lfloor',
  8971: 'rfloor',
  9001: 'lang',
  9002: 'rang',
  9674: 'loz',
  9824: 'spades',
  9827: 'clubs',
  9829: 'hearts',
  9830: 'diams',
  338: 'OElig',
  339: 'oelig',
  352: 'Scaron',
  353: 'scaron',
  376: 'Yuml',
  710: 'circ',
  732: 'tilde',
  8194: 'ensp',
  8195: 'emsp',
  8201: 'thinsp',
  8204: 'zwnj',
  8205: 'zwj',
  8206: 'lrm',
  8207: 'rlm',
  8211: 'ndash',
  8212: 'mdash',
  8216: 'lsquo',
  8217: 'rsquo',
  8218: 'sbquo',
  8220: 'ldquo',
  8221: 'rdquo',
  8222: 'bdquo',
  8224: 'dagger',
  8225: 'Dagger',
  8240: 'permil',
  8249: 'lsaquo',
  8250: 'rsaquo',
  8364: 'euro'
};

/* new MutationObserver(mutations => {
    Array.from(mutations).forEach(mutation => {
        Array.from(mutation.addedNodes).forEach(node => {
            if (node.matches("textarea[autosize]")) new AutoSizeController(node);
        });
        Array.from(mutation.removedNodes).forEach(node => {
            if (node.matches("textarea[autosize]")) node.__autosize__.destroy()
        });
    });
}).observe(document.body, { childList: true }); */
var TouchListener = /*#__PURE__*/function (_utils$EventEmitter) {
  function TouchListener(elem, user_settings) {
    var _this;
    _classCallCheck(this, TouchListener);
    _this = _callSuper(this, TouchListener);
    var settings = {
      mode: "normal",
      start: function start(e) {},
      move: function move(e) {},
      end: function end(e) {}
    };
    elem.style["touch-actions"] = "none";
    Object.assign(settings, user_settings);
    _this.elem = elem;
    var end_target = window.document;
    var start_events = ["pointerdown"];
    var move_events = ["pointermove"];
    var end_events = ["pointerup"];
    if (settings.mode == "hover") {
      start_events = ["pointerover"];
      end_events = ["pointerout"];
      end_target = _this.elem;
    }
    var _on_touch_start = function _on_touch_start(e) {
      // VERY NECESSARY!
      e.preventDefault();
    };
    var _on_start = function _on_start(e) {
      if (e.pointerId && settings.mode != "hover") {
        if (e.button != 0) return;
        _this.elem.setPointerCapture(e.pointerId);
        _this.elem.addEventListener("lostpointercapture", _on_end);
      }
      e.stopPropagation();
      e.preventDefault();
      settings.start(e);
      move_events.forEach(function (et) {
        return window.addEventListener(et, _on_move);
      });
      end_events.forEach(function (et) {
        return end_target.addEventListener(et, _on_end);
      });
    };
    var _on_move = function _on_move(e) {
      // console.log(e.type, e);
      settings.move(e);
    };
    var _on_end = function _on_end(e) {
      // console.log(e.type, e);
      settings.end(e);
      cleanup();
    };
    var cleanup = function cleanup() {
      _this.elem.removeEventListener("lostpointercapture", _on_end);
      move_events.forEach(function (et) {
        return window.removeEventListener(et, _on_move);
      });
      end_events.forEach(function (et) {
        return end_target.removeEventListener(et, _on_end);
      });
    };
    _this._destroy = function () {
      _this.elem.removeEventListener("touchstart", _on_touch_start);
      start_events.forEach(function (et) {
        return _this.elem.removeEventListener(et, _on_start);
      });
      cleanup();
    };
    start_events.forEach(function (et) {
      return _this.elem.addEventListener(et, _on_start);
    });
    _this.elem.addEventListener("touchstart", _on_touch_start);
    return _this;
  }
  _inherits(TouchListener, _utils$EventEmitter);
  return _createClass(TouchListener, [{
    key: "destroy",
    value: function destroy() {
      this._destroy();
    }
  }]);
}(EventEmitter);
var AutoSizeController = /*#__PURE__*/function (_utils$EventEmitter2) {
  function AutoSizeController(elem, min_rows) {
    var _this2;
    var auto_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    _classCallCheck(this, AutoSizeController);
    _this2 = _callSuper(this, AutoSizeController);
    _this2.elem = elem;
    _this2.min_rows = min_rows || 1;
    _this2.on_change = function (e) {
      _this2.update();
    };
    _this2.debounced_update = debounce(function () {
      return _this2.update();
    }, 50);
    textarea_input_events.forEach(function (ev) {
      return _this2.elem.addEventListener(ev, _this2.on_change);
    });
    if (auto_update) {
      window.addEventListener("resize", _this2.debounced_update);
      var fs;
      _this2.check_interval = setInterval(function () {
        var new_fs = getComputedStyle(elem).getPropertyValue("font-size");
        if (new_fs !== fs) _this2.update();
        fs = new_fs;
      }, 200);
    }
    elem.__autosize__ = _this2;
    _this2.update();
    return _this2;
  }
  _inherits(AutoSizeController, _utils$EventEmitter2);
  return _createClass(AutoSizeController, [{
    key: "update",
    value: function update() {
      this.emit("pre-update");
      autosize(this.elem, this.min_rows);
      this.emit("post_update");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;
      delete elem.__autosize__;
      clearInterval(this.check_interval);
      this.input_events.forEach(function (ev) {
        return _this3.elem.removeEventListener(ev, _this3.on_change);
      });
      window.removeEventListener("resize", this.debounced_update);
    }
  }]);
}(EventEmitter); // var LocalStorageDeleted = Symbol("LocalStorageDeleted");
var LocalStorageBucket = /*#__PURE__*/function (_utils$EventEmitter3) {
  function LocalStorageBucket(name, defaults) {
    var _this4;
    _classCallCheck(this, LocalStorageBucket);
    _this4 = _callSuper(this, LocalStorageBucket);
    _this4.save = debounce(_this4._save, 0);
    _this4._data = {};
    _this4._name = name;
    _this4._defaults = defaults ? deep_copy(defaults) : {};
    _this4._interval = setInterval(function () {
      // in case it is altered in another window.
      var data_string = localStorage.getItem(_this4._name);
      if (_this4._last_data_string !== data_string) {
        var data = JSON.parse(data_string);
        for (var k in _this4._defaults) {
          var v = data && k in data ? data[k] : _this4._defaults[k];
          _this4.set(k, v);
        }
      }
    }, 1000);
    return _this4;
  }
  _inherits(LocalStorageBucket, _utils$EventEmitter3);
  return _createClass(LocalStorageBucket, [{
    key: "data",
    get: function get() {
      return Object.assign({}, this.defaults, this._data);
    }
  }, {
    key: "keys",
    get: function get() {
      return Object.keys(this.data);
    }
  }, {
    key: "defaults",
    get: function get() {
      return this._defaults;
    }
  }, {
    key: "get",
    value: function get(k) {
      return this._data[k] == null ? this._defaults[k] : this._data[k];
    }
  }, {
    key: "set",
    value: function set(k, value) {
      var hash = JSON.stringify(value);
      if (hash === JSON.stringify(this._data[k])) return;
      if (k in this._defaults && hash === JSON.stringify(this._defaults[k])) {
        delete this._data[k];
      } else {
        this._data[k] = deep_copy(value);
      }
      this._trigger_change(k);
      this.save();
    }
  }, {
    key: "delete",
    value: function _delete(k) {
      if (this._data[k] === undefined) return;
      delete this._data[k];
      this._trigger_change(k);
      this.save();
    }
  }, {
    key: "toggle",
    value: function toggle(k) {
      this.set(k, !this.get(k));
    }
  }, {
    key: "load",
    value: function load() {
      var new_values = {};
      try {
        Object.assign(new_values, JSON.parse(localStorage.getItem(this._name)));
      } catch (_unused) {}
      var old_values = this.data;
      this._data = new_values;
      new_values = this.data;
      for (var k in new_values) {
        if (new_values[k] !== old_values[k] || !this._first) this._trigger_change(k);
      }
      for (var k in old_values) {
        if (!(k in new_values)) this._trigger_change(k);
      }
      this._first = true;
      this.emit("load");
    }
  }, {
    key: "_trigger_change",
    value: function _trigger_change(k) {
      this.emit("change", {
        name: k,
        value: this.get(k)
      });
    }
  }, {
    key: "_save",
    value: function _save() {
      this._last_data_string = JSON.stringify(this._data);
      localStorage.setItem(this._name, this._last_data_string);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      clearInterval(this._interval);
    }
  }]);
}(EventEmitter);
var WebSocket2 = /*#__PURE__*/function (_utils$EventEmitter4) {
  function WebSocket2(url) {
    var _this5;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, WebSocket2);
    _this5 = _callSuper(this, WebSocket2);
    _this5.url = url;
    _this5.options = Object.assign({
      auto_reconnect: true,
      auto_reconnect_interval: 1000
    }, options);
    _this5._init_websocket();
    return _this5;
  }
  _inherits(WebSocket2, _utils$EventEmitter4);
  return _createClass(WebSocket2, [{
    key: "requests",
    get: function get() {
      return this._requests;
    }
  }, {
    key: "ready_state",
    get: function get() {
      return this.ws.readyState;
    }
  }, {
    key: "ready_promise",
    get: function get() {
      var _this6 = this;
      return this.ws.readyState === WebSocket.OPEN ? Promise.resolve(true) : new Promise(function (resolve) {
        return _this6.once("open", resolve);
      });
    }
  }, {
    key: "request",
    value: function request(data, timeout) {
      var _this7 = this;
      return promise_timeout(new Promise(function (resolve, reject) {
        _this7._requests++;
        _this7._request_ids[_this7._requests] = function (response) {
          if (response.error) reject(response.error.message);else resolve(response.result);
        };
        _this7.send(Object.assign({
          __id__: _this7._requests
        }, data));
      }), timeout);
    }
  }, {
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.ready_promise;
            case 2:
              if (data instanceof ArrayBuffer || data instanceof Blob) {
                this.ws.send(data);
              } else {
                this.ws.send(JSON.stringify(data));
              }
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "_init_websocket",
    value: function _init_websocket() {
      var _this8 = this;
      this._request_ids = {};
      this._requests = 0;
      var url = this.url;
      var protocols = this.protocols;
      if (typeof url === "function") url = url();
      if (typeof protocols === "function") protocols = protocols();
      this.ws = new WebSocket(url, protocols);
      this.emit("connecting");
      var try_reconnect = function try_reconnect() {
        if (!_this8.options.auto_reconnect) return;
        clearTimeout(_this8._reconnect_timeout);
        _this8._reconnect_timeout = setTimeout(function () {
          _this8._init_websocket();
        }, _this8.options.auto_reconnect_interval);
      };
      this.ws.addEventListener("open", function (e) {
        clearTimeout(_this8._reconnect_timeout);
        _this8.emit("open", e);
        console.log("Connection open.");
      });
      this.ws.addEventListener("message", function (e) {
        _this8.emit("message", e);
        if (e.data === "ping") {
          _this8.ws.send("pong");
          return;
        }
        var data;
        try {
          data = JSON.parse(e.data);
        } catch (ex) {
          console.error(ex);
          return;
        }
        if (data && data.__id__ !== undefined) {
          var cb = _this8._request_ids[data.__id__];
          delete _this8._request_ids[data.__id__];
          cb(data);
        }
        _this8.emit("data", data);
        // this event always runs before cb() promise as promises resolve later in another (pseudo) thread.
        // setTimeout(()=>this.emit("data", data), 0);
      });
      this.ws.addEventListener("close", function (e) {
        _this8.emit("close", e);
        if (e.code == 1014) {
          // bad gateway, don't bother.
          console.error("Connection refused: Bad gateway.");
        } else {
          try_reconnect();
        }
      });
      this.ws.addEventListener("error", function (e) {
        _this8.emit("error", e);
      });
    }
  }]);
}(EventEmitter); // depends on tippy js
var UI = /*#__PURE__*/function (_utils$EventEmitter5) {
  // get_children() { return UI.find(this.elem, UI, false); }
  // get_descendents() { return UI.find(this.elem, UI, true); }
  // get_parents() { return UI.parents(this.elem); }

  function UI(elem, settings) {
    var _this9;
    _classCallCheck(this, UI);
    _this9 = _callSuper(this, UI);
    /** @type {Set<UI>} */
    _defineProperty(_this9, "_children", new Set());
    /** @type {UI} */
    _defineProperty(_this9, "_parent", void 0);
    _this9.__UID__ = ++UI.id;
    if (typeof elem === "string") elem = $(elem)[0];
    if (elem instanceof Document) elem = elem.body;
    if (!(elem instanceof Element) && !settings) {
      settings = elem;
      elem = null;
    }
    if (!elem) elem = document.createElement('div');
    /** @type {HTMLElement} */
    _this9.elem = elem;
    _this9.elem[UI.expando] = _this9;
    _this9.elem.classList.add(UI.pre);
    _this9.settings = Object.assign({}, settings);
    if ("class" in _this9.settings) {
      var _this9$elem$classList;
      var classes = _this9.get_setting("class");
      if (typeof classes === "string") classes = classes.split(/\s+/);
      (_this9$elem$classList = _this9.elem.classList).add.apply(_this9$elem$classList, _toConsumableArray(classes));
    }

    // this.__update_display();

    // this.update();
    _this9.update_next_frame = debounce_next_frame(function () {
      _this9.update();
    });
    // this.update_next_frame();

    if (_this9.elem.isConnected) {
      _this9.root.register(_this9);
    }
    _this9.init();
    _this9.get_setting("init");
    return _this9;
  }
  _inherits(UI, _utils$EventEmitter5);
  return _createClass(UI, [{
    key: "disabled",
    get: function get() {
      // var parent = this.parent;
      var disabled = !!this.get_setting("disabled");
      return disabled;
    },
    set: function set(value) {
      if (this.settings.disabled == value) return;
      this.settings.disabled = value;
      this.update_next_frame();
    }
  }, {
    key: "disabled_or_parent_disabled",
    get: function get() {
      return this.disabled || this.disabled_parent;
    }
  }, {
    key: "disabled_parent",
    get: function get() {
      var parent = this.parent;
      return parent ? parent.disabled_or_parent_disabled : false;
    }
  }, {
    key: "hidden",
    get: function get() {
      return this.get_setting("hidden");
    },
    set: function set(value) {
      if (this.settings.hidden == value) return;
      this.settings.hidden = value;
      this.update_next_frame();
      // this.debounced_update();
    }
  }, {
    key: "root",
    get: function get() {
      return this.get_closest(UI.Root);
    }
  }, {
    key: "visible",
    get: function get() {
      return is_visible(this.elem);
    } // not the opposite of hidden
  }, {
    key: "children",
    get: function get() {
      return _toConsumableArray(this.get_children());
    }
  }, {
    key: "descendents",
    get: function get() {
      return _toConsumableArray(this.get_descendents());
    }
  }, {
    key: "parents",
    get: function get() {
      return _toConsumableArray(this.get_parents());
    }
  }, {
    key: "parent",
    get: function get() {
      return this._parent;
    }
  }, {
    key: "id",
    get: function get() {
      return this.__UID__;
    }
  }, {
    key: "style",
    get: function get() {
      return this.elem.style;
    }
  }, {
    key: "get_children",
    value: /*#__PURE__*/_regeneratorRuntime().mark(function get_children() {
      var _iterator, _step, c;
      return _regeneratorRuntime().wrap(function get_children$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(this._children);
            _context2.prev = 1;
            _iterator.s();
          case 3:
            if ((_step = _iterator.n()).done) {
              _context2.next = 9;
              break;
            }
            c = _step.value;
            _context2.next = 7;
            return c;
          case 7:
            _context2.next = 3;
            break;
          case 9:
            _context2.next = 14;
            break;
          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](1);
            _iterator.e(_context2.t0);
          case 14:
            _context2.prev = 14;
            _iterator.f();
            return _context2.finish(14);
          case 17:
          case "end":
            return _context2.stop();
        }
      }, get_children, this, [[1, 11, 14, 17]]);
    }) /** @return {Generator<UI>} */
  }, {
    key: "get_descendents",
    value:
    /*#__PURE__*/
    _regeneratorRuntime().mark(function get_descendents() {
      var _iterator2, _step2, c, _iterator3, _step3, gc;
      return _regeneratorRuntime().wrap(function get_descendents$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _iterator2 = _createForOfIteratorHelper(this._children);
            _context3.prev = 1;
            _iterator2.s();
          case 3:
            if ((_step2 = _iterator2.n()).done) {
              _context3.next = 26;
              break;
            }
            c = _step2.value;
            _context3.next = 7;
            return c;
          case 7:
            _iterator3 = _createForOfIteratorHelper(c.get_descendents());
            _context3.prev = 8;
            _iterator3.s();
          case 10:
            if ((_step3 = _iterator3.n()).done) {
              _context3.next = 16;
              break;
            }
            gc = _step3.value;
            _context3.next = 14;
            return gc;
          case 14:
            _context3.next = 10;
            break;
          case 16:
            _context3.next = 21;
            break;
          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](8);
            _iterator3.e(_context3.t0);
          case 21:
            _context3.prev = 21;
            _iterator3.f();
            return _context3.finish(21);
          case 24:
            _context3.next = 3;
            break;
          case 26:
            _context3.next = 31;
            break;
          case 28:
            _context3.prev = 28;
            _context3.t1 = _context3["catch"](1);
            _iterator2.e(_context3.t1);
          case 31:
            _context3.prev = 31;
            _iterator2.f();
            return _context3.finish(31);
          case 34:
          case "end":
            return _context3.stop();
        }
      }, get_descendents, this, [[1, 28, 31, 34], [8, 18, 21, 24]]);
    })
  }, {
    key: "get_parents",
    value: /*#__PURE__*/_regeneratorRuntime().mark(function get_parents() {
      var p;
      return _regeneratorRuntime().wrap(function get_parents$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            p = this._parent;
          case 1:
            if (!p) {
              _context4.next = 7;
              break;
            }
            _context4.next = 4;
            return p;
          case 4:
            p = p._parent;
            _context4.next = 1;
            break;
          case 7:
          case "end":
            return _context4.stop();
        }
      }, get_parents, this);
    }) /** @template [T=UI] @param {new() => T} type @returns {T} */
  }, {
    key: "get_closest",
    value: function get_closest() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : UI;
      return UI.closest(this.elem, type);
    }
  }, {
    key: "init",
    value: function init() {}
  }, {
    key: "update",
    value: function update() {
      this.emit("pre_update");
      this.__update_display();
      this.get_setting("update");
      this.emit("update");
      var _iterator4 = _createForOfIteratorHelper(this._children),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var c = _step4.value;
          c.update();
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      this.get_setting("post_update");
      this.emit("post_update");
    }
  }, {
    key: "update_settings",
    value: function update_settings(settings) {
      Object.assign(this.settings, settings);
      this.update_next_frame();
    }
  }, {
    key: "__update_display",
    value: function __update_display() {
      var _this10 = this;
      var hidden = this.hidden;
      if (hidden !== undefined) toggle_class(this.elem, "d-none", hidden);
      toggle_attribute(this.elem, "disabled", !!this.disabled_or_parent_disabled);

      /* var _class = this.class.join(" ");
      if ("class" in this.settings) {
          var c = this.get_setting("class");
          _class += " "+(typeof c === "string" ? c : c.join(" "));
      }
      if (_class !== this.__last_class) {
          this.__last_class = _class; // I hate this so much
          this.elem.className = _class;
      } */

      if ("gap" in this.settings) {
        var gap = this.get_setting("gap");
        if (typeof gap !== "string" || gap.match(/^[0-9.]+$/)) gap = "".concat(parseFloat(gap), "px");
        this.elem.style.setProperty("gap", gap);
      }
      if ("title" in this.settings) this.elem.title = this.get_setting("title");
      if ("display" in this.settings) this.elem.style.display = this.get_setting("display");
      if ("align" in this.settings) this.elem.style.alignItems = this.get_setting("align");
      if ("justify" in this.settings) this.elem.style.justifyContent = this.get_setting("justify");
      if ("flex" in this.settings) this.elem.style.flex = this.get_setting("flex");
      if ("id" in this.settings) this.elem.id = this.get_setting("id");
      if ("children" in this.settings) set_children(this.elem, this.get_setting("children"));
      if ("content" in this.settings) set_inner_html(this.elem, this.get_setting("content"));
      if ("click" in this.settings) this.elem.onclick = function (e) {
        var r = _this10.get_setting("click", e);
        _this10.emit("click");
        return r;
      };
      if ("mousedown" in this.settings) this.elem.onmousedown = function (e) {
        var r = _this10.get_setting("mousedown", e);
        _this10.emit("mousedown");
        return r;
      };
      if ("mouseup" in this.settings) this.elem.onmouseup = function (e) {
        var r = _this10.get_setting("mouseup", e);
        _this10.emit("mouseup");
        return r;
      };
      if ("dblclick" in this.settings) this.elem.ondblclick = function (e) {
        var r = _this10.get_setting("dblclick", e);
        _this10.emit("dblclick");
        return r;
      };
    }
  }, {
    key: "get_setting",
    value: function get_setting(key) {
      var setting = this.settings[key];
      if (typeof setting === "function") {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        setting = setting.apply(this, args);
      }
      return setting;
    }
  }, {
    key: "get_settings_group",
    value: function get_settings_group(key) {
      return Object.fromEntries(Object.entries(this.settings).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0];
          _ref2[1];
        return k.startsWith(key + ".");
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          k = _ref4[0],
          v = _ref4[1];
        return [k.slice(key.length + 1), v];
      }));
    }
  }, {
    key: "empty",
    value: function empty() {
      _empty(this.elem);
      return this;
    }
    /** @template T @param {T} el @returns {T} */
  }, {
    key: "append",
    value: function append(el) {
      var _this$elem;
      (_this$elem = this.elem).append.apply(_this$elem, arguments);
      return el;
    }
    /** @template T @param {T} el @returns {T} */
  }, {
    key: "prepend",
    value: function prepend(el) {
      var _this$elem2;
      (_this$elem2 = this.elem).prepend.apply(_this$elem2, arguments);
      return el;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.elem) this.elem.remove();
      this.emit("destroy");
    }
  }, {
    key: "update_layout",
    value: function update_layout(layout) {
      var _this11 = this;
      var hash = JSON.stringify(layout, function (k, p) {
        return p instanceof UI ? p.id : p;
      });
      if (hash !== this._layout_hash) {
        this._layout_hash = hash;
        this.elem.innerHTML = "";
        var _process = function process(parent, layout) {
          var _iterator5 = _createForOfIteratorHelper(layout),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var o = _step5.value;
              if (Array.isArray(o)) {
                var r = _this11.append(new UI.FlexRow({
                  "hidden": function hidden() {
                    return this.children.every(function (c) {
                      return c.hidden;
                    });
                  }
                }));
                _process(r, o);
              } else if (typeof o === "string" && o.startsWith("-")) {
                _this11.append(new UI.Separator());
              } else if (o) {
                parent.append(o);
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        };
        _process(this, layout);
      }
      this.update_next_frame();
    }

    /* clone() {
        return new this.constructor(elem, settings);
    } */
  }]);
}(EventEmitter);
UI.id = 0;
UI.pre = "uis";
UI.expando = "".concat(UI.pre, "-").concat(Date.now());
var old_append = Element.prototype.append;
var old_prepend = Element.prototype.prepend;

// UI.creating = 0;
/* UI.create = function(...args) {
    var oc = ++UI.creating;
    var ui = new this();
    if (UI.creating != oc) {
        throw new Error("Cannot initialize new UI in constructor function");
    }
    --UI.creating;
    ui.init(...args);
    return ui;
} */

/** @template [T=UI] @param {Element} elem @param {new() => T} type @param {function(UI):boolean|boolean} cb @param {boolean} include_self @returns {Generator<T>} */
UI.find = function (elem) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : UI;
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var include_self = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _iterator6, _step6, c, found, check, _iterator7, _step7, sc;
    return _regeneratorRuntime().wrap(function _callee2$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (!type) type = UI;
          if (!(include_self && elem[UI.expando] && elem[UI.expando] instanceof type)) {
            _context5.next = 4;
            break;
          }
          _context5.next = 4;
          return elem[UI.expando];
        case 4:
          if (elem.children) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return");
        case 6:
          _iterator6 = _createForOfIteratorHelper(elem.children);
          _context5.prev = 7;
          _iterator6.s();
        case 9:
          if ((_step6 = _iterator6.n()).done) {
            _context5.next = 36;
            break;
          }
          c = _step6.value;
          found = c[UI.expando] && c[UI.expando] instanceof type;
          if (!found) {
            _context5.next = 15;
            break;
          }
          _context5.next = 15;
          return c[UI.expando];
        case 15:
          check = typeof cb === "function" ? cb(c[UI.expando]) : !!cb;
          if (!(!found || check)) {
            _context5.next = 34;
            break;
          }
          _iterator7 = _createForOfIteratorHelper(UI.find(c, type, cb));
          _context5.prev = 18;
          _iterator7.s();
        case 20:
          if ((_step7 = _iterator7.n()).done) {
            _context5.next = 26;
            break;
          }
          sc = _step7.value;
          _context5.next = 24;
          return sc;
        case 24:
          _context5.next = 20;
          break;
        case 26:
          _context5.next = 31;
          break;
        case 28:
          _context5.prev = 28;
          _context5.t0 = _context5["catch"](18);
          _iterator7.e(_context5.t0);
        case 31:
          _context5.prev = 31;
          _iterator7.f();
          return _context5.finish(31);
        case 34:
          _context5.next = 9;
          break;
        case 36:
          _context5.next = 41;
          break;
        case 38:
          _context5.prev = 38;
          _context5.t1 = _context5["catch"](7);
          _iterator6.e(_context5.t1);
        case 41:
          _context5.prev = 41;
          _iterator6.f();
          return _context5.finish(41);
        case 44:
        case "end":
          return _context5.stop();
      }
    }, _callee2, null, [[7, 38, 41, 44], [18, 28, 31, 34]]);
  })();
};

// /** @template [T=UI] @param {Element} elem @param {function(UI):boolean} cb @param {boolean} recursive @param {boolean} include_self @returns {Generator<T>} */
// UI.walk = function(elem, type=UI, cb=null, include_self=false) {
//     var r;
//     if (include_self && elem[UI.expando]) {
//         r = cb(elem[UI.expando]);
//         if (r==true) yield elem[UI.expando];
//         if (r==false) return;
//     }
//     if (!elem.children) return;
//     for (var c of elem.children) {
//         if (c[UI.expando]) {
//             r = cb(c[UI.expando]);
//             if (r==true) yield c[UI.expando];
//             if (r==false) continue;
//         }
//         for (var ui of UI.walk(c, cb)) yield ui;
//     }
// }
/** @returns {Generator<UI>} */
UI.parents = function (elem) {
  var include_self = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    return _regeneratorRuntime().wrap(function _callee3$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!include_self) elem = elem.parentElement;
        case 1:
          if (!elem) {
            _context6.next = 8;
            break;
          }
          if (!elem[UI.expando]) {
            _context6.next = 5;
            break;
          }
          _context6.next = 5;
          return elem[UI.expando];
        case 5:
          elem = elem.parentElement;
          _context6.next = 1;
          break;
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee3);
  })();
};
/** @returns {UI} */
UI.parent = function (elem) {
  var _iterator8 = _createForOfIteratorHelper(UI.parents(elem)),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var ui = _step8.value;
      return ui;
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
};
/** @template [T=UI] @param {Element} elem @param {new() => T} type @returns {T} */
UI.closest = function (elem) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : UI;
  var _iterator9 = _createForOfIteratorHelper(UI.parents(elem, true)),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var ui = _step9.value;
      if (ui instanceof type) return ui;
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
};

/* UI.merge_settings = function(...settings) {
    var o = {};
    for (var s of settings) {
        if (!s || typeof s !== "object") continue;
        for (var k in s) {
            let value = s[k];
            if (k === "class") {
                if (typeof value === "string") {
                    value = value.split(/\s+/).filter(s=>s);
                }
            } else if (k === "style") {
                if (typeof value === "string") {
                    value = parse_style(value);
                }
            }
            if (k in o) {
                if (utils.is_plain_object(o[k])) {
                    Object.assign(o[k], value);
                    continue;
                } else if (Array.isArray(o[k])) {
                    o[k].push(...value);
                    continue;
                }
            }
            o[k] = value;
        }
    }
    return o;
} */

var _handle_els = /*#__PURE__*/_regeneratorRuntime().mark(function handle_els(o) {
  var _iterator10, _step10, c, _iterator11, _step11, c2, _iterator12, _step12;
  return _regeneratorRuntime().wrap(function handle_els$(_context7) {
    while (1) switch (_context7.prev = _context7.next) {
      case 0:
        if (!Array.isArray(o)) {
          _context7.next = 35;
          break;
        }
        _iterator10 = _createForOfIteratorHelper(o);
        _context7.prev = 2;
        _iterator10.s();
      case 4:
        if ((_step10 = _iterator10.n()).done) {
          _context7.next = 25;
          break;
        }
        c = _step10.value;
        _iterator11 = _createForOfIteratorHelper(_handle_els(c));
        _context7.prev = 7;
        _iterator11.s();
      case 9:
        if ((_step11 = _iterator11.n()).done) {
          _context7.next = 15;
          break;
        }
        c2 = _step11.value;
        _context7.next = 13;
        return c2;
      case 13:
        _context7.next = 9;
        break;
      case 15:
        _context7.next = 20;
        break;
      case 17:
        _context7.prev = 17;
        _context7.t0 = _context7["catch"](7);
        _iterator11.e(_context7.t0);
      case 20:
        _context7.prev = 20;
        _iterator11.f();
        return _context7.finish(20);
      case 23:
        _context7.next = 4;
        break;
      case 25:
        _context7.next = 30;
        break;
      case 27:
        _context7.prev = 27;
        _context7.t1 = _context7["catch"](2);
        _iterator10.e(_context7.t1);
      case 30:
        _context7.prev = 30;
        _iterator10.f();
        return _context7.finish(30);
      case 33:
        _context7.next = 63;
        break;
      case 35:
        if (!(o instanceof UI)) {
          _context7.next = 40;
          break;
        }
        _context7.next = 38;
        return o.elem;
      case 38:
        _context7.next = 63;
        break;
      case 40:
        if (!(typeof o === "string")) {
          _context7.next = 60;
          break;
        }
        _iterator12 = _createForOfIteratorHelper($(o));
        _context7.prev = 42;
        _iterator12.s();
      case 44:
        if ((_step12 = _iterator12.n()).done) {
          _context7.next = 50;
          break;
        }
        c = _step12.value;
        _context7.next = 48;
        return c;
      case 48:
        _context7.next = 44;
        break;
      case 50:
        _context7.next = 55;
        break;
      case 52:
        _context7.prev = 52;
        _context7.t2 = _context7["catch"](42);
        _iterator12.e(_context7.t2);
      case 55:
        _context7.prev = 55;
        _iterator12.f();
        return _context7.finish(55);
      case 58:
        _context7.next = 63;
        break;
      case 60:
        if (!o) {
          _context7.next = 63;
          break;
        }
        _context7.next = 63;
        return o;
      case 63:
      case "end":
        return _context7.stop();
    }
  }, handle_els, null, [[2, 27, 30, 33], [7, 17, 20, 23], [42, 52, 55, 58]]);
});
Element.prototype.append = function () {
  for (var _len2 = arguments.length, children = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    children[_key2] = arguments[_key2];
  }
  old_append.apply(this, _toConsumableArray(_handle_els(children)));
};
Element.prototype.prepend = function () {
  for (var _len3 = arguments.length, children = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    children[_key3] = arguments[_key3];
  }
  old_prepend.apply(this, _toConsumableArray(_handle_els(children)));
};
UI.Column = /*#__PURE__*/function (_UI2) {
  function Column() {
    _classCallCheck(this, Column);
    return _callSuper(this, Column, arguments);
  }
  _inherits(Column, _UI2);
  return _createClass(Column, [{
    key: "init",
    value: function init() {
      _superPropGet(Column, "init", this)([]);
      this.elem.classList.add("column");
    }
  }]);
}(UI);
UI.FlexColumn = /*#__PURE__*/function (_UI3) {
  function FlexColumn() {
    _classCallCheck(this, FlexColumn);
    return _callSuper(this, FlexColumn, arguments);
  }
  _inherits(FlexColumn, _UI3);
  return _createClass(FlexColumn, [{
    key: "init",
    value: function init() {
      _superPropGet(FlexColumn, "init", this)([]);
      this.elem.classList.add("flex", "column");
    }
  }]);
}(UI);
UI.Row = /*#__PURE__*/function (_UI4) {
  function Row() {
    _classCallCheck(this, Row);
    return _callSuper(this, Row, arguments);
  }
  _inherits(Row, _UI4);
  return _createClass(Row, [{
    key: "init",
    value: function init() {
      _superPropGet(Row, "init", this)([]);
      this.elem.classList.add("row");
    }
  }]);
}(UI);
UI.FlexRow = /*#__PURE__*/function (_UI5) {
  function FlexRow() {
    _classCallCheck(this, FlexRow);
    return _callSuper(this, FlexRow, arguments);
  }
  _inherits(FlexRow, _UI5);
  return _createClass(FlexRow, [{
    key: "init",
    value: function init() {
      _superPropGet(FlexRow, "init", this)([]);
      this.elem.classList.add("flex", "row");
    }
  }]);
}(UI);
UI.Separator = /*#__PURE__*/function (_UI6) {
  function Separator(settings) {
    _classCallCheck(this, Separator);
    return _callSuper(this, Separator, ["<hr>", settings]);
  }
  _inherits(Separator, _UI6);
  return _createClass(Separator);
}(UI);
UI.Label = /*#__PURE__*/function (_UI7) {
  function Label(content, settings) {
    _classCallCheck(this, Label);
    return _callSuper(this, Label, ["<label></label>", _objectSpread({
      content: content
    }, settings)]);
  }
  _inherits(Label, _UI7);
  return _createClass(Label);
}(UI);
UI.Link = /*#__PURE__*/function (_UI8) {
  function Link(href, content, settings) {
    var _this12;
    _classCallCheck(this, Link);
    var el = $("<a>")[0];
    el.innerHTML = content;
    el.href = href;
    _this12 = _callSuper(this, Link, [el, _objectSpread({}, settings)]);
    _this12.on("update", function () {
      if ("href" in _this12.settings) _this12.elem.href = _this12.get_setting("href");
      if ("target" in _this12.settings) _this12.elem.target = _this12.get_setting("target");
    });
    return _this12;
  }
  _inherits(Link, _UI8);
  return _createClass(Link);
}(UI);
UI.Button = /*#__PURE__*/function (_UI9) {
  function Button(label, settings) {
    _classCallCheck(this, Button);
    var el = $("<button>")[0];
    el.innerHTML = label;
    return _callSuper(this, Button, [el, _objectSpread({}, settings)]);
  }
  _inherits(Button, _UI9);
  return _createClass(Button, [{
    key: "init",
    value: function init() {
      _superPropGet(Button, "init", this)([]);
      this.elem.classList.add("button");
    }
  }]);
}(UI);
UI.Root = /*#__PURE__*/function (_UI10) {
  /** @type {Set<UI>} */
  // connected_uis = new Set();
  function Root(root) {
    var _this13;
    _classCallCheck(this, Root);
    if (!root) root = document.body;
    _this13 = _callSuper(this, Root, [root]);
    _this13.ui_interval = setInterval(function () {
      _this13.update();
    }, 1000);
    _this13.ui_observer = new MutationObserver(function (mutations) {
      var _iterator13 = _createForOfIteratorHelper(mutations),
        _step13;
      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var mutation = _step13.value;
          var _iterator14 = _createForOfIteratorHelper(mutation.addedNodes),
            _step14;
          try {
            for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
              var node = _step14.value;
              var _iterator16 = _createForOfIteratorHelper(UI.find(node, UI, true, true)),
                _step16;
              try {
                for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                  var ui = _step16.value;
                  _this13.register(ui);
                }
              } catch (err) {
                _iterator16.e(err);
              } finally {
                _iterator16.f();
              }
            }
          } catch (err) {
            _iterator14.e(err);
          } finally {
            _iterator14.f();
          }
          var _iterator15 = _createForOfIteratorHelper(mutation.removedNodes),
            _step15;
          try {
            for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
              var node = _step15.value;
              var _iterator17 = _createForOfIteratorHelper(UI.find(node, UI, true, true)),
                _step17;
              try {
                for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                  var ui = _step17.value;
                  _this13.unregister(ui);
                }
              } catch (err) {
                _iterator17.e(err);
              } finally {
                _iterator17.f();
              }
            }
          } catch (err) {
            _iterator15.e(err);
          } finally {
            _iterator15.f();
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
    });
    ["keydown", "keyup", "mousedown", "mouseup", "click"].forEach(function (ev) {
      root.addEventListener(ev, function (e) {
        _this13.update_next_frame();
        /* for (var ui of UI.parents(e.target, true)) {
            ui.update_next_frame();
        } */
      });
    });
    _this13.ui_observer.observe(root, {
      childList: true,
      subtree: true
    }); //, attributes:true
    return _this13;
  }
  /** @param {UI} ui */
  _inherits(Root, _UI10);
  return _createClass(Root, [{
    key: "register",
    value: function register(ui) {
      this.unregister(ui);
      ui._parent = UI.parent(ui.elem);
      if (ui instanceof UI.Property) {
        ui._container = UI.closest(ui.elem, UI.PropertyContainer);
        if (ui._container) ui._container._properties.add(ui);
      }
      if (ui._parent) ui._parent._children.add(ui);
      ui.update_next_frame();
      /* if (!this.connected_uis.has(ui)) {
          this.connected_uis.add(ui);
          ui.update_next_frame();
      } */
    }
    /** @param {UI} ui */
  }, {
    key: "unregister",
    value: function unregister(ui) {
      if (ui._parent) {
        ui._parent._children["delete"](ui);
        ui._parent = null;
      }
      if (ui._container) {
        ui._container._properties["delete"](ui);
        ui._container = null;
      }
      // this.connected_uis.delete(ui);
    }
    /* update() {
        for (var ui of this.connected_uis) {
            ui.update();
        }
    } */
  }, {
    key: "destroy",
    value: function destroy() {
      _superPropGet(Root, "destroy", this)([]);
      clearInterval(this.ui_interval);
      this.ui_observer.disconnect();
    }
  }]);
}(UI);
UI.PropertyContainer = /*#__PURE__*/function (_UI11) {
  function PropertyContainer(settings) {
    var _this14;
    _classCallCheck(this, PropertyContainer);
    _this14 = _callSuper(this, PropertyContainer, [null, Object.assign({
      data: function data(a) {
        return a;
      },
      nullify_defaults: false,
      disabled: false
      // autoregister: true,
    }, settings)]);
    /** @type {Set<UI.Property>} */
    _defineProperty(_this14, "_properties", new Set());
    _this14.elem.classList.add("property-container");

    // /** @type {Set<UI.Property>} */
    // this.properties = new Set();

    /* if (this.settings.autoregister) {
        this.autoregister_observer = new MutationObserver(mutations=>{
            for (var mutation of mutations) {
                for (var node of mutation.addedNodes) {
                    this.register_properties(...UI.find(node, UI.Property, false, true));
                }
            }
        });
        this.autoregister_observer.observe(this.elem, { childList:true, subtree:true });
    } */

    _this14.datas = [null]; // necessary so update(null, {...}) can work

    _this14.elem.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.matches("input,select")) {
        var inputs = _this14.get_interactive_elements();
        var next_input = inputs[inputs.indexOf(e.target) + 1];
        if (next_input) next_input.focus();else e.target.blur();
        e.preventDefault();
        e.stopPropagation();
      }
    });
    return _this14;
  }

  // /** @param {UI.Properties} properties */
  // register_properties(...properties) {
  //     for (var p of properties) {
  //         this.properties.add(p);
  //         p.container = this;
  //     }
  // }

  // /** @param {UI.Properties} properties */
  // unregister_properties(...properties) {
  //     for (var p of properties) {
  //         this.properties.delete(p);
  //         p.container = undefined;
  //     }
  // }
  _inherits(PropertyContainer, _UI11);
  return _createClass(PropertyContainer, [{
    key: "data",
    get: function get() {
      return this.get_setting("data", this._datas[0]);
    },
    set: function set(value) {
      this._datas = [value];
    }
  }, {
    key: "datas",
    get: function get() {
      var _this15 = this;
      return this._datas.map(function (data) {
        return _this15.get_setting("data", data);
      });
    }
    /** @type {object[]} */,
    set: function set(values) {
      if (!Array.isArray(values)) values = [values];
      this._datas = _toConsumableArray(values);
      if (this._datas.length == 0) this._datas = [null];
    }
  }, {
    key: "valid",
    get: function get() {
      return this.properties.every(function (p) {
        return p.valid;
      });
    }
  }, {
    key: "valid_visible",
    get: function get() {
      var _iterator18 = _createForOfIteratorHelper(this.get_properties()),
        _step18;
      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var p = _step18.value;
          if (p.visible && !p.valid) return false;
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }
      return true;
    }
    /** @type {object} */
  }, {
    key: "property_lookup",
    get: function get() {
      return Object.fromEntries(this.properties.map(function (p) {
        return [p.id, p._value];
      }));
    }
    /** @type {object} */
  }, {
    key: "named_property_lookup",
    get: function get() {
      return Object.fromEntries(this.properties.filter(function (p) {
        return !p.is_indeterminate && p.name;
      }).map(function (p) {
        return [p.name, p._value];
      }));
    }
    /** @type {object} */
  }, {
    key: "named_property_lookup_not_null",
    get: function get() {
      return Object.fromEntries(Object.entries(this.named_property_lookup).filter(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);
          _ref6[0];
          var v = _ref6[1];
        return v !== null;
      }));
    }
  }, {
    key: "properties",
    get: function get() {
      return _toConsumableArray(this.get_properties());
    }
  }, {
    key: "get_properties",
    value: /*#__PURE__*/_regeneratorRuntime().mark(function get_properties() {
      var _iterator19, _step19, p;
      return _regeneratorRuntime().wrap(function get_properties$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (this._properties) {
              _context8.next = 2;
              break;
            }
            return _context8.abrupt("return");
          case 2:
            _iterator19 = _createForOfIteratorHelper(this._properties);
            _context8.prev = 3;
            _iterator19.s();
          case 5:
            if ((_step19 = _iterator19.n()).done) {
              _context8.next = 11;
              break;
            }
            p = _step19.value;
            _context8.next = 9;
            return p;
          case 9:
            _context8.next = 5;
            break;
          case 11:
            _context8.next = 16;
            break;
          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](3);
            _iterator19.e(_context8.t0);
          case 16:
            _context8.prev = 16;
            _iterator19.f();
            return _context8.finish(16);
          case 19:
          case "end":
            return _context8.stop();
        }
      }, get_properties, this, [[3, 13, 16, 19]]);
    })
  }, {
    key: "get_properties_by_name",
    value: function get_properties_by_name(name) {
      return this.properties.filter(function (p) {
        return p.name === name;
      });
    }
  }, {
    key: "get_property_by_name",
    value: function get_property_by_name(name) {
      return this.get_properties_by_name(name)[0];
    }
  }, {
    key: "get_interactive_elements",
    value: function get_interactive_elements() {
      return _toConsumableArray(this.elem.querySelectorAll("input,select,textarea")).filter(function (e) {
        return is_visible(e);
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      var _iterator20 = _createForOfIteratorHelper(this.get_properties()),
        _step20;
      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var p = _step20.value;
          p.reset(true);
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }
    }
  }, {
    key: "update",
    value: function update() {
      var _iterator21 = _createForOfIteratorHelper(this.get_properties()),
        _step21;
      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var p = _step21.value;
          if (p.settings["data"] !== undefined) {
            var values = this.datas.map(function (d) {
              return p.get_setting("data", d);
            });
            p.set_values(values);
          } else if (p.name) {
            var path = p.name.split("/").filter(function (p) {
              return p;
            });
            var values = this.datas.map(function (d) {
              if (!d) return null;
              return _try(function () {
                return get(d, path);
              });
            });
            var hash = JSON.stringify(values);
            if (p._last_values_on_property_update !== hash) {
              p._last_values_on_property_update = hash;
              p.set_values(values);
            }
          }
        }
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }
      _superPropGet(PropertyContainer, "update", this)([]);
    }
  }]);
}(UI);

/* UI.Indeterminate = Object.freeze(new class {
    toString() { return "[Indeterminate]"; }
}()); */

/** @typedef {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} Input */

UI.Property = /*#__PURE__*/function (_UI12) {
  /** @param {string} name @param {string} label @param {string|Element[]} contents @param {object} settings */
  function Property(name, label, contents, settings) {
    var _this16;
    _classCallCheck(this, Property);
    settings = _objectSpread({
      "setup": function setup() {
        var inputs_selector = "input,select,textarea";
        var inputs = _this16.contents.map(function (e) {
          if (e.matches(inputs_selector)) return [e];
          return Array.from(e.querySelectorAll(inputs_selector));
        }).flat();
        inputs.forEach(function (i) {
          return _this16.setup_generic_input(i);
        });
        return inputs;
      },
      "label": label,
      // "event":(e)=>e.type === "change",
      "placeholder": "",
      "invalid_class": "invalid",
      "default": null,
      "readonly": undefined,
      "spinner": undefined,
      "min": undefined,
      "max": undefined,
      "step": undefined,
      "round": undefined,
      "precision": undefined,
      "disabled": false,
      "reset": true,
      "hidden": false,
      "info": undefined,
      "options": undefined,
      "copy": false,
      "reset_on_dblclick": false,
      "nullify_defaults": function nullify_defaults() {
        var container = _this16.container;
        return container ? container.get_setting("nullify_defaults") : false;
      }
    }, settings);
    _this16 = _callSuper(this, Property, [null, settings]);
    _this16.elem.classList.add("property");
    _this16._values = [null];
    /** @type {Element[]} */
    _this16.contents = [];
    /** @type {Input[]} */
    _this16.inputs = [];
    /** @type {Function(any,Input):string[]} */
    _this16.input_modifiers = [];
    /** @type {Function(any,Input):any[]} */
    _this16.output_modifiers = []; //(v,input)=>input.value=v
    /** @type {Function(any,Input):any[]} */
    _this16.validators = [];
    _this16.options_consistant = true;
    // this.values_valid = true;
    _this16.inputs_valid = true;
    _this16.name = name;
    _this16.name_id = "".concat(_this16.name, "-").concat(_this16.id);
    _this16.inner = new UI();
    _this16.inner.elem.classList.add("property-inner");
    _this16.append(_this16.inner);
    contents = typeof contents === "string" ? $(contents) : contents;
    if (!Array.isArray(contents)) contents = [contents];
    contents.forEach(function (e) {
      return _this16.inner.append(e);
    });
    _this16.contents = contents;
    var inputs = _this16.get_setting("setup") || [];
    if (!Array.isArray(inputs)) inputs = [inputs];
    _this16.inputs = inputs;
    if (_this16.input) {
      if (_this16.settings["placeholder"] === undefined) _this16.settings["placeholder"] = _this16.input.placeholder;
      if (_this16.settings["readonly"] === undefined) _this16.settings["readonly"] = _this16.input.readOnly;
      if (_this16.settings["default"] === undefined) _this16.settings["default"] = _this16.input.value;
      if (_this16.settings["min"] === undefined && _this16.input.min) _this16.settings["min"] = function () {
        return _this16.apply_input_modifiers(+_this16.input.min);
      };
      if (_this16.settings["max"] === undefined && _this16.input.max) _this16.settings["max"] = function () {
        return _this16.apply_input_modifiers(+_this16.input.max);
      };
      if (_this16.settings["step"] === undefined && _this16.input.step) _this16.settings["step"] = function () {
        return _this16.apply_input_modifiers(+_this16.input.step);
      };
    }
    if (_this16.input && _this16.input.type === "number" || _this16.settings["step"] !== undefined || _this16.settings["precision"] !== undefined || _this16.settings["round"] !== undefined || _this16.settings["min"] !== undefined || _this16.settings["max"] !== undefined || _this16.settings["spinner"] !== undefined) {
      _this16.is_numeric = true;
      _this16.settings["step"] = _this16.settings["step"] || 1;
      if (_this16.settings["spinner"] !== false && _this16.input.type !== "range") {
        _this16.spinner_elem = new UI().elem;
        _this16.spinner_elem.classList.add("spinner");
        _this16.up_button = new UI.Button("<i class=\"fas fa-caret-up\"></i>", {
          "click": function click(e) {
            return _this16.set_values(_this16.value + _this16.get_setting("step"), {
              trigger_if_changed: true
            });
          },
          "disabled": function disabled() {
            return _this16.value >= _this16.get_setting("max");
          }
        });
        _this16.down_button = new UI.Button("<i class=\"fas fa-caret-down\"></i>", {
          "click": function click(e) {
            return _this16.set_values(_this16.value - _this16.get_setting("step"), {
              trigger_if_changed: true
            });
          },
          "disabled": function disabled() {
            return _this16.value <= _this16.get_setting("min");
          }
        });
        _this16.spinner_elem.append(_this16.up_button, _this16.down_button);
        _this16.inner.append(_this16.spinner_elem);
      }
    }
    var label_elem = _this16.elem.querySelector("label");
    if (!label_elem) {
      label_elem = $("<label><span></span></label>")[0];
      _this16.label = new UI(label_elem, {
        hidden: function hidden() {
          return !_this16.get_setting("label", _this16.data);
        },
        update: function update() {
          set_inner_html(_this16.label.elem.firstChild, _this16.get_setting("label", _this16.data));
          var info = _this16.get_setting("info", _this16.data);
          if (info) {
            if (!_this16.info_elem) {
              _this16.info_elem = $("<span><i class=\"fas fa-question-circle info\"></i></span>")[0];
              _this16.label.append(_this16.info_elem);
              _this16.tooltip = new UI.Tooltip(_this16.info_elem);
            }
            _this16.tooltip.set_content(info);
          }
          if (_this16.info_elem) toggle_class(_this16.info_elem, "d-none", !info);
        }
      });
      _this16.prepend(_this16.label);
    }
    label_elem.setAttribute("for", _this16.name_id);
    if (_this16.get_setting("copy")) {
      var copy_hide_timeout;
      var copy_tippy;
      _this16.copy_button = new UI.Button("<i class=\"fas fa-copy\"></i>", {
        "click": function click(e) {
          e.preventDefault();
          _this16.input.select();
          window.navigator.clipboard.writeText(_this16.input.value);
          if (!copy_tippy) {
            copy_tippy = tippy(_this16.input, {
              content: "Copied!",
              distance: 0,
              trigger: "manual",
              zIndex: 999999,
              onShow: function onShow(instance) {
                clearTimeout(copy_hide_timeout);
                copy_hide_timeout = setTimeout(function () {
                  return instance.hide();
                }, 1500);
              }
            });
          }
          copy_tippy.show();
        },
        "title": "Copy"
      });
      _this16.inner.append(_this16.copy_button);
      var _iterator22 = _createForOfIteratorHelper(_this16.inputs),
        _step22;
      try {
        var _loop = function _loop() {
          var input = _step22.value;
          input.addEventListener("mousedown", function (e) {
            input.select();
            if (e.button == 0) e.preventDefault();
          });
        };
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
    }
    _this16.reset_button = new UI.Button("<i class=\"fas fa-undo\"></i>", {
      "click": function click() {
        return _this16.reset(true);
      },
      "title": "Reset",
      "hidden": function hidden() {
        return !_this16.get_setting("reset");
      }
    });
    _this16.inner.append(_this16.reset_button);

    /* requestAnimationFrame(()=>{
        this.update_inputs(true);
    }); */
    return _this16;
  }
  _inherits(Property, _UI12);
  return _createClass(Property, [{
    key: "content",
    get: function get() {
      return this.contents[0];
    }
  }, {
    key: "input",
    get: function get() {
      return this.inputs[0];
    }
  }, {
    key: "_value",
    get: function get() {
      return this._values[0];
    }
  }, {
    key: "value",
    get: function get() {
      return this.iterate_values().next().value;
    } // this.indeterminate ? UI.Indeterminate : 
  }, {
    key: "values",
    get: function get() {
      return Array.from(this.iterate_values());
    }
    /** @type {boolean} */
  }, {
    key: "is_indeterminate",
    get: function get() {
      return !all_equal(this.values);
    }
    /** @type {boolean} */
  }, {
    key: "is_default",
    get: function get() {
      var _this17 = this;
      if (this.nullify_defaults) return this._values.every(function (v) {
        return v == null;
      });
      return this.datas.every(function (item, i) {
        return JSON.stringify(_this17.get_setting("default", item)) === JSON.stringify(_this17.values[i]);
      }); // was this._values[i]
    }
    /** @type {boolean} */
  }, {
    key: "nullify_defaults",
    get: function get() {
      return this.get_setting("nullify_defaults");
    }
  }, {
    key: "data",
    get: function get() {
      return this.datas[0];
    }
  }, {
    key: "datas",
    get: function get() {
      var container = this.container;
      if ("data" in this.settings) return [this.get_setting("data")];
      return container ? container._datas : [null];
    }
    /** @type {UI.PropertyContainer} */
  }, {
    key: "container",
    get: function get() {
      return this._container;
      // return this.get_closest(UI.PropertyContainer);
    }
  }, {
    key: "hidden",
    get: function get() {
      var _this18 = this;
      return this.datas.some(function (item) {
        return _this18.get_setting("hidden", item);
      }); // (this.parent||{}).hidden || 
    }
  }, {
    key: "disabled",
    get: function get() {
      var _this19 = this;
      return this.datas.some(function (item) {
        return _this19.get_setting("disabled", item);
      }) || this.disabled_parent || !this.options_consistant;
    }
  }, {
    key: "valid",
    get: function get() {
      //return this.values_valid === true &&
      return this.inputs_valid === true;
    }
  }, {
    key: "setup_generic_input",
    value: function setup_generic_input(input) {
      var _this20 = this;
      input.setAttribute("id", this.name_id);
      // input.setAttribute("name", this.name);
      var input_events = ["change", "input"];
      input_events.forEach(function (ev_type) {
        input.addEventListener(ev_type, function (e, i) {
          if (ev_type == "input") _this20.emit("input", e);
          var value = get_value(input);
          value = _this20.apply_input_modifiers(value, input);
          _this20.set_value(value, {
            trigger_if_changed: e.type == "change"
          });
        });
      });
      input.addEventListener("blur", function (e) {
        _this20.update_next_frame();
      });
      input.addEventListener("focus", function (e) {
        _this20.update_next_frame();
      });
      if (input.nodeName === "INPUT") {
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
          }
          if (input.type !== "number" && _this20.is_numeric) {
            var new_value;
            if (e.key == "ArrowUp") new_value = _this20.value + _this20.get_setting("step");else if (e.key == "ArrowDown") new_value = _this20.value - _this20.get_setting("step");
            if (new_value !== undefined) {
              e.stopPropagation();
              e.preventDefault();
              // input._force_update_value = true;
              _this20.set_values(new_value, {
                trigger_if_changed: true
              });
            }
          }
        });
      }
      input.addEventListener("dblclick", function (e) {
        if (_this20.get_setting("reset_on_dblclick")) {
          _this20.set_values(null, {
            trigger_if_changed: true
          });
        }
      });

      /* Object.defineProperty(input, 'value', {
          get () { return this.get_value(); },
          set (value) { this.set_value(value, false); }
      }); */
    }
  }, {
    key: "reset",
    value: function reset() {
      var trigger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.set_values(null, {
        trigger_if_changed: trigger
      });
    }
  }, {
    key: "fix_value",
    value: function fix_value(value) {
      if (typeof value == "number") {
        var min = this.get_setting("min");
        var max = this.get_setting("max");
        var round = this.get_setting("round");
        var precision = this.get_setting("precision");
        if (max !== undefined) value = Math.min(value, +max);
        if (min !== undefined) value = Math.max(value, +min);
        if (round !== undefined) value = round_to_factor(value, round);
        if (precision !== undefined) value = +value.toFixed(precision);
        /* if (isNaN(value)) {
            debugger;
            value = 0
        } */
      }
      return value;
    }

    /** @typedef {{trigger:boolean, trigger_if_changed:boolean}} SetValueOptions */
    /** @param {SetValueOptions} options */
  }, {
    key: "set_value",
    value: function set_value(value, options) {
      return this.set_values(this.datas.map(function (_) {
        return value;
      }), options);
    }

    /** @param {SetValueOptions} options */
  }, {
    key: "set_values",
    value: function set_values(values, options) {
      var _this21 = this;
      options = Object.assign({
        trigger: false,
        trigger_if_changed: false
      }, options);
      // console.trace(this.name, values, trigger);
      // if (!Array.isArray(values)) throw new Error("Values must be array...");
      if (!Array.isArray(values)) values = this.datas.map(function (item) {
        return values;
      });
      if (values.length != this.datas.length) {
        throw new Error("Values length (".concat(values.length, ") mismatch datas length (").concat(this.datas.length, ")..."));
      }
      values = values.map(function (v) {
        return _this21.fix_value(v);
      });
      this._values = this.datas.map(function (data, i) {
        var default_value = _this21.fix_value(_this21.get_setting("default", data));
        if (_this21.nullify_defaults) return JSON.stringify(values[i]) === JSON.stringify(default_value) ? null : values[i];
        return values[i] == null ? default_value : values[i];
      });

      // --------------- DO NOT TOUCH ---------------
      // -------- THIS IS A DELICATE MACHINE --------

      var values_hash = JSON.stringify([this.values, this._values, options.trigger_if_changed, options.trigger]);
      var changed = values_hash !== this._last_changed_values_hash;
      if (changed) this._last_changed_values_hash = values_hash;
      var trigger = options.trigger || options.trigger_if_changed && changed;
      if (trigger) {
        this.inputs.forEach(function (input) {
          return input._force_update_value = true;
        });
      }

      // --------------------------------------------

      this.update_next_frame();
      var e = {
        "datas": _toConsumableArray(this.datas),
        "name": this.name,
        "_value": this._value,
        "_values": this._values,
        "value": this.value,
        "values": this.values,
        "trigger": trigger
      };
      var container = this.container;
      if (changed || trigger) {
        this.emit("change", e);
        if (container) container.emit("property-change", e);
      }
      return changed;
    }
  }, {
    key: "update",
    value: function update() {
      var _this22 = this;
      var is_default = this.is_default;
      var is_indeterminate = this.is_indeterminate;
      var default_value = this.get_setting("default", this.data);
      var readonly = this.get_setting("readonly");
      var disabled = this.disabled;
      var style_not_default = !!this.get_setting("reset");
      this.options_consistant = true;
      if (this.settings["options"] !== undefined) {
        var options = [];
        var items_options = this.datas.map(function (item) {
          return _this22.get_setting("options", item) || [];
        });
        this.options_consistant = function () {
          if (_this22.datas.length <= 1) return true;
          var last;
          var _iterator23 = _createForOfIteratorHelper(items_options),
            _step23;
          try {
            for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
              var o = _step23.value;
              var curr = JSON.stringify(o);
              if (last && curr != last) return false;
              last = curr;
            }
          } catch (err) {
            _iterator23.e(err);
          } finally {
            _iterator23.f();
          }
          return true;
        }();
        if (!this.options_consistant) is_indeterminate = true;
        if (!this.options_consistant || is_indeterminate) options = [{
          value: "",
          text: "Multiple values",
          style: {
            "display": "none"
          }
        }];
        if (this.options_consistant) {
          var _options;
          (_options = options).push.apply(_options, _toConsumableArray(deep_copy(items_options[0])));
        }
        options = fix_options(options);
        if (style_not_default) {
          options.forEach(function (o) {
            if (String(o.value) === String(default_value)) o.text += " *";
          });
        }
        this.inputs.filter(function (e) {
          return e.nodeName === "SELECT";
        }).forEach(function (e) {
          return set_select_options(e, options);
        });
      }
      var valids = [];
      this.inputs.forEach(function (/**@type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement}*/input, i) {
        // input.disabled = disabled;
        input.toggleAttribute("disabled", disabled === true);
        if (readonly !== undefined) {
          input.readOnly = readonly;
          // set_attribute(input, "readonly", readonly);
        }
        var is_focused = has_focus(input);
        var is_checkbox = input.nodeName === "INPUT" && input.type === "checkbox";
        input.classList.toggle("not-default", !is_default && style_not_default); // !is_focused && 

        if (is_checkbox) {
          input.indeterminate = is_indeterminate;
        }
        var value = _this22.value;
        if (is_indeterminate) {
          if (input.type == "color") value = "#000000";else value = "";
        } else {
          value = _this22.apply_output_modifiers(value, input);
          if (typeof value === "number" && _this22.settings["precision"] !== undefined) {
            value = value.toFixed(_this22.get_setting("precision"));
            if (value.includes(".")) value = value.replace(/\.?0+$/, "");
          }
        }
        // if ((input.nodeName === "INPUT" || input.nodeName === "TEXTAREA") && is_focused && !input.hasAttribute("readonly") && !input._force_update_value) {
        /* if ((input.nodeName === "INPUT" && (input.type == "date" || input.type == "time")) && is_focused) {
        } else {
        } */
        if (!is_focused || input._force_update_value) {
          set_value(input, value, false);
        }
        input._force_update_value = false;

        // set_value(input, value, false);

        /* if (blur) {
            input.blur();
        } */

        // set_attribute(input, "placeholder", placeholder);
        input.placeholder = is_indeterminate ? "Multiple values" : _this22.get_setting("placeholder");
        var title = is_indeterminate ? "Multiple values" : _this22.get_setting("title") || "";
        if (title) input.setAttribute("title", title);else input.removeAttribute("title");
        var valid = disabled || is_indeterminate || function () {
          var _iterator24 = _createForOfIteratorHelper(_this22.validators),
            _step24;
          try {
            for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
              var validator = _step24.value;
              valid = validator.apply(_this22, [_this22.value, input]);
              if (valid !== true) return valid;
            }
          } catch (err) {
            _iterator24.e(err);
          } finally {
            _iterator24.f();
          }
          return true;
        }();
        valids.push(valid);
        var invalid_class = _this22.get_setting("invalid_class");
        if (invalid_class) input.classList.toggle(invalid_class, valid !== true);
        if (valid === false) valid = "Invalid input";
        if (input._last_valid !== valid) {
          if (typeof valid === "string") {
            if (!input._tooltip) new UI.Tooltip(input);
            input._tooltip.set_content(valid);
          } else {
            if (input._tooltip) input._tooltip.destroy();
          }
          input._last_valid = valid;
        }
      });
      this.inputs_valid = valids.every(function (v) {
        return v === true;
      });
      _superPropGet(Property, "update", this)([]);
    }
  }, {
    key: "add_validator",
    value: function add_validator() {
      var _this$validators;
      (_this$validators = this.validators).push.apply(_this$validators, arguments);
    }
  }, {
    key: "apply_input_modifiers",
    value: function apply_input_modifiers(v, input) {
      var _iterator25 = _createForOfIteratorHelper(this.input_modifiers),
        _step25;
      try {
        for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
          var m = _step25.value;
          v = m.apply(this, [v, input]);
        }
      } catch (err) {
        _iterator25.e(err);
      } finally {
        _iterator25.f();
      }
      return v;
    }
  }, {
    key: "apply_output_modifiers",
    value: function apply_output_modifiers(v, input) {
      var v;
      var _iterator26 = _createForOfIteratorHelper(this.output_modifiers),
        _step26;
      try {
        for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
          var m = _step26.value;
          v = m.apply(this, [v, input]);
          if (v === undefined) return;
        }
      } catch (err) {
        _iterator26.e(err);
      } finally {
        _iterator26.f();
      }
      return v;
    }
  }, {
    key: "iterate_values",
    value: /*#__PURE__*/_regeneratorRuntime().mark(function iterate_values() {
      var datas, i;
      return _regeneratorRuntime().wrap(function iterate_values$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            datas = this.datas;
            i = 0;
          case 2:
            if (!(i < this._values.length)) {
              _context9.next = 8;
              break;
            }
            _context9.next = 5;
            return this._values[i] == null ? this.get_setting("default", datas[i]) : this._values[i];
          case 5:
            i++;
            _context9.next = 2;
            break;
          case 8:
          case "end":
            return _context9.stop();
        }
      }, iterate_values, this);
    })
    /* destroy() {
        if (this.container) this.container.unregister_properties(this);
        super.destroy();
    } */
  }]);
}(UI);
UI.MultiProperty = /*#__PURE__*/function (_UI$Property) {
  function MultiProperty(name, label, contents, settings) {
    var _this23;
    _classCallCheck(this, MultiProperty);
    _this23 = _callSuper(this, MultiProperty, [name, label, contents, settings]);
    _this23.input_modifiers.push(function (value, input) {
      if (Array.isArray(_this23.value)) {
        var i = _this23.inputs.indexOf(input);
        var v = _toConsumableArray(_this23.value);
        v[i] = value;
      }
      return v;
    });
    _this23.output_modifiers.push(function (value, input) {
      if (Array.isArray(_this23.value)) {
        var i = _this23.inputs.indexOf(input);
        value = value[i];
      }
      return value;
    });
    return _this23;
  }
  _inherits(MultiProperty, _UI$Property);
  return _createClass(MultiProperty);
}(UI.Property);
UI.DateTimeProperty = /*#__PURE__*/function (_UI$Property2) {
  function DateTimeProperty(name, label) {
    var _this24;
    var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, DateTimeProperty);
    var inputs = $("<input type=\"date\"><input type=\"time\">");
    var get_value = function get_value() {
      var values = inputs.map(function (i) {
        return i.value;
      });
      if (values.every(function (v) {
        return v === "";
      })) return NaN;
      if (!values[0]) values[0] = _this24.today_str;
      if (!values[1]) values[1] = "00:00";
      return join_datetime(values, _this24.get_setting("datetime.apply_timezone"));
    };
    _this24 = _callSuper(this, DateTimeProperty, [name, label, inputs, Object.assign({
      "datetime.apply_timezone": true,
      "default": null,
      "setup": function setup() {
        inputs.forEach(function (input) {
          input.addEventListener("blur", function (e) {
            var value = get_value();
            if (!isNaN(value)) {
              _this24.set_value(value, {
                trigger_if_changed: true
              });
            }
          });
          input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
              e.preventDefault();
              e.target.blur();
              if (e.target === inputs[0]) inputs[1].focus();
            }
          });
        });
        return inputs;
      }
    }, settings)]);
    _this24.add_validator(function (_, input) {
      if (_this24.get_setting("datetime.after_now")) {
        // inputs[0].min = utils.split_datetime(new Date())[0];
        if (!input.value) return true;
        var before_now = get_value() < Math.floor(new Date() / 1000) * 1000;
        var before_today = new Date(inputs[0].value) < new Date(_this24.today_str);
        if (before_today && input === inputs[0]) return "Scheduled date is in the past.";else if (!before_today && before_now && input === inputs[1]) return "Scheduled time is in the past.";
        return true;
      }
    });
    _this24.output_modifiers.push(function (value, input) {
      // if (isNaN(get_value()) && !v) return;
      var parts = ["", ""];
      if (value) {
        parts = split_datetime(value, _this24.get_setting("datetime.apply_timezone"));
      }
      if (input === inputs[0]) {
        return parts[0];
      } else {
        return parts[1].slice(0, 5);
      }
    });
    return _this24;
  }
  _inherits(DateTimeProperty, _UI$Property2);
  return _createClass(DateTimeProperty, [{
    key: "today_str",
    get: function get() {
      return new Date().toISOString().split("T")[0];
    }
  }]);
}(UI.Property);
UI.TimeSpanProperty = /*#__PURE__*/function (_UI$Property3) {
  function TimeSpanProperty(name, label) {
    var _this25;
    var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, TimeSpanProperty);
    var input = $("<input type=\"text\">")[0];
    _this25 = _callSuper(this, TimeSpanProperty, [name, label, input, Object.assign({
      "timespan.format": "hh:mm:ss",
      "timespan.zero_infinity": false,
      "step": 1.0,
      "min-step": 0.001,
      "default": 0
    }, settings)]);
    _this25.input_modifiers.push(function (v) {
      var zero_infinity = _this25.get_setting("timespan.zero_infinity");
      if (zero_infinity && v.toLowerCase() === "infinity") return 0;
      v = timespan_str_to_seconds(v, _this25.get_setting("timespan.format"));
      return v;
    });
    _this25.output_modifiers.push(function (v) {
      var zero_infinity = _this25.get_setting("timespan.zero_infinity");
      if (zero_infinity && v == 0) return "Infinity";
      return ms_to_timespan_str(v * 1000, _this25.get_setting("timespan.format"));
    });
    return _this25;
  }
  _inherits(TimeSpanProperty, _UI$Property3);
  return _createClass(TimeSpanProperty);
}(UI.Property);
UI.TextArea = /*#__PURE__*/function (_UI$Property4) {
  function TextArea(name, label) {
    var _this26;
    var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, TextArea);
    var input = $("<textarea style=\"resize:none\"></textarea>")[0];
    _this26 = _callSuper(this, TextArea, [name, label, input, Object.assign({
      "default": "",
      "textarea.rows": 4,
      "textarea.min_rows": null,
      "textarea.return_blur": false
    }, settings)]);
    /** @type {AutoSizeController} */
    var asc;
    var rows = _this26.get_setting("textarea.rows");
    var min_rows = _this26.get_setting("textarea.min_rows");
    if (min_rows) {
      asc = new AutoSizeController(input, min_rows, false);
    } else if (rows) {
      _this26.input.rows = rows;
    }
    var max_length = _this26.get_setting("textarea.max_length");
    if (max_length) input.maxLength = max_length;
    if (_this26.get_setting("textarea.show_count")) {
      textarea_input_events.forEach(function (ev) {
        return input.addEventListener(ev, function () {
          return _this26.update_char_count();
        });
      });
      _this26.char_count = $("<div style=\"text-align:right\"></div>")[0];
      _this26.append(_this26.char_count);
      _this26.update_char_count();
    }
    input.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        if (_this26.get_setting("textarea.return_blur")) {
          e.preventDefault();
          input.blur();
        }
      }
    });
    _this26.on("update", function () {
      if (asc) asc.update();
    });
    return _this26;
  }
  _inherits(TextArea, _UI$Property4);
  return _createClass(TextArea, [{
    key: "update_char_count",
    value: function update_char_count() {
      this.char_count.innerHTML = "(".concat(this.input.value.length, "/").concat(this.get_setting("textarea.max_length") || "-", ")");
    }
  }]);
}(UI.Property);
UI.Tooltip = /*#__PURE__*/function () {
  function _class(elem, content) {
    _classCallCheck(this, _class);
    this._tippy = tippy(elem, {
      allowHTML: true,
      zIndex: 99999
      // appendTo: root,
    });
    this.elem = elem;
    if (content) this.set_content(content);
    elem._tooltip = this;
  }
  return _createClass(_class, [{
    key: "set_content",
    value: function set_content(content) {
      if (this._content === content) return;
      this._content = content;
      this._tippy.setContent(content);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (!this._tippy) return;
      this._tippy.destroy();
      this._tippy = null;
      this.elem._tooltip = null;
    }
  }]);
}();
UI.VALIDATORS = {
  not_empty: function not_empty(v) {
    return !!v || "Field cannot be empty";
  },
  rtmp: function rtmp(v) {
    return is_valid_rtmp_url(v) || "Invalid RTMP URL";
  },
  url: function url(v) {
    return is_valid_url(v) || "Invalid URL";
  },
  json: function json(v) {
    try {
      JSON.parse(v);
      return true;
    } catch (_unused2) {
      return false;
    }
  }
};
function is_visible(elem) {
  if (!elem.isConnected) return false;
  if (elem.offsetHeight === 0 && elem.offsetWidth === 0) return false;
  return true;
  /* if (!elem.ownerDocument) return false;
  while(elem) {
      if (getComputedStyle(elem).display === "none") return false;
      elem = elem.parentElement;
  }
  return true; */
}
function select_text(elem) {
  elem.focus();
  var range = elem.ownerDocument.createRange();
  range.selectNodeContents(elem);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
function fetch(url) {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText);
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  });
}
function parse_style(s) {
  _div2.setAttribute("style", s);
  var d = {};
  for (var i = 0; i < _div2.style.length; i++) {
    var k = _div2.style[i];
    d[k] = _div2.style.getPropertyValue(k);
  }
  return d;
}
function clone_document_head(from, to, opts) {
  opts = Object.assign({
    style: true,
    script: false,
    other: true,
    remove_media_rules: true
  }, opts);
  var promises = [];
  if (from instanceof Document) from = from.head;
  var _iterator27 = _createForOfIteratorHelper(from.children),
    _step27;
  try {
    for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
      var c = _step27.value;
      var is_stylesheet = c.nodeName === "LINK" && c.rel === "stylesheet";
      if (c.nodeName === "SCRIPT") {
        if (!opts.script) continue;
      } else if (is_stylesheet || c.nodeName === "STYLE") {
        if (!opts.style) continue;
      } else {
        if (!opts.other) continue;
      }
      var clone = c.cloneNode(true);
      to.append(clone);
      if (is_stylesheet && opts.remove_media_rules) {
        var promise = on_stylesheet_load(clone);
        promise.then(function (ss) {
          // order.push([new Date()-t, clone, ss]);
          var rules = [];
          try {
            rules = ss.cssRules;
          } catch (_unused3) {}
          if (!rules) return;
          for (var j = rules.length - 1; j >= 0; j--) {
            if (rules[j].cssText.indexOf('@media') === 0) {
              ss.deleteRule(j);
            }
          }
        });
        promises.push(promise);
      }
    }
  } catch (err) {
    _iterator27.e(err);
  } finally {
    _iterator27.f();
  }
  return Promise.all(promises);
}
/* copy_stylesheets: async function(from, to, remove_media_queries = false) {
    if (from.ownerDocument === to.ownerDocument) {
        console.log(`copy_stylesheets: both ownerDocuments identical.`);
        return;
    }
    var style_nodes = new Set();
    function add_style(elem) {
        if (typeof elem === "string") elem = $(elem)[0];
        style_nodes.add(elem);
        to.append(elem);
    }
    var remote_stylesheets = 0;
    // var promises = [];
    for (let e of from.querySelectorAll("*")) {
        if (e instanceof HTMLStyleElement || (e instanceof HTMLLinkElement && e.rel === "stylesheet")) {
            // var cloneable = true;
            // try { var test_access = (e.sheet && e.sheet.cssRules) } catch { cloneable = false; }
            // if (cloneable) {
            //     add_style(e.cloneNode(true));
            // } else {
            //     var p = fetch(e.href).then((css)=>{
            //         add_style(`<style type=${e.type} media=${e.media}>${css}</style>`);
            //     });
            //     promises.push(p);
            // }
            if (e.href) {
                var href = e.href;
                if (href.startsWith("//")) href = "https:"+href
                else if (href.startsWith("/")) href = location.origin+href;
                try {
                    var url = new URL(href);
                    if (url.host !== location.host) remote_stylesheets++;
                } catch {}
            }
            add_style(e.cloneNode(true));
        }
    }
    var num_stylesheets = style_nodes.size - remote_stylesheets;
    // await Promise.all(promises);
    
    return new Promise((resolve)=>{
        var check_interval = setInterval(()=>{
            for (var ss of to.ownerDocument.styleSheets) {
                if (!style_nodes.has(ss.ownerNode)) continue;
                style_nodes.delete(ss.ownerNode);
                try {
                    if (!ss.cssRules) continue;
                } catch {
                    continue;
                }
                if (remove_media_queries) {
                    for (var j = ss.cssRules.length-1; j >= 0; j--) {
                        if (ss.cssRules[j].cssText.indexOf('@media') === 0) {
                            ss.deleteRule(j);
                        }
                    }
                }
            }
            if (style_nodes.size === 0 || to.ownerDocument.styleSheets.length >= num_stylesheets) {
                clearInterval(check_interval);
                resolve();
            }
        }, 1000/20);
    });
}, */
// get_all_css(from, ignore_media_queries = false) {
//     var document = from instanceof Document ? from : from.ownerDocument;
//     var rules = [];
//     for (ss of document.styleSheets) {
//         rules.push(`/* ------------- ${ss.href||"Local StyleSheet"} ------------- */`)
//         try {
//             var test = ss.cssRules;
//         } catch {
//             continue;
//         }
//         for (var i = 0; i < ss.cssRules.length; i++) {
//             var css = ss.cssRules[i].cssText;
//             if (ignore_media_queries && css.indexOf('@media') === 0) continue;
//             css.replace(/url\(\"(.+?)\"\)/g, (...m)=>{
//                 if (m[1].match(/^(?:data\:|#|https?\:\/\/|\/)/)) return m[0];
//                 var url = utils.join_paths(utils.dirname(ss.href), m[1]);
//                 return `url("${url}")`
//             })
//             rules.push(css);
//         }
//         rules.push(`/* ------------- END ------------- */`)
//     }
//     return rules.join("\n");
// },
function insert_at(container, element, index) {
  if (container.children[index] === element) return;
  index = Math.max(index, 0);
  if (index === 0) {
    container.prepend(element);
  } else {
    var after = container.children[index];
    if (after) container.insertBefore(element, after);else container.append(element);
  }
}
function insert_after(target, elem) {
  var parent = target.parentNode;
  if (parent.lastChild === target) {
    parent.appendChild(elem);
  } else {
    parent.insertBefore(elem, target.nextSibling);
  }
}
function move(elem) {
  var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (i == 0) return;
  var children = _toConsumableArray(elem.parentElement.children);
  var index = children.indexOf(elem);
  if (i > 0) index += 1;
  insert_at(elem.parentElement, elem, index + i);
}
function upload(contentType) {
  var multiple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return new Promise(function (resolve) {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = contentType;
    input.onchange = function () {
      var files = _toConsumableArray(input.files);
      if (multiple) resolve(files);else resolve(files[0]);
    };
    input.click();
  });
}
function download(filename, text) {
  var element = document.createElement('a');
  element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  element.download = filename;
  element.click();
}
/** @typedef {{multiple:boolean, accept:string, directories:boolean}} FileDialogOptions */
/** @return {File[]} @param {FileDialogOptions} opts */
function open_file_dialog(opts) {
  opts = Object.assign({}, opts);
  return new Promise(function (resolve) {
    var element = document.createElement("input");
    element.style.display = 'none';
    element.type = "file";
    if (opts.accept) element.accept = opts.accept;
    if (opts.multiple) element.multiple = true;
    if (opts.directories) element.webkitdirectory = true;
    document.body.appendChild(element);
    element.addEventListener("change", function () {
      resolve(_toConsumableArray(this.files));
    });
    element.dispatchEvent(new MouseEvent("click"));
    document.body.removeChild(element);
  });
}
function _empty(elem) {
  while (elem.firstChild) elem.removeChild(elem.firstChild);
}
function set_select_options(select, options) {
  // if (!Array.isArray(settings)) Object.entries(settings);
  options = fix_options(options);
  var hash = JSON.stringify(options);
  if (hash === select._options_hash) return;
  select._options_hash = hash;
  select.innerHTML = "";
  return options.map(function (o) {
    var e = $("<option></option>")[0];
    e.innerHTML = o.text;
    if (o.disabled) e.disabled = true;
    if (o.selected) e.selected = true;
    if (o.hidden) e.hidden = true;
    if (o["class"]) e["class"].forEach(function (c) {
      return e.classList.add(c);
    });
    if (o.style) Object.assign(e.style, o.style);
    if (o.value !== undefined) {
      e.value = o.value;
      e.dataset.value = JSON.stringify(o.value);
    }
    select.append(e);
    return e;
  });
}
function fix_options(options) {
  return options.map(function (o) {
    if (Array.isArray(o)) {
      var i = 0,
        new_o = {};
      for (var i = 0; i < o.length; i++) {
        if (_typeof(o[i]) === "object" && o[i] !== null) Object.assign(new_o, o[i]);else if (new_o.value === undefined) {
          var _ref7 = [o[i], o[i]];
          new_o.value = _ref7[0];
          new_o.text = _ref7[1];
        } else new_o.text = String(o[i]);
      }
      return new_o;
    } else if (_typeof(o) === "object" && o !== null) {
      if (o.name && !o.text) {
        o.text = o.name;
        delete o.name;
      }
      return o;
    } else return {
      value: o,
      text: String(o)
    };
  });
}
function read_file(file, options) {
  options = Object.assign({
    encoding: "utf-8"
  }, options);
  return new Promise(function (resolve) {
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
      resolve(e.target.result);
    });
    reader.readAsText(file, options.encoding);
  });
}
function render_html(htmlString) {
  if (typeof htmlString !== "string") return null;
  _temp_div.innerHTML = htmlString.trim();
  if (_temp_div.childNodes.length == 1) return _temp_div.childNodes[0];
  return Array.from(_temp_div.childNodes);
}
function get_value(elem) {
  if (elem.type === "checkbox") {
    return elem.checked;
  } else if (elem.nodeName === "SELECT") {
    var option = _toConsumableArray(elem.children).find(function (e) {
      return e.value == elem.value;
    });
    if (option && option.dataset.value !== undefined) return JSON.parse(option.dataset.value);else return elem.value;
  } else if (["number", "range"].includes(elem.type)) {
    return parseFloat(elem.value) || 0;
  } else {
    return elem.value;
  }
}
// sets value and triggers change (only if value is different to previous value)
function set_value(elem, new_value) {
  var trigger_change = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // var curr_val = get_value(elem);
  // if (curr_val === val) return;
  if (elem.type === "checkbox") {
    new_value = !!new_value;
    if (elem.checked === new_value) return false;
    elem.checked = !!new_value;
  } else {
    if (elem.nodeName === "SELECT") {
      var json = JSON.stringify(new_value);
      var option = _toConsumableArray(elem.children).find(function (e) {
        return e.dataset.value == json;
      });
      if (option) new_value = option.value;else new_value = "";
    }
    if (new_value === null || new_value === undefined) {
      new_value = "";
    } else {
      new_value = String(new_value);
    }
    var old_value = elem.value;
    if (old_value === new_value) return false;
    var position = elem.selectionStart;
    elem.value = new_value;
    if (position !== undefined && elem.selectionEnd != null) elem.selectionEnd = position;
  }
  if (trigger_change) elem.dispatchEvent(new Event("change"));
  return true;
}
function get_index(element) {
  if (!element.parentNode) return -1;
  return Array.from(element.parentNode.children).indexOf(element);
}
/** @template T @param {{selector:string, auto_insert:boolean, remove:function(Element):void, add:function(T,Element,Number):Element }} opts @param {T[]} items */
function rebuild(container, items, opts) {
  if (!opts) opts = {};
  opts = Object.assign({
    selector: ":scope>*",
    auto_insert: true,
    remove: function remove(elem) {
      return elem.remove();
    },
    add: function add(elem) {},
    id_callback: null
  }, opts);
  var orig_elems = Array.from(container.querySelectorAll(opts.selector));
  var leftovers = new Set(orig_elems);
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var id = opts.id_callback ? opts.id_callback.apply(item, [item]) : item.id;
    var elem = orig_elems.find(function (e) {
      return e.dataset.id == id;
    });
    elem = opts.add(item, elem, i) || elem;
    elem.dataset.id = id;
    if (opts.auto_insert) {
      insert_at(container, elem, i);
    }
    leftovers["delete"](elem);
  }
  var _iterator28 = _createForOfIteratorHelper(leftovers),
    _step28;
  try {
    for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
      var elem = _step28.value;
      if (opts.remove) opts.remove(elem);else elem.remove();
    }
  } catch (err) {
    _iterator28.e(err);
  } finally {
    _iterator28.f();
  }
}
function is_html(str) {
  _temp_div.innerHTML = str;
  for (var c = _temp_div.childNodes, i = c.length; i--;) {
    if (c[i].nodeType == 1) return true;
  }
  return false;
}
function restart_animation(elem) {
  var parent = elem.parentElement;
  var i = get_index(elem);
  if (parent) {
    elem.remove();
    insert_at(parent, elem, i);
  }
}
function build_table(datas, opts) {
  opts = Object.assign({
    header: true,
    empty: "No Data"
  }, opts);
  var thead = "";
  var header = opts.header;
  if (typeof header == "boolean") {
    if (datas.length) header = Object.fromEntries(Object.keys(datas[0]).map(function (k) {
      return [k, k];
    }));else header = {};
  }
  header = Object.fromEntries(Object.entries(header).map(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
      k = _ref9[0],
      h = _ref9[1];
    return [k, typeof h === "string" ? {
      name: h
    } : h];
  }));
  thead = "<thead><tr>".concat(Object.values(header).map(function (h) {
    return "<th style=\"".concat(h.style || "", "\">").concat(h.name, "</th>");
  }).join(""), "</tr></thead>");
  var tbody = "<tbody>".concat(datas.length ? datas.map(function (d) {
    return "<tr>".concat(Object.keys(header).map(function (k) {
      return "<td style=\"".concat(header[k].style || "", "\">").concat(d[k], "</td>");
    }).join(""), "</tr>");
  }).join("") : "<td colspan=\"".concat(Object.keys(header).length, "\" style=\"text-align:center\">").concat(opts.empty, "</td>"), "</tbody>");
  var html = "<table>".concat(thead).concat(tbody, "</table>");
  return $(html)[0];
}
function scroll_percent(e, v) {
  if (v === undefined) {
    var x = e.scrollLeft / (e.scrollWidth - e.clientWidth);
    var y = e.scrollTop / (e.scrollHeight - e.clientHeight);
    return [isNaN(x) ? 1 : x, isNaN(y) ? 1 : y];
  } else {
    e.scrollLeft = (e.scrollWidth - e.clientWidth) * v[0];
    e.scrollTop = (e.scrollHeight - e.clientHeight) * v[1];
  }
}
function scroll_pos_from_bottom(e, v) {
  if (v === undefined) {
    return e.scrollHeight - e.clientHeight - e.scrollTop;
  } else {
    e.scrollTop = e.scrollHeight - e.clientHeight - v;
  }
}
/* scroll_into_view(e) {
    var p = e.parentElement;
    if ((e.offsetTop + e.offsetHeight) < p.scrollTop) p.scrollTop = e.offsetTop;
    else if (e.offsetTop > (p.scrollTop + p.offsetHeight)) p.scrollTop = e.offsetTop + e.offsetHeight - p.offsetHeight;
}, */
/** @param {Element} el @param {{block_offset:number, inline_offset:number, block:ScrollLogicalPosition, inline:ScrollLogicalPosition, behavior:ScrollBehavior }} options */
function scroll_to(container, el, options) {
  var block_offset = options.block_offset,
    inline_offset = options.inline_offset,
    block = options.block,
    inline = options.inline,
    behavior = options.behavior;
  var rect = el.getBoundingClientRect();
  if (!block && !inline) block = "start";
  if (block && rect.height == 0) return;
  if (inline && rect.width == 0) return;
  var scroll_opts = {
    block: block,
    inline: inline,
    behavior: behavior
  };
  if (block) {
    var offset = rect.top - (block_offset || 0);
    if (block == "nearest" && nearest(0, rect.top, rect.bottom) == rect.bottom) block = "end";
    if (block == 'center') {
      var space = window.innerHeight - offset;
      if (rect.height < space) offset -= (space - rect.height) / 2;
    } else if (block == "end") {
      offset -= rect.height;
    }
    scroll_opts.top = offset;
  }
  if (inline) {
    var _offset = rect.left - (inline_offset || 0);
    if (block == "nearest" && nearest(0, rect.left, rect.right) == rect.right) block = "end";
    if (block == 'center') {
      var _space = window.innerWidth - _offset;
      if (rect.width < _space) _offset -= (_space - rect.width) / 2;
    } else if (block == "end") {
      _offset -= rect.width;
    }
    scroll_opts.left = _offset;
  }
  container.scrollBy(scroll_opts);
}
function set_text(elem, text) {
  text = String(text);
  if (elem.textContent != text) elem.textContent = text;
}
var inner_html_prop = "__inner_html_" + random_string(8);
function set_inner_html(elem, html) {
  if (Array.isArray(html)) {
    set_children(elem, html);
  } else if (html instanceof Element) {
    if (elem.children[0] !== html) elem.prepend(html);
    for (var i = 1; i < elem.children.length; i++) elem.children[i].remove();
  } else {
    if (elem[inner_html_prop] !== html) {
      elem[inner_html_prop] = elem.innerHTML = html;
    }
    // _temp_div.innerHTML = html; // ugh. Needed for entities like & and whatnot
    // if (elem.innerHTML !== _temp_div.innerHTML) {
    //     elem.innerHTML = html;
    // }
  }
}
function set_children(elem, new_children) {
  var children = _toConsumableArray(elem.children);
  if (children.length && children.every(function (e, i) {
    return e === new_children[i];
  })) return;
  elem.replaceChildren.apply(elem, _toConsumableArray(new_children));
}
function encode_html_entities(str) {
  return String(str).replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
    return "&#".concat(i.charCodeAt(0), ";");
  });
}
function decode_html_entities(str) {
  return String(str).replace(/&#\d+;/gm, function (s) {
    return String.fromCharCode(s.match(/\d+/)[0]);
  });
}
function toggle_class(elem, clazz, value) {
  if (elem.classList.contains(clazz) != value) {
    elem.classList.toggle(clazz, value);
  }
}
function set_attribute(elem, attr, value) {
  if (elem.getAttribute(attr) != value) {
    elem.setAttribute(attr, value);
  }
}
function toggle_attribute(elem, attr, value) {
  if (elem.hasAttribute(attr) != value) {
    elem.toggleAttribute(attr, value);
  }
}
function set_style_property(elem, prop, value) {
  if (elem.style.getPropertyValue(prop) != value) {
    elem.style.setProperty(prop, value);
  }
}
function escape_html_entities(text) {
  return text.replace(/[\u00A0-\u2666<>\&]/g, function (c) {
    return '&' + (entity_table[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';';
  });
}
function on_click_and_hold(elem, callback) {
  var delay = 0;
  var next_time = 0;
  var is_down = false;
  elem.addEventListener("mousedown", function (e) {
    next_time = 0;
    delay = 250;
    handleMouseDown(e);
  });
  document.addEventListener("mouseup", function (e) {
    handleMouseUp(e);
  });
  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    is_down = true;
    requestAnimationFrame(watcher);
  }
  function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    is_down = false;
  }
  function watcher(time) {
    if (!is_down) return;
    if (time > next_time) {
      next_time = time + delay;
      delay = Math.max(50, delay - 50);
      callback.apply(elem);
    }
    requestAnimationFrame(watcher);
  }
}
function cycle_select(elem) {
  var trigger_change = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var value = elem.value;
  var options = Array.from(elem.options);
  var i = 0;
  for (; i < options.length; i++) {
    if (options[i].value == value) {
      i++;
      break;
    }
  }
  elem.value = options[i % options.length].value;
  if (trigger_change) elem.dispatchEvent(new Event("change"));
}
/** @return {Window} */
function get_owner_window(node) {
  var doc = node.ownerDocument;
  return doc.defaultView ? doc.defaultView : doc.parentWindow;
}

// for textareas only
function autosize(elem) {
  var min_rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  // var nearest_scrollable = closest(elem, (e)=>is_scrollbar_visible(e));
  // var scroll = [];
  // if (nearest_scrollable) {
  //     scroll = [nearest_scrollable.scrollLeft, nearest_scrollable.scrollTop];
  // }
  elem.setAttribute("rows", min_rows);
  elem.style.resize = "none";
  var style = getComputedStyle(elem, null);
  var heightOffset;
  if (style.boxSizing === 'content-box') {
    heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
  } else {
    heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  }
  // Fix when a textarea is not on document body and heightOffset is Not a Number
  if (isNaN(heightOffset)) {
    heightOffset = 0;
  }
  elem.style.overflow = "hidden";
  elem.style.height = "auto";
  var h = Math.max(18 * min_rows, elem.scrollHeight) + heightOffset;
  if (h) elem.style.height = "".concat(h, "px");

  // if (nearest_scrollable) {
  //     nearest_scrollable.scrollTo(...scroll);
  // }
}
function has_focus(el) {
  var ancestors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var active = el.getRootNode().activeElement;
  if (!ancestors) return active === el;
  return closest(el, function (e) {
    return e === active;
  });
}
function has_touch_screen() {
  if ("maxTouchPoints" in window.navigator) {
    return window.navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in window.navigator) {
    return window.navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && window.matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      return !!mQ.matches;
    } else if ('orientation' in window) {
      return true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      var UA = window.navigator.userAgent;
      return /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
}
function get_top_position(el) {
  var _el$getBoundingClient = el.getBoundingClientRect(),
    top = _el$getBoundingClient.top;
  var _window$getComputedSt = window.getComputedStyle(el),
    marginTop = _window$getComputedSt.marginTop;
  return top - parseInt(marginTop, 10);
}
function detect_wrapped_elements(parent, opts) {
  opts = Object.assign({
    isChildrenWrappedClassName: "is-wrapped",
    isSiblingWrappedClassName: "sibling-is-wrapped",
    isSelfWrappedClassName: "self-is-wrapped",
    nextIsWrappedClassName: "next-is-wrapped"
  }, opts);
  var any_wrapping = false;
  for (var i = 0; i < parent.children.length; i++) {
    var child = parent.children[i];
    var prev = parent.children[i - 1];
    var top = get_top_position(child);
    var prevTop = prev ? get_top_position(prev) : top;
    var is_wrapped = top > prevTop;
    child.classList.toggle(opts.isSelfWrappedClassName, is_wrapped);
    if (prev) prev.classList.toggle(opts.nextIsWrappedClassName, is_wrapped);
    if (is_wrapped) any_wrapping = true;
  }
  parent.classList.toggle(opts.isChildrenWrappedClassName, any_wrapping);
  _toConsumableArray(parent.children).forEach(function (e) {
    e.classList.toggle(opts.isSiblingWrappedClassName, !e.classList.contains(opts.isSelfWrappedClassName) && any_wrapping);
  });
}
function on_stylesheet_load(_x2) {
  return _on_stylesheet_load.apply(this, arguments);
}
function _on_stylesheet_load() {
  _on_stylesheet_load = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(elem) {
    var href, check_interval, resolve, i, check;
    return _regeneratorRuntime().wrap(function _callee5$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          check = function _check2() {
            if (elem.sheet || ++i >= 100) return resolve(elem.sheet);
            var _iterator33 = _createForOfIteratorHelper(elem.ownerDocument.styleSheets),
              _step33;
            try {
              for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
                var ss = _step33.value;
                if (ss.href === href) return resolve(ss);
              }
            } catch (err) {
              _iterator33.e(err);
            } finally {
              _iterator33.f();
            }
          };
          href = elem.href;
          if (href.startsWith("//")) href = location.protocol + href;else if (href.startsWith("/")) href = location.origin + href;
          if (!(elem.nodeName === "LINK" && elem.sheet)) {
            _context12.next = 5;
            break;
          }
          return _context12.abrupt("return", true);
        case 5:
          i = 0;
          return _context12.abrupt("return", new Promise(function (_resolve) {
            resolve = function resolve() {
              return _resolve(elem.sheet);
            };
            elem.addEventListener("load", resolve);
            check_interval = setInterval(check, 100);
            // setTimeout(check, 1);
          }).then(function (ss) {
            clearInterval(check_interval);
            elem.removeEventListener("load", resolve);
            return ss;
          }));
        case 7:
        case "end":
          return _context12.stop();
      }
    }, _callee5);
  }));
  return _on_stylesheet_load.apply(this, arguments);
}
function closest(elem, delegate) {
  var p = elem;
  while (p) {
    var r = delegate.apply(p, [p]);
    if (r) return p;
    p = p.parentElement;
  }
}
function is_scrollbar_visible(elem) {
  var doc = elem.ownerDocument;
  var win = doc.defaultView || doc.parentWindow;
  var scroll_lookup = {
    auto: true,
    scroll: true,
    visible: false,
    hidden: false
  };
  var styles = win.getComputedStyle(elem, null);
  var overflow_x = scroll_lookup[styles.overflowX.toLowerCase()] || false;
  var overflow_y = scroll_lookup[styles.overflowY.toLowerCase()] || false;
  return overflow_x || overflow_y;
}
function debounce_next_frame(func) {
  var timeout, args, context;
  var later = function later() {
    timeout = null;
    func.apply(context, args);
  };
  var debounced = function debounced() {
    context = this;
    for (var _len4 = arguments.length, p = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      p[_key4] = arguments[_key4];
    }
    args = p;
    if (!timeout) {
      timeout = requestAnimationFrame(later);
    }
  };
  debounced.cancel = function () {
    cancelAnimationFrame(timeout);
    timeout = args = context = null;
  };
  return debounced;
}
function uuidv4() {
  return "".concat(1e7, "-", 1e3, "-", 4e3, "-", 8e3, "-", 1e11).replace(/[018]/g, function (c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
  });
}
function uuidb64() {
  return btoa(uuidv4());
}
// ignores text elements and whitespace
/** @param {Element} dst @param {Element} src */
function sync_attributes(dst, src) {
  var _iterator29 = _createForOfIteratorHelper(src.attributes),
    _step29;
  try {
    for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
      var attr = _step29.value;
      if (src.getAttribute(attr.name) !== dst.getAttribute(attr.name)) dst.setAttribute(attr.name, attr.value);
    }
  } catch (err) {
    _iterator29.e(err);
  } finally {
    _iterator29.f();
  }
  var _iterator30 = _createForOfIteratorHelper(dst.attributes),
    _step30;
  try {
    for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
      var attr = _step30.value;
      if (!src.hasAttribute(attr.name)) dst.removeAttribute(attr.name);
    }
  } catch (err) {
    _iterator30.e(err);
  } finally {
    _iterator30.f();
  }
}
// ignores text elements and whitespace
/** @param {Element} dst @param {Element} src */
function sync_dom(dst, src, opts) {
  opts = Object.assign({
    attrs: true
  }, opts);
  if (!(src && dst && src.nodeName === dst.nodeName)) throw new Error("src and dst must match nodeName to sync");
  if (opts.attrs) {
    sync_attributes(dst, src);
  }
  if (src.children.length == 0 && dst.children.length == 0) {
    set_inner_html(dst, src.innerHTML);
    return;
  }
  var get_id = function get_id(el) {
    return opts.get_id ? opts.get_id(el) : el.getAttribute("data-id") || el.id;
  };
  var dst_children = _toConsumableArray(dst.children);
  var i;
  for (i = 0; i < src.children.length; i++) {
    var src_c = src.children[i];
    var src_id = get_id(src_c);
    if (src_id) {
      var dst_c_index = dst_children.findIndex(function (c) {
        return get_id(c) === src_id;
      });
      if (dst_c_index != -1 && dst_c_index != i) {
        dst_children.splice(i, 0, dst_children.splice(dst_c_index, 1));
      }
    }
    var dst_c = dst_children[i];
    var same = src_c && dst_c && src_c.nodeName === dst_c.nodeName;
    if (!same) {
      if (dst_c) {
        dst_c.remove();
        dst_c = null;
      }
      if (src_c) dst_c = src_c.cloneNode(true);
    }
    if (dst_c) {
      if (!dst.children[i]) dst.append(dst_c);else if (dst.children[i] !== dst_c) dst.children[i].before(dst_c);
    }
    if (same) {
      sync_dom(dst_c, src_c);
    }
  }
  var leftovers = _toConsumableArray(dst.children).slice(i);
  var _iterator31 = _createForOfIteratorHelper(leftovers),
    _step31;
  try {
    for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
      var dst_c = _step31.value;
      dst_c.remove();
    }
  } catch (err) {
    _iterator31.e(err);
  } finally {
    _iterator31.f();
  }
}
/* sync_contents(dst, src_children_or_inner_html) {
    if (typeof src_children_or_inner_html === "string") {
        set_inner_html(dst, src_children_or_inner_html);
        return;
    }
    var src_children = src_children_or_inner_html;
    if (!Array.isArray(src_children)) src_children = [src_children];
    for (var i=0; i<src_children.length; i++) {
        var dst_c = dst.children[i];
        var src_c = src_children[i];
        if (dst_c && src_c && dst_c.nodeName === src_c.nodeName) {
            sync_dom(dst_c, src_c);
        } else {
            if (dst_c) {
                dst_c.before(src_c);
                dst_c.remove();
            } else {
                dst.append(src_c);
            }
        }
    }
    var leftovers = [...dst.children].slice(i);
    for (var e of leftovers) {
        e.remove();
    }
} */

/** @param {Element} el */
function get_anchor_same_origin_hash(el) {
  var url = get_anchor_url(el);
  if (url && url.origin + url.pathname === window.location.origin + window.location.pathname && url.hash) return url.hash;
}

/** @param {Element} el */
function get_anchor_url(el) {
  if (!el.matches("a")) return;
  /** @type {HTMLAnchorElement} */
  var anchor = el;
  return _try(function () {
    return new URL(anchor.href);
  });
}

/** @param {Element} el */
function reset_style(el) {
  var props = [];
  for (var i = 0; i < el.style.length; i++) props[i] = el.style[i];
  for (var _i = 0, _props = props; _i < _props.length; _i++) {
    var k = _props[_i];
    el.style[k] = "";
  }
}
var _on_message = /*#__PURE__*/new WeakMap();
var WindowCommunicator = /*#__PURE__*/function () {
  /** @param {Window} _window */
  function WindowCommunicator(_window) {
    var _this27 = this;
    _classCallCheck(this, WindowCommunicator);
    _defineProperty(this, "id", 0);
    _defineProperty(this, "requests", {});
    _defineProperty(this, "handlers", {});
    _classPrivateFieldInitSpec(this, _on_message, void 0);
    this.window = _window = _window || window;
    _window.addEventListener("message", _classPrivateFieldSet(_on_message, this, /*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(e) {
        var _e$data, request, data, id, response, payload, _e$data2;
        return _regeneratorRuntime().wrap(function _callee4$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              if (!(e.data.event === "request")) {
                _context10.next = 8;
                break;
              }
              _e$data = e.data, request = _e$data.request, data = _e$data.data, id = _e$data.id;
              if (!_this27.handlers[request]) {
                _context10.next = 6;
                break;
              }
              _context10.next = 5;
              return Promise.resolve(_this27.handlers[request](data, e.source)).then(function (r) {
                return response = r;
              });
            case 5:
              if (response !== undefined) {
                payload = {
                  event: "response",
                  response: response,
                  id: id
                };
                e.source.postMessage(payload, "*");
              }
            case 6:
              _context10.next = 9;
              break;
            case 8:
              if (e.data.event === "response") {
                // console.log(e.data)
                _e$data2 = e.data, id = _e$data2.id, response = _e$data2.response;
                if (id in _this27.requests) {
                  _this27.requests[id](response);
                  delete _this27.requests[id];
                }
              }
            case 9:
            case "end":
              return _context10.stop();
          }
        }, _callee4);
      }));
      return function (_x3) {
        return _ref10.apply(this, arguments);
      };
    }()));
  }
  /** @param {string} request @param {function(any,Window):any} handler */
  return _createClass(WindowCommunicator, [{
    key: "on",
    value: function on(request, handler) {
      this.handlers[request] = handler;
    }
    /** @param {Window} window */
  }, {
    key: "request",
    value: function request(window, _request, data) {
      var _this28 = this;
      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;
      var id = ++this.id;
      var payload = {
        event: "request",
        request: _request,
        data: data,
        id: id
      };
      return promise_timeout(new Promise(function (resolve) {
        _this28.requests[id] = function (response) {
          resolve(response);
        };
        window.postMessage(payload, "*");
      }), timeout)["catch"](function (e) {
        console.warn("timed out", payload);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.window.removeEventListener("message", _classPrivateFieldGet(_on_message, this));
    }
  }]);
}();
var ScrollOverlay = /*#__PURE__*/_createClass(function ScrollOverlay(el, opts) {
  _classCallCheck(this, ScrollOverlay);
  /** @type {import("overlayscrollbars").Options} */
  var os_opts = {};
  if (opts.hide) {
    os_opts.scrollbars = {};
    os_opts.scrollbars.autoHide = "move";
  }
  if (opts.x || opts.y) {
    os_opts.overflow = {};
    os_opts.overflow.x = opts.x ? "scroll" : "hidden";
    os_opts.overflow.y = opts.y ? "scroll" : "hidden";
  }
  this.overlayScrollbars = OverlayScrollbars(el, os_opts);
  this.viewport = this.overlayScrollbars.elements().viewport;
  if (opts.flex) this.viewport.style.display = "flex";
});

/** @param {HTMLIFrameElement} el */
function iframe_ready(el) {
  return new Promise(function (resolve) {
    var _check = function check() {
      var doc = el.contentDocument || el.contentWindow.document;
      if (doc.readyState == 'complete') resolve();else setTimeout(_check, 100);
    };
    _check();
  });
}

/** @template T @param {Node} el @param {string} selector @param {new()=>T} type @returns {Iterable<T>} */
function find(el, selector, type) {
  var _iterator32, _step32, c;
  return _regeneratorRuntime().wrap(function find$(_context11) {
    while (1) switch (_context11.prev = _context11.next) {
      case 0:
        if (el instanceof HTMLElement) {
          _context11.next = 2;
          break;
        }
        return _context11.abrupt("return");
      case 2:
        if (!el.matches(selector)) {
          _context11.next = 7;
          break;
        }
        _context11.next = 5;
        return el;
      case 5:
        _context11.next = 24;
        break;
      case 7:
        _iterator32 = _createForOfIteratorHelper(el.querySelectorAll(selector));
        _context11.prev = 8;
        _iterator32.s();
      case 10:
        if ((_step32 = _iterator32.n()).done) {
          _context11.next = 16;
          break;
        }
        c = _step32.value;
        _context11.next = 14;
        return c;
      case 14:
        _context11.next = 10;
        break;
      case 16:
        _context11.next = 21;
        break;
      case 18:
        _context11.prev = 18;
        _context11.t0 = _context11["catch"](8);
        _iterator32.e(_context11.t0);
      case 21:
        _context11.prev = 21;
        _iterator32.f();
        return _context11.finish(21);
      case 24:
      case "end":
        return _context11.stop();
    }
  }, _marked, null, [[8, 18, 21, 24]]);
}

export { AutoSizeController, Dt as ClickScrollPlugin, api as Cookie, LocalStorageBucket, OverlayScrollbars, ScrollOverlay, It as ScrollbarsHidingPlugin, Et as SizeObserverPlugin, TouchListener, UI, WebSocket2 as WebSocket, WindowCommunicator, autosize, build_table, clone_document_head, closest, cycle_select, debounce_next_frame, decode_html_entities, detect_wrapped_elements, download, _empty as empty, encode_html_entities, escape_html_entities, fetch, find, fix_options, get_anchor_same_origin_hash, get_anchor_url, get_index, get_owner_window, get_top_position, get_value, has_focus, has_touch_screen, iframe_ready, insert_after, insert_at, is_html, is_scrollbar_visible, is_visible, move, on_click_and_hold, on_stylesheet_load, open_file_dialog, parse_style, read_file, rebuild, render_html, reset_style, restart_animation, scroll_percent, scroll_pos_from_bottom, scroll_to, select_text, set_attribute, set_children, set_inner_html, set_select_options, set_style_property, set_text, set_value, sync_attributes, sync_dom, tippy, toggle_attribute, toggle_class, upload, uuidb64, uuidv4 };
//# sourceMappingURL=dom.mjs.map
