'use strict';

const codes = {
  escape: '\x1b[',
  queryPosition: '6n',
  reset: '0m',
  resetBgColor: '49m',
  resetFgColor: '39m',
  screen: {
    clear: '0J'
  },
  cursor: {
    show: '?25h',
    hide: '?25l',
    save: 's',
    restore: 'u',
    move: function(x, y) {
      return (parseInt(y) + 1).toString() + ';' +
        (parseInt(x) + 1).toString() + 'H';
    }
  },
  color: {
    bg: function(color) {
      return '48;5;' + color + 'm';
    },
    fg: function(color) {
      return '38;5;' + color + 'm';
    }
  },
  styles: {
    bold: ['21m', '1m'],
    dim: ['22m', '2m'],
    italic: ['23m', '3m'],
    underline: ['24m', '4m'],
    blink: ['25m', '5m'],
    inverse: ['27m', '7m'],
    hidden: ['28m', '8m'],
    strikethrough: ['29m', '9m']
  }
};

module.exports = codes;