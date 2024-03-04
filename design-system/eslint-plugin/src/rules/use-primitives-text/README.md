Using primitives allows you to delete bespoke component code and replace it with ready made solutions made by the Atlassian Design System Team.

## Examples

This rule marks code as violations when it can be replaced 1:1 with one or multiple primitive components.

### Incorrect

```jsx
<span>text</span>
^^^^^^
<p>text</p>
^^^
<strong>text</strong>
^^^^^^^^
<em>text</em>
^^^^
```

### Correct

```jsx
<Text>text</Text>
<Text as="p">text</Text>
<Text as="strong">text</Text>
<Text as="em">text</Text>
```

Currently, the rule is extremely defensive, only reporting on `span`, `p`, `strong` and `em` elements that don't have any props outside of `key`, `id` and `data-testid`. For `span` elements we're only targeting instances that almost certainly only have text as children.
