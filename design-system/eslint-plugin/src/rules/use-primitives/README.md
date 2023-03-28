# @atlaskit/eslint-plugin-design-system/use-primitives

This rule provides a suggestion to Design System consumers to be made aware of ready-made solutions.

## Examples

👎 Example of **incorrect** code for this rule:

```js
<div />
^^^^^^^
```

```js
<Component>
  <div css={someStyles}></div>
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
</Component>
```

👍 Example of **correct** code for this rule:

```js
<Box />
```

```js
<Component>
  <Box css={someStyles}></Box>
</Component>
```
