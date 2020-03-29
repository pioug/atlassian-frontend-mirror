import { code, md } from '@atlaskit/docs';

export default md`
  # 3.x - 4.x

  ### API Changes
  #### Inline component \`type\` API change

  The API for renderer items that use components as their \`type\` property have now changed to use a type value of \`'InlineComponent'\` and specify the component via a \`component\` prop instead. This allows the renderer item types to be typed correctly as disjoint unions on the type property.

  ${code`
    {
  -   type: FooComponent,
  +   type: 'InlineComponent',
  +   component: FooComponent,
    }
    `}

  #### Rename AsyncLayoutManagerWithViewController's \`viewRenderer\` prop to \`itemsRenderer\`

  This prop has been renamed to align with the renamed \`ItemsRenderer\` component.

  ${code`
  <AsyncLayoutManagerWithViewController
  - viewRenderer={ViewRenderer}
  + itemsRenderer={ItemsRenderer}
  `}

  ### Export renames

  #### Rename \`withNavigationUI\` HOC to \`withNavigationUIController\`

  The \`withNavigationUI\` HOC has been renamed to \`withNavigationUIController\` to align naming convention with \`withNavigationViewController\`

  #### Rename \`ViewRenderer\` export to \`ItemsRenderer\`

  The \`ViewRenderer\` export has been renamed to \`ItemsRenderer\` to better represent the component's purpose, that it renders items of a view. A view is just comprised of items so this is used to render the view. \`ItemsRenderer\` is also recursively rendered within group-like item types like 'Group' and 'Section', and can be used inside custom components that are group-like as well, so it makes more sense for it to be named \`ItemsRenderer\`.

  ### Removals

  #### Remove \`icon\` prop from ConnectedItem

  The \`icon\` prop of ConnectedItem, aka the \`'Item'\` in-built type, allowed you to pass in string names for a very limited set of icons and would render them as \`before\` components. This was never meant to be used in the final API and so has been removed in favour of providing the standard \`before\` prop.

  ${code`
+ import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
  {
    type: 'Item',
-   icon: 'DashboardIcon'
+   before: DashboardIcon
  }
  `}

  #### Remove deprecated \`key\` prop from GlobalNav primary and secondary items

  The \`key\` prop of \`primaryItems\` and \`secondaryItems\` in GlobalNav has been removed in favour of the \`id\` prop, which is now required.

  ${code`
    <GlobalNav
      primaryItems={[
        {
          icon: SearchIcon,
      -   key: 'search',
      +   id: 'search'
        }
      ]}
    />
  `}

  #### Remove ScrollableSectionInner component

  Remove ScrollableSectionInner component and scrollHint styles from theme. Scrolling behaviour is already a part of \`MenuSection\` and can be achieved in \`Section\` by setting its \`shouldGrow\` prop.

  #### Remove peeking behaviour

  Peeking behaviour is no longer supported.

  - \`peek\`, \`unpeek\`, \`togglePeek\`, \`peekHint\`, \`unPeekHint\`, and \`togglePeekHint\` methods removed from \`UIController\`
  - \`isPeeking\` and \`isPeekHinting\` properties removed from \`UIController.state\`
  - \`initialPeekViewId\` removed as constructor parameter to \`ViewController\` and as prop to \`NavigationProvider\`
  - \`setInitialPeekViewId\` method removed from \`ViewController\`
  - \`activePeekView\` and \`incomingPeekView\` properties removed from \`ViewController.state\`
  - \`PeekToggleItem\` removed as an exported component

`;
