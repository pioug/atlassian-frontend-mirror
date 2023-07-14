import { code, md } from '@atlaskit/docs';

export default md`
\`@atlaskit/navigation-next\` was deprecated due to:

- Large bundle size
- Poor runtime performance
- Lack of flexibility with layout
- Lack of consumer control of how and where to render the page content

It has been superseded by a composed navigation experience consisting of \`@atlaskit/page-layout\` to layout your application, \`@atlaskit/atlassian-navigation\` for the horizontal nav bar at the top of the screen, and \`@atlaskit/side-navigation\` for the side nav. **All Atlassian products should be using these packages instead — support is no longer provided for** \`@atlaskit/navigation-next\`.

This page intends to serve as a high level conceptual introduction to these packages. Detailed documentation for each can be found below:

- [Page layout](https://atlaskit.atlassian.com/packages/design-system/page-layout)
- [Atlassian navigation](https://atlaskit.atlassian.com/packages/navigation/atlassian-navigation)
- [Side navigation](https://atlaskit.atlassian.com/packages/navigation/side-navigation)
- [Worked example of all packages used together](https://atlaskit.atlassian.com/examples/design-system/page-layout/integration-example)

## Laying out your application

Where \`@atlaskit/navigation-next\` used to rely on the rigid and unperformant \`LayoutManager\`, we now have a light-weight and flexible solution in \`@atlaskit/page-layout\` ([docs](https://atlaskit.atlassian.com/packages/design-system/page-layout)). \`@atlaskit/page-layout\` can be used to wrap your entire app and help split the viewport into sections where you can render components in slots such as \`Banner\`, \`TopNavigation\`, \`Main\`, \`LeftSidebar\`, and more. It also provides valuable accessibility improvements to your application with support for [skip links](https://atlaskit.atlassian.com/packages/design-system/page-layout/docs/skip-links).

## Standardised top navigation

The role that used to be played by the deprecated \`@atlaskit/global-navigation\` is now played by \`@atlaskit/atlassian-navigation\` ([docs](https://atlaskit.atlassian.com/packages/navigation/atlassian-navigation)). This provides a well-structured, cohesive and performant navigation experience that is used across all Atlassian products.

\`@atlaskit/atlassian-navigation\` slots into the \`TopNavigation\` section in \`PageLayout\`.

If you're still using \`@atlaskit/navigation-next\`, it is also possible to incrementally adopt \`@atlaskit/atlassian-navigation\` by using the \`experimental_horizontalGlobalNav\` prop.

${code`
import { LayoutManagerWithViewController } from '@atlaskit/navigation-next';
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation';

<LayoutManagerWithViewController
-  globalNavigation={DefaultGlobalNavigation}
+  globalNavigation={AtlassianNavigation}
+  experimental_horizontalGlobalNav
/>
`}

However, it is **strongly recommended** that you adopt the full suite of navigation components together as ongoing support for \`@atlaskit/navigation-next\` will not be provided.

## Contextual, product-specific navigation

Previously contextual navigation was handled by passing in content to the \`productNavigation\` prop in \`@atlaskit/navigation-next\`'s \`LayoutManager\`. Now, it belongs in the dedicated \`@atlaskit/side-navigation\` package ([docs](https://atlaskit.atlassian.com/packages/navigation/side-navigation)).

## Need help?

Reach out to !disturbed in #help-design-system.
`;
