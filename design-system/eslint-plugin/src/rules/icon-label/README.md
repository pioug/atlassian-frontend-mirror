# @atlaskit/eslint-plugin-design-system/icon-label

Enforces accessible usage of icon labels when composed with other Design System components.

## Examples

👎 Example of **incorrect** code for this rule:

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'

<ActivityIcon>
^^^^^^^^^^^^^^ missing `label` prop
```

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'

<Button iconLeft={<ActivityIcon label="">} />
                                ^^^^^ label should be defined
```

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'

<ButtonItem iconBefore={<ActivityIcon label="">}>
                                      ^^^^^ label should not be defined
  My activity
</ButtonItem>
```

👍 Example of **correct** code for this rule:

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'

<ActivityIcon label="Activity">
```

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'

<Button iconLeft={<ActivityIcon label="Activity">} />
```

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'

<ButtonItem iconBefore={<ActivityIcon label="">}>
  My activity
</ButtonItem>
```
