Utility icons are to be phased out by the Design system team. We instead encourage using core icon
with our new size prop. [Docs link](https://atlassian.design/components/icon/usage).

## Examples

This rule checks for usage of utility icons and enforces using their core counterparts.

### Incorrect

```js
import AddIcon from '@atlaskit/icon/utility/add';

<AddIcon label="" />;
```

### Correct

```js
import AddIcon from '@atlaskit/icon/core/add';

<AddIcon label="" size="small" />;
```
