# Navigation-next

# Moving to Nav v3

Atlassian is moving to a new navigation experience, which includes horizontal global navigation, and re-built navigation components to replace navigation-next.

For a guide on how to upgrade from `navigation-next` to the new navigation components, follow [this guide on the atlaskit website](https://atlaskit.atlassian.com/packages/navigation/atlassian-navigation/docs/migrating-from-navigation-next).

# Entrypoints

These are entrypoints for specific components to be used carefully by the consumers. If you're using one of these entrypoints we are assuming you know what you are doing. So it means that code-splitting and tree-shaking should be done on the consumer/product side.

## How to use it

```js
import LayoutManagerWithViewController from '@atlaskit/navigation-next/LayoutManagerWithViewController';
```

## Exposed entrypoints

- `atlaskit/navigation-next/LayoutManagerWithViewController`
- `atlaskit/navigation-next/ItemsRenderer`
- `atlaskit/navigation-next/SkeletonContainerView`
- `atlaskit/navigation-next/NavigationProvider`
- `atlaskit/navigation-next/AsyncLayoutManagerWithViewController`
- `atlaskit/navigation-next/GlobalNavigationSkeleton`
- `atlaskit/navigation-next/view-controller`
- `atlaskit/navigation-next/ui-controller`
