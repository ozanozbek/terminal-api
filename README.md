# terminal-api

[Installation](#installation-) |
[Usage](#usage-) |
[API](#api-) |
[Colors](#colors-) |
[Styles](#styles-) |
[License](#license-)

terminal-api is a terminal wrapper, providing easy access without ANSI codes or dirty details.
- Manages terminal states
- Handles position, color and styling
- Supports 256 color
- No dependencies

# []()

### Installation [^](#terminal-api)
```bash
npm install --save terminal-api
```

# []()

### Usage [^](#terminal-api)
```javascript
const TerminalApi = require('terminal-api');

// initialize
const t = new TerminalApi();

// clear screen
t.clear();

// show/hide cursor
t.setCursor(false);

// set background/foreground color
t.setBgColor(t.colors.basic.magenta);
t.setFgColor(t.colors.rgb6(4, 5, 1));

// set styles
t.setStyles({bold: true, underline: true});

// set position
t.setPosition(10, 5);

// write
t.write('Hello world!');

// shortcut methods
t.w('Goodbye world!', {
    x: 10, y: 7,
    bgColor: t.colors.basic.white,
    fgColor: t.colors.gray[3],
    styles: ['strikethrough', 'dim'],
    wrap: true
});
```
Also, run [examples/demo.js](examples/demo.js) to see a more colorful example:

```bash
node examples/demo.js
```
# []()

### API [^](#terminal-api)

#### constructor(stream, encoding) [^](#api-)

> Creates terminal-api instance.
> * **stream**: WritableStream. Default: `process.stdout`
> * **encoding**: String. Default: `'utf8'`

#### setStream(stream) [^](#api-)

> Sets stream.
> * **stream**: WritableStream. Default: `process.stdout`

#### setEncoding(encoding) [^](#api-)

> Sets encoding.
> * **encoding**: String. Default: `'utf8'`

#### setOptions(options, force) [^](#api-)

> Sets multiple options at a time.
> * **options**: Object. Possible keys: `wrap`, `x`, `y`, `bgColor`, `fgColor`, `cursor`, `styles`
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setWrap(wrap) [^](#api-)

> Enables/disables wrapping at the end of the line.
> * **wrap**: Boolean. Default: `true`

#### setPosition(x, y, force) [^](#api-)

> Sets cursor position.
> * **x**: Number. Default: `0`
> * **y**: Number. Default: `0`
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setX(x, force) [^](#api-)

> Sets cursor x position.
> * **x**: Number. Default: `0`
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setY(y, force) [^](#api-)

> Sets cursor y position.
> * **y**: Number. Default: `0`
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setBgColor(color, force) [^](#api-)

> Sets background color. See [Colors](#colors) for more information.
> * **color**: Number.
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setFgColor(color, force) [^](#api-)

> Sets foreground color. See [Colors](#colors) for more information.
> * **color**: Number.
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### resetBgColor(force) [^](#api-)

> Resets background color to terminal default.
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### resetFgColor(force) [^](#api-)

> Resets foreground color to terminal default.
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setCursor(cursor, force) [^](#api-)

> Shows/hides cursor.
> * **cursor**: Boolean. Default: `true`
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### setStyles(styles, force) [^](#api-)

> Enables/disables multiple styles at once. See [Styles](#styles-) for more information.
> * **styles**: Object. Should be structured as {styleName: styleState}
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### enableStyles(styleList, force) [^](#api-)

> Enables multiple styles at once. See [Styles](#styles-) for more information.
> * **styleList**: Array. List of style names.
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### disableStyles(styleList, force) [^](#api-)

> Disables multiple styles at once. See [Styles](#styles-) for more information.
> * **styleList**: Array. List of style names.
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

#### reset() [^](#api-)

> Resets terminal and instance state.

#### clear() [^](#api-)

> Clears terminal.

#### write(text) [^](#api-)

> Writes text on terminal.
> * **text**: String.

#### w(text, options, revert, force) [^](#api-)

> Shortcut method for changing options, writing text, and optionally reverting options back.
> * **text**: String.
> * **options**: Object. See `setOptions` method.
> * **revert**: Boolean. Whether to revert options back after writing. Default: `false`
> * **force**: Boolean. Forces operation even if not needed. Default: `false`

# []()

### Colors [^](#terminal-api)

Color availability and representations might differ between systems and configurations. For maximum compatibility, only **basic** and **bright** colors should be used.

Even though there are 256 colors, it's not the usual 256 color space. On most systems, these color groups partially overlap with each other.

While terminal-api accepts only color codes, `colors` object provides access to color codes in a user-friendly way. It can be accessed from class or instance:
```javascript
const TerminalApi = require('terminal-api');
const colors = TerminalApi.colors;
// or
const t = new TerminalApi();
const colors = t.colors;
```
`colors` object is structured as:
```javascript
const colors = {
  basic: { /* black, red, green, yellow, blue, magenta, cyan, white */ },
  bright: { /* black, red, green, yellow, blue, magenta, cyan, white */ },
  gray: [/* 0, ..., 23 */]
};
```

Also, it has a minimal API.

#### Colors API [^](#colors-)

##### rgb6(r, g, b)

> Returns color code for given rgb values of 256 colors.
> * **r**: Number. Must be in range 0 - 5. Default: `0`
> * **g**: Number. Must be in range 0 - 5. Default: `0`
> * **b**: Number. Must be in range 0 - 5. Default: `0`


##### rgb256(r, g, b)

> Returns closest color code for given rgb values of 16M colors.
> * **r**: Number. Must be in range 0 - 255. Default: `0`
> * **g**: Number. Must be in range 0 - 255. Default: `0`
> * **b**: Number. Must be in range 0 - 255. Default: `0`

##### rgb256Hex(hex)

> Returns closest color code for given rgb values of 16M colors.
> * **hex**: String. Must be hexadecimal RGB code. Default: `000000`

#### Usage [^](#colors-)

```javascript
const TerminalApi = require('terminal-api');
const t = new TerminalApi();
t.setBgColor(t.colors.basic.magenta);
t.setFgColor(t.colors.rgb256Hex('#ff9900'));
```

# []()

### Styles [^](#terminal-api)

Available styles: `'bold'`, `'dim'`, `'italic'`, `'underline'`, `'blink'`, `'inverse'`, `'hidden'`, `'strikethrough'`

Style availability depends on system. For maximum compatibility, only **bold**, **underline** and **reverse** should be used.

# []()

### License [^](#terminal-api)
[MIT](https://github.com/ozanozbek/terminal-api/blob/master/LICENSE)
