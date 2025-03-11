Icons are being updated with new designs, a simplified set of available icons and sizes, as well as
more consistent padding and spacing.

The new icon components allows your components to align with the new visual language - either by
default, or when enabled via a feature flag.

Custom icons are no longer supported, and should either be replaced with an existing icon from the
`@atlaskit/icon` or `@atlaskit/icon-lab` packages, or contributed to those packages.

During the migration process, any custom icons that are not third party logos should be moved into a
central location to disable this error and allow the icon to be quickly replaced. What location to
display in the error can be configured via the `legacyIconPackages` option.

Third party logos should use a standard `<svg>` element with a `label`.

## Examples

This rule identifies usages of custom icons from `@atlaskit/icon` or `@atlaskit/icon/base`.

### Incorrect

```js
import Icon from '@atlaskit/icon';
                 ^^^^^^^^^^^^^^^^^ custom icon import

<Icon label="Activity" glyph="...">
^^^^^^^^^^^^^^^^^^^^^^^ custom icon
```

### Correct

```js
import AddIcon from '@atlaskit/icon/core/add';

<AddIcon label="" />;
```
