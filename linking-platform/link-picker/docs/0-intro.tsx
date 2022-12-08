import React from 'react';

import {
  code,
  Example,
  md,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  The Standalone Link Picker component allows users to insert relevant links without having to leave their current context.

  If you have any questions, you can reach out to [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

  ## Installation

  ${code`yarn add @atlaskit/link-picker`}

  ## Usage

  ${code`
  import { LinkPicker } from '@atlaskit/link-picker';

  ...
  // Inside a component with proper state and event management
  const handleCreateLink = (payload) => {...}

  const handleCancel = () => {...}

  return (
    <LinkPicker
      onSubmit={handleCreateLink}
      onCancel={handleCancel}
      {...}
    />
  )
`}

${(
  <Props
    shouldCollapseProps
    heading="Props"
    props={require('!!extract-react-types-loader!../src/ui')}
  />
)}

  <br/>

  ## Plugins

  Plugins provide an interface to provide additional functionality to the link picker.
  Currently plugins give the link picker the ability to surface your most recently visited/viewed items as well as supplying a mechanism to search for the link you want to insert without leaving your context.

  <br/>

  ${code`
  import { LinkPicker } from '@atlaskit/link-picker';
  import { AtlassianLinkPickerPlugin } from '@atlassian/link-picker-atlassian-plugin';
  import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

  ...
  // Inside a component with proper state and event management
  const smartCardClient = new CardClient(ENV);

  const config = {...} as AtlassianLinkPickerPluginConfig;
  const plugins = React.useMemo(() => [new AtlassianLinkPickerPlugin(config)],

  return (
    <SmartCardProvider client={smartCardClient}>
      <LinkPicker
        onSubmit={handleCreateLink}
        onCancel={handleCancel}
        plugins={plugins}
        {...}
      />
    </SmartCardProvider>
  )
  `}

  <br/>

  ## Analytics

  Used with [@atlaskit/link-analytics](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/linking-platform/link-analytics) and [@atlaskit/link-provider](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/linking-platform/link-analytics) to instrument analytics of link lifecycle events such as link creation and deletion.

  <br/>

  ${code`
  import { LinkPicker } from '@atlaskit/link-picker';
  import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';

  ...
  // Inside a component with proper state and event management
  const linkAnalytics = useSmartLinkLifecycleAnalytics();

  const handleSubmit = (payload, analytic) => {
    ...
    linkAnalytics.linkCreated(payload, analytic);
  };

  return (
    <LinkPicker
      onSubmit={handleCreateLink}
      onCancel={handleCancel}
      {...}
    />
  )
  `}


  ## Complete Example

  It is expected to be used in a popup (see other examples).

  ${(
    <Example
      packageName="@atlaskit/link-picker"
      Component={require('../examples/10-forge-plugins').default}
      title="Example"
      source={require('!!raw-loader!../examples/10-forge-plugins')}
    />
  )}
`;
