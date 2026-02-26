Icon labels are used to describe what the icon is so the visually impaired can be described what the
UI element is. There are cases where icons should have labels as well as cases where they shouldn't
be labelled.

## Examples

This rule will find violations for when an icon label is or isn't needed when composed with other
Design System components.

### Incorrect

```js
import DashboardIcon from '@atlaskit/icon/glyph/dashboard'

<DashboardIcon>
^^^^^^^^^^^^^^^ missing `label` prop

<Button iconLeft={<DashboardIcon label="">} />
                                 ^^^^^ label should be defined

<ButtonItem iconBefore={<DashboardIcon label="">}>
                                       ^^^^^ label should not be defined
  My dashboard
</ButtonItem>
```

### Correct

```js
import DashboardIcon from '@atlaskit/icon/glyph/dashboard'

<DashboardIcon label="Dashboard">

<Button iconLeft={<DashboardIcon label="Add">} />

<ButtonItem iconBefore={<DashboardIcon label="">}>
  My dashboard
</ButtonItem>
```
