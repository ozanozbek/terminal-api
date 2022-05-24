'use strict';

const EventEmitter = require('events');

const colors = require('./colors');
const codes = require('./codes');
const writer = require('./writer');

const TerminalApi = class extends EventEmitter {
  static get colors() { return colors; }
  static get codes() { return codes; }
  static get writer() { return writer; }

  constructor(stream, encoding) {
    super();
    this.colors = colors;
    this.codes = codes;
    this.writer = writer;

    this.stream = undefined;
    this.encoding = undefined;

    this.width = undefined;
    this.height = undefined;
    this.state = {};

    this.setStream(stream, false);
    this.setEncoding(encoding);
  }
  _applyEncoding() {
    if (this.stream && this.encoding) {
      this.stream.setDefaultEncoding(this.encoding);
    }
  }
  _resetState(keepPosition = false) {
    this.state = {
      x: keepPosition ? this.state.x : undefined,
      y: keepPosition ? this.state.y : undefined,
      bgColor: undefined,
      fgColor: undefined,
      wrap: true,
      cursor: undefined,
      styles: {}
    };
    Object.keys(codes.styles).forEach((style) => {
      this.state.styles[style] = undefined;
    });
  }
  _writeChar(char = ' ') {
    if (this.state.x < this.width) {
      this.stream.write(this.writer.write(char));
      this.state.x++;
      return true;
    } else if (this.state.wrap && this.state.y < this.height - 1) {
      this.stream.write(this.writer.write(char));
      this.state.y++;
      this.state.x = 0;
      return true;
    }
    return false;
  }
  _onResize(width, height) {
    this.width = this.stream.columns;
    this.height = this.stream.rows;
    this.emit('resize', width, height);
  }
  setStream(stream = process.stdout, _applyEncoding = true) {
    if (this.stream) {
      this.stream.removeListener('resize', this._onResize.bind(this));
    }
    this.stream = stream;
    this.width = this.stream.columns;
    this.height = this.stream.rows;
    this._resetState();
    if (_applyEncoding) {
      this._applyEncoding();
    }
    this.stream.on('resize', this._onResize.bind(this));
  }
  setEncoding(encoding = 'utf8') {
    this.encoding = encoding;
    this._applyEncoding();
  }
  setOptions(options = {}, force = false) {
    Object.keys(options).forEach(key => {
      if (key === 'styles') {
        this.disableStyles(Object.keys(this.codes.styles), force);
      }
      if (Object.keys(this.state).includes(key)) {
        let fn = this['set' + key.charAt(0).toUpperCase() + key.slice(1)];
        fn.apply(this, [options[key], force]);
      }
    });
  }
  setWrap(wrap = true) {
    this.state.wrap = Boolean(wrap);
  }
  setPosition(x = 0, y = 0, force = false) {
    x = Math.min(x, this.width);
    y = Math.min(y, this.height);
    if (force || x !== this.state.x || y !== this.state.y) {
      this.stream.write(this.writer.setPosition(x, y));
      this.state.x = x;
      this.state.y = y;
    }
  }
  setX(x = 0, force = false) {
    this.setPosition(x, this.state.y, force);
  }
  setY(y = 0, force = false) {
    this.setPosition(this.state.x, y, force);
  }
  setBgColor(color, force = false) {
    if (force || this.state.bgColor !== color) {
      this.stream.write(this.writer.setBgColor(color));
      this.state.bgColor = color;
    }
  }
  setFgColor(color, force = false) {
    if (force || this.state.fgColor !== color) {
      this.stream.write(this.writer.setFgColor(color));
      this.state.fgColor = color;
    }
  }
  resetBgColor(force = false) {
    if (force || this.state.bgColor !== undefined) {
      this.stream.write(this.writer.resetBgColor());
      this.state.bgColor = undefined;
    }
  }
  resetFgColor(force = false) {
    if (force || this.state.fgColor !== undefined) {
      this.stream.write(this.writer.resetFgColor());
      this.state.fgColor = undefined;
    }
  }
  setCursor(cursor = true, force = false) {
    if (force || cursor !== this.state.cursor) {
      this.stream.write(
        cursor
        ? this.writer.showCursor()
        : this.writer.hideCursor()
      );
      this.state.cursor = cursor;
    }
  }
  setStyles(styles = {}, force = false) {
    if (!force) {
      styles = Object.keys(styles).filter(
        style => this.state.styles[style] !== styles[style]
      ).reduce((newStyles, style) => {
        newStyles[style] = styles[style];
        return newStyles;
      }, {});
    }
    this.stream.write(this.writer.setStyles(styles));
    for (const style in this.state.styles) {
      this.state.styles[style] = styles[style];
    }
  }
  enableStyles(styleList = [], force = false, _disable = false) {
    styleList = (typeof styleList === 'string') ? [styleList] : styleList;
    this.setStyles(styleList.reduce((newStyles, style) => {
      newStyles[style] = _disable ? false : true;
      return newStyles;
    }, {}));
  }
  disableStyles(styleList = [], force = false) {
    this.enableStyles(styleList, force, true);
  }
  reset() {
    this.stream.write(this.writer.reset());
    this.setCursor(true);
    this._resetState(true);
  }
  clear() {
    this.stream.write(this.writer.clear());
    this.state.x = 0;
    this.state.y = 0;
  }
  write(text = ' ') {
    const chars = String(text).split('');
    let status = true;
    while (status && chars.length) {
      status = this._writeChar(chars.shift());
    }
  }
  w(text = ' ', options = {}, revert = false, force = false) {
    if (revert) {
      const current = {...this.state};
    }
    this.setOptions(options, force);
    this.write(text);
    if (revert) {
      this.setOptions(current, force);
    }
  }
};

module.exports = TerminalApi;