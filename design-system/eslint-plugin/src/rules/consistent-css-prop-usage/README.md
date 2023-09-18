> Ensures consistency with CSS prop usage.

## Rationale

Every product should be defining styles in the same way, using the same tools, enforced by the same linting rules, which we can then all evolve and scale together.

## How the rule works

This rule checks for the following cases:

- When styles are defined inline.
- When styles are not using `css` object api.
- When styles are coming from outside of the module i.e. using imports.
- When styles are spread inside another styles and not using array composition.

All the above can also work for custom `css` functions, such as `xcss` (https://atlassian.design/components/primitives/xcss/).

This rule has options - see below.

## Examples

👎 Example of **incorrect** code for this rule:

```js
function Button({ children }) {
  return <div css={css({...})}>{children}</div>;
                   ^^^^^^^ css function call used inline (performance issue)
}
```

```js
const container = {
      ^^^^^^^^^ should be a css function call
  zIndex: 10,
};

function Button({ children }) {
  return <button css={container}>{children}</button>;
}
```

```js
import { container } from './styles';
         ^^^^^^^^^ styles should be local, not shared

function Button({ children }) {
  return <button css={container}>{children}</button>;
}
```

```js
const baseContainerStyles = css({
  zIndex: 5,
});

const containerStyles = css({
  ...baseContainerStyles,
  ^^^^^^^^^^^^^^^^^^^^^^ compose styles by providing an array to the css call instead (see example below)
  zIndex: 7,
});

function Button({ children }) {
  return <button css={containerStyles}>{children}</button>;
}
```

👍 Example of **correct** code for this rule:

```js
const containerStyles = css({
  zIndex: 1,
});

function Button({ children }) {
  return <button css={containerStyles}>{children}</button>;
}
```

```js
const baseContainerStyles = css({
  zIndex: 5,
});

const containerStyles = css({
  zIndex: 7,
});

function Button({ children }) {
  return (
    <button css={[baseContainerStyles, containerStyles]}>{children}</button>
  );
}
```

## Options

This rule comes with options to support different repository configurations.

### cssFunctions

An array of function names the linting rule should target. Defaults to `['css', 'xcss']`.

### stylesPlacement

The rule prevents inline styles from being created. This option defines what the error message should say: "(...) styles at the top (...)" or "(...) styles at the bottom (...)".
Defaults to `top`.
