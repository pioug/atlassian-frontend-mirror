# Reduced UI Pack

This package exports a CSS file which includes some CSS classes that provide
styling for a reduced number of Atlaskit components.

There is also an icon SVG sprite sheet included. See the "Try it out" section
below for usage instructions.

## Installation

```sh
npm install reduced-ui-pack
```

Make sure you're also including the `css-reset` stylesheet before these styles.
The `css-reset` stylesheet provides the core typography rules which
`reduced-ui-pack` builds upon. Install it with:

```sh
npm install @atlaskit/css-reset
```

## Using the component

### Importing

The `reduced-ui-pack` package can be consumed via the dist, or in Webpack.

#### Importing in Webpack

```js
import 'reduced-ui-pack';
```

The Webpack style loader should then place the CSS within the HEAD of your HTML
element.

#### Importing in HTML

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="node_modules/@atlaskit/css-reset/dist/bundle.css"
    />
    <link
      rel="stylesheet"
      href="node_modules/reduced-ui-pack/dist/bundle.css"
    />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```
