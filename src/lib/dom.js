export default {

  // Converts a CSS positioning string for the specified element to pixels.
  convertToPixels(element, value) {
    var pixelsRE = /^-?\d+(\.\d+)?(px)?$/i;
    var numberRE = /^-?\d+(\.\d+)?/i;
    return parseFloat(value) || 0;
  },

  getComputedStyle(el) {
    return document.defaultView.getComputedStyle(el, null);
  },

  getDimension(element, cssPropertyName, jsPropertyName) {
    var computedStyle = this.getComputedStyle(element);
    var value = '0';
    if (computedStyle) {
      if (computedStyle.getPropertyValue) {
        value = computedStyle.getPropertyValue(cssPropertyName);
      } else {
        // IE8
        value = computedStyle.getAttribute(jsPropertyName);
      }
    }
    return this.convertToPixels(element, value);
  },

  getBorderLeftWidth(element) {
    return this.getDimension(element, 'border-left-width', 'borderLeftWidth');
  },

  getBorderTopWidth(element) {
    return this.getDimension(element, 'border-top-width', 'borderTopWidth');
  },

  getBorderRightWidth(element) {
    return this.getDimension(element, 'border-right-width', 'borderRightWidth');
  },

  getBorderBottomWidth(element) {
    return this.getDimension(element, 'border-bottom-width', 'borderBottomWidth');
  },

  getPaddingLeft(element) {
    return this.getDimension(element, 'padding-left', 'paddingLeft');
  },

  getPaddingTop(element) {
    return this.getDimension(element, 'padding-top', 'paddingTop');
  },

  getPaddingRight(element) {
    return this.getDimension(element, 'padding-right', 'paddingRight');
  },

  getPaddingBottom(element) {
    return this.getDimension(element, 'padding-bottom', 'paddingBottom');
  },

  getMarginLeft(element) {
    return this.getDimension(element, 'margin-left', 'marginLeft');
  },

  getMarginTop(element) {
    return this.getDimension(element, 'margin-top', 'marginTop');
  },

  getMarginRight(element) {
    return this.getDimension(element, 'margin-right', 'marginRight');
  },

  getMarginBottom(element) {
    return this.getDimension(element, 'margin-bottom', 'marginBottom');
  },

  getTopLeftOffset(element) {
    // and added borders to the mix
    var offsetParent = element.offsetParent, top = element.offsetTop, left = element.offsetLeft;

    while ((element = element.parentNode) !== null && element !== document.body && element !== document.documentElement) {
      top -= element.scrollTop;
      var c = this.getComputedStyle(element);
      if (c) {
        left -= c.direction !== 'rtl' ? element.scrollLeft : -element.scrollLeft;
      }

      if (element === offsetParent) {
        left += this.getBorderLeftWidth(element);
        top += this.getBorderTopWidth(element);
        top += element.offsetTop;
        left += element.offsetLeft;
        offsetParent = element.offsetParent;
      }
    }

    return {
      left: left,
      top: top
    };
  },

  // Gets the height of the content of the specified element. The content height does not include borders or padding.
  getContentHeight(element) {
    var border = this.getBorderTopWidth(element) + this.getBorderBottomWidth(element);
    var padding = this.getPaddingTop(element) + this.getPaddingBottom(element);
    return element.offsetHeight - border - padding;
  }
}