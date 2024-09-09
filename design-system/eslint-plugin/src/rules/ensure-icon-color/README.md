In an upcoming release of `@atlaskit/icon`, new icon components in `@atlaskit/icon/core`,
`@atlaskit/icon/utility` and `@atlaskit/icon-lab` are being updated so the default value of `color`
is `currentColor`.

To assist with migration, this lint rule requires the `color` prop to be set.

## Examples

This rule will find violations when an icon doesn't have the `color` prop set explicitly.

### Incorrect

```js
import AddIcon from '@atlaskit/icon/core/add'

<AddIcon label="">
^^^^^^^^^^^^^^ missing `color` prop
```

### Correct

```js
import AddIcon from '@atlaskit/icon/core/add';
import {token} from '@atlaskit/token';

<AddIcon label="" color={token('color.icon', '#44546F')} >
```
