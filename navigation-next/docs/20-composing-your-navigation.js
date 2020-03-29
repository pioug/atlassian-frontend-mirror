import React from 'react';
import { code, md } from '@atlaskit/docs';

import { Contents, ContentsProvider, H, IframeExample } from './shared';

export default (
  <ContentsProvider>{md`
This guide will introduce you to many of the components exported by \`navigation-next\`, and will walk you through composing a simple navigation.

${(<Contents listType="ol" />)}

${(<H>The LayoutManager component</H>)}

If you've read the [Conceptual Model documentation](https://product-fabric.atlassian.net/wiki/spaces/NAV/pages/675251320/Navigation+conceptual+model+for+V2) you'll understand that the user interface of an Atlassian application is made up of a series of metaphorical 'layers'. These are, in order from lowest to highest, the global layer, the product layer, the container layer, and the page layer.

We handle the placement and positioning of these layers using a component called the \`LayoutManager\`, which is essentially the entrypoint to \`@atlaskit/navigation-next\`. \`LayoutManager\` takes the following props:

${code`
{
  /** A component which will render the global navigation layer. */
  globalNavigation: ComponentType<{}>,
  /** A component which will render the product navigation layer. */
  productNavigation: ComponentType<{}>,
  /** A component which will render the container navigation layer. */
  containerNavigation: ?ComponentType<{}>,
  /** The page layer. */
  children: Node,
}
`}

The \`LayoutManager\` will position these layers and handle UI state concerns such as resizing, expanding, and collapsing out of the box. This state container can be accessed via context and we will explore how this works later on. For now, it means we'll need one more component before we can render anything - the \`NavigationProvider\`. With this, we can render the bare bones of an Atlassian application:

${(
  <IframeExample
    source={require('!!raw-loader!./examples/getting-started/layoutmanager')}
    title="The LayoutManager component"
    id="layoutmanager"
    path="/getting-started"
  />
)}

${(<H>Configuring the global navigation</H>)}

As we begin composing the navigation we might as well start at the bottom - the global layer. Conceptually this layer is universal across every Atlassian product. In practice there will be some product-specific items in this area, and some of the actions will be contextual, but for the most part our customers should get a very consistent experience here no matter what Atlassian product they're using. To facilitate this consistency we provide a pre-configured \`@atlaskit/global-navigation\` component which accepts a simple set of props and will compose the global navigation layer for you. You can find the full props interface in the documentation for that component, but for now let's simply render the product icon.

${code`
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/logo/dist/esm/AtlassianLogo/Icon';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={AtlassianIcon}
    onProductClick={() => {}}
  />
);
`}

We can then plug this component into our \`LayoutManager\` to render the global layer.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/getting-started/configuring-the-global-navigation')}
    title="Configuring the global navigation"
    id="configuring-the-global-navigation"
    path="/getting-started"
  />
)}

${(<H>Composing the product navigation</H>)}

Let's move on to the next part of our navigation - the product area. This area will always contain the product layer. Depending on the part of the application we're in there may also be a container layer as well. The \`containerNavigation\` prop is nullable, so we'll remove it for now. We'll also create a component to render something in the product area.

We can render basically anything we want in this section. All of the typical primitive UI components are provided by \`@atlaskit/navigation-next\` so let's start putting a few of these together.

${code`
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AtlassianWordmark } from '@atlaskit/logo';
import { GroupHeading, Item, Section, Separator, Wordmark } from '@atlaskit/navigation-next';

const MyProductNavigation = () => (
  <Fragment>
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <Wordmark wordmark={AtlassianWordmark} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <Separator />
          <GroupHeading>Add-ons</GroupHeading>
          <Item text="My plugin" />
        </div>
      )}
    </MenuSection>
  </Fragment>
);
`}

**Note:** We don't automatically apply padding or add wrapping elements around your product navigation or within \`Section\`s because we don't want to break your layout. Instead, we provide the \`Section\`'s children with styles through a render function.

Read the [component props docs](/packages/core/navigation-next/docs/ui-components) for more information about \`HeaderSection\`, \`MenuSection\` and \`Section\`, along with every other UI primitive exported by this package.

Putting it all together we can now render a somewhat complete navigation!

${(
  <IframeExample
    source={require('!!raw-loader!./examples/getting-started/composing-the-product-navigation')}
    title="Composing the product navigation"
    id="composing-the-product-navigation"
    path="/getting-started"
  />
)}

${(<H>Composing the container navigation</H>)}

The container layer can be composed using the same primitives as the product layer. Let's add a few items to it so that we can see the full navigation in action.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/getting-started/composing-the-container-navigation')}
    title="Composing the container navigation"
    id="composing-the-container-navigation"
    path="/getting-started"
  />
)}

${(<H>Managing the UI state</H>)}

If you try you'll notice that you can expand, collapse, and resize your navigation right now, and this state will be controlled by the component. What if we want to manage or respond to this state somewhere in our application? Introducing the \`UIControllerSubscriber\`.

${code`
import { UIControllerSubscriber } from '@atlaskit/navigation-next';

const ExpandToggleButton = () => (
  <UIControllerSubscriber>
    {navigationUIController => (
      <button onClick={navigationUIController.toggleCollapse}>
        {navigationUIController.state.isCollapsed ? 'Expand' : 'Collapse'} content navigation
      </button>
    )}
  </UIControllerSubscriber>
);
`}

This component provides its children with access to the state of the navigation, along with methods which can be called to modify the state. It will re-render whenever the state changes. This container manages behaviours such as collapsing, expanding, and resizing. Read [the component's documentation](/packages/core/navigation-next/docs/state-controllers#ui-controller) for a complete list of methods and properties.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/getting-started/managing-the-ui-state')}
    title="Managing the UI state"
    id="managing-the-ui-state"
    path="/getting-started"
  />
)}

${(<H>Theming</H>)}

The current implementation of theming in \`@atlaskit/navigation-next\` is experimental and is likely to change soon. We'll add documentation and guides once the API has stabilised.
`}</ContentsProvider>
);
