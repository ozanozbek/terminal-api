'use strict';

const TerminalApi = require('../source/terminal-api');

const getRandomNumber = (min = 0, max = 6) => (
  Math.floor(Math.random() * max) + min
);

const getRandomColor = () => TerminalApi.colors.rgb6(
  getRandomNumber(), getRandomNumber(), getRandomNumber()
);

const getRandomGrayColor = () => TerminalApi.colors.gray[
  getRandomNumber(0, 24)
];

const drawBorders = () => {
  for (let y of [0, t.height - 1]) {
    for (let x = 0; x < t.width; x++) {
      t.w('█', {x, y, fgColor: getRandomColor()});
    }
  }
  for (let x of [0, t.width - 1]) {
    for (let y = 1; y < t.height - 1; y++) {
      t.w('█', {x, y, fgColor: getRandomColor()});
    }
  }
};

const writeTitle = (title) => {
  title.split('').forEach((char, i) => {
    t.w(char, {
      x: (t.width / 2) - title.length + (i * 2),
      y: t.height / 2,
      fgColor: t.colors.gray[23 - ((stepNum % 8) * 3)]
    });
  });
};

const step = () => {
  stepNum++;
  drawBorders();
  writeTitle('terminal-api');
};

let stepNum = 0;
const intervalTime = 20;
const t = new TerminalApi();
t.setCursor(false);
t.clear();
let interval = setInterval(step, intervalTime);