sitemap.behavior = sitemap.behavior || {};

sitemap.behavior.mouseWheel = function() {
  var delta, eventName;
  var dispatch = d3.dispatch("wheel");

  function behavior(g) {
    g.on(eventName + ".mouseWheelBehavior", onWheel);
  }

  function onWheel() {
    d3.event.preventDefault();

    dispatch.wheel({
      delta: delta(),
      point: d3.mouse(this),
      ctrlKey: d3.event.ctrlKey,
      shiftKey: d3.event.shiftKey,
      altKey: d3.event.altKey
    });
  }

  if ('onwheel' in window.document) {
    delta = function() {
      return -(d3.event.deltaY || d3.event.deltaX) * (d3.event.deltaMode ? 120 : 1);
    };
    eventName =  'wheel';
  }
  else if ('onmousewheel' in window.document) {
    delta = function() {
      return d3.event.wheelDelta;
    };
    eventName = 'mousewheel';
  }
  else {
    delta = function() {
      return -d3.event.detail;
    };
    eventName = 'MozMousePixelScroll';
  }

  return d3.rebind(behavior, dispatch, 'on');
};
