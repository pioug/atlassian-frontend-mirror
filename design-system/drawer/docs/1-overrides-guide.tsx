import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
The overrides prop is an escape hatch for more granular customisation of the drawer component. 
The prop is an object comprised of properties corresponding to specific customisable components in @atlaskit/drawer.
Each of these properties are an object of one or more of the following properties:

${code`{
  component: React.ComponentType
  // state here is any additional state the provided by the component
  cssFn: (defaultStyles, { tokens, ...state }) => CSSObject
  // props here are any dynamic values that the component passes down that might affect the returned attributes object
  attributesFn: (props: Record<string, any>) => Record<string, any>
}`}

For a more detailed look at the shape of this prop for \`<Drawer/>\` and \`<DrawerIcon/>\` please see the [prop documentation](/0-intro);
The goal of this prop is to provide a way for users to unlock targeted customisations of key components in the @atlaskit/drawer package,
without having to shoulder unecessary complexity. 

## Customising components using the \`overrides\` prop
There may be scenarios where neither \`style\` customisation, nor \`theme\` customisations will be enough 
to satisfy your usecase. For example you may want to add additional state logic to a component, or a more complex / alternative dom tree.
In these scenarios please leverage the \`component\` property of the overrides prop to switch out the default component provided by @atlaskit/drawer 
for your own custom component. 

Below is an example of leveraging this property to switch out the default icons used within @atlaskit/drawer for an alternative set.

${(
  <Example
    packageName="@atlaskit/drawer"
    Component={require('../examples/45-component-override').default}
    title="Switching sidebar component via the overrides prop"
    source={require('!!raw-loader!../examples/45-component-override')}
  />
)}

## Applying CSS customisations using the \`overrides\` prop
There will be scenarios where theme isn't adequate for the type of style customisations your usecase requires. 
In these cases, @atlaskit/drawer exposes more granular control of the application of CSS through a \`cssFn\` property be specified in the passed in overrides object.
This is useful for scenarios where you want to augment how a particular theme token is being applied to your styles or if you have customisations 
that the theme tokens do not support.

### Using the cssFn
The \`cssFn\` property on the overrides prop is a function of the following signature:

${code`
{
  Sidebar: {
    cssFn: (defaultStyles, state) => {...}
  }
}
`}

As it takes the default CSS styles as the first argument, spreading is an easy way to compose your desired new styles together with the default styles of the component:

${code`
const customContentStyles = (defaultStyles: any) => {
  return {
    ...defaultStyles,
    fill: 'green',
  };
};
`}

Below is an example of using the \`cssFn\` to augment the transition styles of an instance of @atlaskit/drawer


${(
  <Example
    packageName="@atlaskit/drawer"
    Component={require('../examples/46-css-function-override').default}
    title="Switching sidebar component via the overrides prop"
    source={require('!!raw-loader!../examples/46-css-function-override')}
  />
)}

## The \`Sidebar\` override

The Sidebar override controls the component that houses the back button of the Drawer component. This component takes the whole left hand side of the Drawer component.

This component could be overriden in order to provide a more full-screen layout by absolutely positioning this element.

The following example clearly shows the boundaries of the Sidebar override.

${(
  <Example
    packageName="@atlaskit/drawer"
    Component={require('../examples/90-sidebar-override').default}
    title="Outlining the sidebar override"
    source={require('!!raw-loader!../examples/90-sidebar-override')}
  />
)}


## The \`Content\` override

The Sidebar override controls the component that houses the inner content of the Drawer component. It normally has a margin on top and sits to the right hand side of the Sidebar component.

This component could be overriden to change the bounds of the rendered content within the Drawer.

The following example clearly shows the boundaries of the Component override.

${(
  <Example
    packageName="@atlaskit/drawer"
    Component={require('../examples/91-content-override').default}
    title="Outlining the content override"
    source={require('!!raw-loader!../examples/91-content-override')}
  />
)}


`;
