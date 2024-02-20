> Ensures consistency with CSS prop usage.

## Rationale

Every product should be defining styles in the same way, using the same tools, enforced by the same linting rules, which we can then all evolve and scale together.

## How the rule works

This rule checks for the following cases:

- Styles should not be defined inline; it should instead be in a standalone variable.
  - The exception for this is style composition (e.g. `<div css={[baseStyles, moreStyles]} />`), which is a way to combine styles from two variables.
- Styles must be wrapped in a `css` function call.
- Styles must be defined in the same file as their usage, and not be imported.
- Styles should not contain spread operators (e.g. `css({ ...spreadStyles })`).
- Styles must all be defined at the top of the file, or at the bottom of the file.
- Styles must be in a variable whose name ends in `styles` (or `Styles`).

This rule also has an autofixer that enforces and fixes the code (where practical) to meet the above requirements.

All the above can also work for custom `css` functions, such as `xcss` (https://atlassian.design/components/primitives/xcss/).

This rule has several options - see below.

## Examples

👎 Example of **incorrect** code for this rule:

**Calling a css/xcss function or direct objects inside the JSX attribute.**

```js
function Button({ children }) {
  return <div css={css({...})}>{children}</div>;
                   ^^^^^^^ css function call used inline (performance issue)
}
```

**Inserting a non css-function based object identifier into a css JSX attribute.**

```js
const container = {
      ^^^^^^^^^ should be a css function call
  zIndex: 10,
};

function Button({ children }) {
  return <button css={container}>{children}</button>;
}
```

**Importing styles from another file.**

```js
import { container } from './styles';
         ^^^^^^^^^ styles should be local, not shared

function Button({ children }) {
  return <button css={container}>{children}</button>;
}
```

**Nesting styles with objects instead of arrays.**

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

**Using the css() function to create a style object that follows the naming convention (ends in Styles) and passing it as a variable into the css={...} JSX attribute.**

With the following options turned on:

- cssFunctions = ['css']
- stylesPlacement = 'top'

```js
const containerStyles = css({
  zIndex: 1,
});

function Button({ children }) {
  return <button css={containerStyles}>{children}</button>;
}
```

**Technically correct usage of the cssMap function.**

With the following options turned on:

- cssFunctions = ['css']
- stylesPlacement = 'top'

```js
const borderStyles = cssMap({
  'solid': '1px solid';
  'none': '0px';
})

function Button({ children }) {
  return <button css={borderStyles[solid]}>{children}</button>;
}
```

**Create composite styles with arrays, not objects.**

With the following options turned on:

- cssFunctions = ['css']
- stylesPlacement = 'bottom'

```js
function Button({ children }) {
  return (
    <button css={[baseContainerStyles, containerStyles]}>{children}</button>
  );
}

const baseContainerStyles = css({
  zIndex: 5,
});

const containerStyles = css({
  zIndex: 7,
});
```

**Ternaries can be used inline**

```js
const baseStyles = css({ color: token('color.text.primary') });
const disabledStyles = css({ color: token('color.text.disabled') });

<div css={props.disabled ? disabledStyles : baseStyles}></div>;
```

## Options

This rule comes with options to support different repository configurations.

### cssFunctions

An array of function names the linting rule should target. Defaults to `['css', 'xcss']`. The functionality of `cssMap` will be linted regardless of the configuration of `cssFunctions`, as it can be used with either attribute.

### stylesPlacement

Either `top` or `bottom`.

The rule prevents inline styles from being created. This option defines what the error message should say: "(...) styles at the top (...)" or "(...) styles at the bottom (...)".
Defaults to `top`.

### cssImportSource

When auto-fixing the contents of the `css` attribute, this rule will wrap CSS styles in a `css(...)` function call or `` css\`...\`  `` template expression, and it will add an import declaration for the `css` function. `cssImportSource` is a string that determines what package `css` should be imported from.

This is `@compiled/react` by default.

### xcssImportSource

When auto-fixing the contents of the `xcss` attribute, this rule will wrap XCSS styles in a `xcss(...)` function call, and it will add an import declaration for the `xcss` function. `xcssImportSource` is a string that determines what package `xcss` should be imported from.

This is `@atlaskit/primitives` by default.

### excludeReactComponents

Whether to exclude `css` attributes of React components from being affected by this ESLint rule. We assume that an element is a React component if its name starts with a capital letter, e.g. `<Button />`.

This is `false` by default.

### fixNamesOnly

When enabled, this rule will only add `styles` at the end of existing style variables. All other autofixers will be disabled. For example:

```tsx
//    vvvvv will be renamed to `myCssStyles`
const myCss = { color: 'blue' };
```

This is `false` by default.
