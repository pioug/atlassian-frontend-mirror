Ensures that icon-only Atlassian Design System buttons do not have an empty accessible name.

`IconButton` and `LinkIconButton` render no visible text, so the `label` prop is the accessible name
available to screen reader users. TypeScript requires the prop, but it still permits empty values.
This rule checks that the label is non-empty.

## Examples

### Incorrect

```tsx
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CrossIcon} label="" onClick={onClose} />;
```

```tsx
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label="   " />;
```

### Correct

```tsx
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CrossIcon} label="Close" onClick={onClose} />;
```

```tsx
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={ShowMoreIcon} label={formatMessage(messages.moreActions)} />;
```

## Scope

The rule checks the `label` prop on `IconButton` and `LinkIconButton` imported from:

- `@atlaskit/button/icon/button`
- `@atlaskit/button/icon/link`
- `@atlaskit/button/new`

It reports statically empty values, including empty or whitespace-only strings, empty template
literals, `null`, `undefined`, and `false`. Dynamic values such as variables, function calls,
elements, and interpolated templates are not evaluated because their runtime value cannot be
determined safely by a static rule.
