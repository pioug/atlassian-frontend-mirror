import React from 'react';
import { md, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage
    appearance="warning"
    title="Note: @atlaskit/navigation is deprecated."
  >
    Please use @atlaskit/atlassian-navigation instead. <br />
    Additional documentation pages are listed below:
    <br />
    <ul>
      <li>
        <a href="docs/navigation-props">Navigation Props</a>
      </li>
      <li>
        <a href="docs/composing-global-navigation">
          Composing Global Navigation
        </a>
      </li>
      <li>
        <a href="docs/composing-container-navigation">
          Composing Container Navigation
        </a>
      </li>
      <li>
        <a href="docs/navigation-drawers">Navigation Drawers</a>
      </li>
    </ul>
  </SectionMessage>
)}

  # Concepts

  The navigation package is not designed to be a single component, but instead
  a composable navigation layout to sit at the far left of your app, with links
  around your site. It is an opinionated navigation option, with a set minimum width,
  a collapsed and uncollapsed state, and two different sections.

  Note that while it is important to understand these two sections, they are
  included by default in the default export, and for most use-cases this can
  be relied upon to provide these.

  ## The 'global' navigation section

  The global navigation section is to the far left, and is designed only to
  display icons. It has primary actions at the top, and secondary actions at
  the bottom.

  When the navigation is collapsed, the global navigation is hidden, however
  the primary actions are placed at the top of the container navigation.

  The global navigation does not accept any children, and instead takes all
  its internal components as props.

  ## The 'container' navigation section

  The container navigation is the right side of the navigation bar, and is
  where most navigation items should live.

  The container can be collapsed and expanded.

  Unlike the global section, the container renders children, and these make
  up the bulk of the navigation. The children of the default export are passed
  as children to the container.

  ## Navigation Items

  There are two exports designed for use in rendering items to the container
  section. The first is AkNavigationItem, the second is AkNavigationItemGroup,
  which is designed to wrap a collection of AkNavigationItems and provide a
  heading to them.

  ## linkComponent

  Many of the items in navigation accept a linkComponent prop, to allow an
  easy-to-pass generic link solution. By default, this is an anchor tag,
  which takes in a href property, and wraps around elements intended to be
  links.

  AkNavigationItems also accept a link component.

  If you are not relying on the default link, such as if you are using
  react-router to do internal navigation, make sure it is provided consistently,
  and be aware that it will be passed a href prop.

  You should not manually wrap elements in a link if a linkComponent will wrap them.

  ## Drawers

  Drawers are designed to animate in from the left and take the user's focus
  to a task initiated from the navigation menu, without navigating the page.
  These are designed to be initiated the global primary navigation items.
  See the examples for a search drawer and a create drawer.

  ## Nested Navigation

  Nested navigation aims to have multiple sets of containers that can be
  animated in to each other, as well as having navigation to travel back to
  the previous nav.

  ## Controlling collapsing

  Two props control collapsing, both of them boolean. \`isCollapsible\` determines
  whether the menu should be draggable to a closed state. \`isOpen\` sets whether
  the menu is collapsed or not. By default, dragging it closed calls the onResize
  prop, but does not set it to be closed, and to allow the user to drag the
  navigation closed, you will need to make the onResize function change the
  isOpen prop.

  ## Adding Themes

  The package also has two exports that are not components. The first is
  presetThemes, which are an object of the default theming items, so that this
  can be modified and provided to navigation. The second is createGlobalTheme,
  which takes in two arguments, text and background. This function generates
  a theme object for you based on the provided text colour and background colour.

  ## Breaking Changes in \`31.0.0\`

  ### quick-search has been removed

  The quick-search component has been extracted and moved to a separate package.
  If you used AkQuickSearch, AkSearch or quickSearchResultTypes before you will
  have to add the @atlaskit/quick-search dependency and update your imports:

  ${code`
  // Before
  import { AkQuickSearch, AkSearch, quickSearchResultTypes } from '@atlaskit/navigation'

  // After
  import { AkQuickSearch, AkSearch, quickSearchResultTypes } from '@atlaskit/quick-search'
  `}
`;
