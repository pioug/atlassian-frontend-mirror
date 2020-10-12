import React from 'react';
import {
  md,
  code,
  Props,
  Example,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  \`\`\`<AtlassianSwitcher />\`\`\` is a React app that can be rendered into a container that will show users:

  * The products they have permission to view and navigate to
  * Their recently viewed containers, if applicable
  * Any cross-flow and admin links, if applicable
  * Any custom links from Jira or Confluence, if applicable

  ## Integrating switcher

  There are multiple ways to integrate switcher within your app. Depending on your application you might need to combine some of the options below.

  * [Atlassian switcher vanilla](/packages/navigation/atlassian-switcher-vanilla) can be used in applications that don't bundle React.
  * [Standalone switcher](/packages/navigation/atlassian-switcher/docs/standalone-switcher) allows to render the switcher in any container (e.g. inline dialog) other than the drawer by specifying the appearance property.
  * [Custom themes](/packages/navigation/atlassian-switcher/docs/theming-guide) allow to change the colours in the switcher component.

  ## Basic example

  This is a basic example of the switcher being rendered in a drawer.

  ${code`import AtlassianSwitcher  from '@atlaskit/atlassian-switcher';`}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/35-xsell-in-generic-switcher').default}
      title="Basic switcher example"
      source={require('!!raw-loader!../examples/35-xsell-in-generic-switcher')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/ui/components/atlassian-switcher')}
    />
  )}
`;
