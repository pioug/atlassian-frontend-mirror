import { code, md } from '@atlaskit/docs';

export default md`
  Previously [navigation next](/packages/design-system/navigation-next) was used both as the component that powers navigation,
  and for the page layout.
  There are three migration steps that are currently in the works.

  ## Step one (available now)

  Replacing the top level vertical navigation in navigation next with the horizontal Atlassian navigation.
  You can find a [live example in the navigation next docs](/examples/design-system/navigation-next/experimental-app-navigation).

  1. Replace \`globalNavigation\` with the horizontal navigation component from this library
  1. Add \`experimental_horizontalGlobalNav\` prop
  1. 🥓🥓 get new horizontal navigation experience

  Assuming \`AtlassianNavigition\` is a new component composed from this library:

  ${code`
import { LayoutManagerWithViewController } from '@atlaskit/navigation-next';

<LayoutManagerWithViewController
-  globalNavigation={DefaultGlobalNavigation}
+  globalNavigation={AtlassianNavigation}
+  experimental_horizontalGlobalNav
/>
  `}

  ## Step two (in development)

  Okay so we've replaced the top level vertical navigation with a new top level horizontal navigation.
  Now we are going to replace the side navigation from navigation next with a new lighter weight equivlent package -
  \`@atlaskit/side-navigation\` -
  but keep using the page layout behaviour from Navigation next.

  Side navigation is still under development -
  but as we defined above the migration strategy will follow a similar pattern of slowing breaking down parts of Navigation next into smaller pieces.

  ## Step three (in planning)

  Now we have the entire page layout to replace.
  After doing this we can completely remove navigation next from your product.
  We will introduce a new component \`@atlaskit/page-layout\` which will be responsible for positioning the header,
  side navigation,
  help fly out menu,
  page banner,
  and page content.

  This migration will be a little tricker because it completely removes the navigation next from your product,
  and replaces it with a composed page layout,
  horizontal nav,
  and side nav.
`;
