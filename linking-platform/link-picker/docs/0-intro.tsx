import React from 'react';

import { AtlassianInternalWarning, code, Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`
${(<AtlassianInternalWarning />)}

  The Standalone Link Picker component allows users to insert relevant links without having to leave their current context.

  If you have any questions, you can reach out to [#help-fe-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

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

  ## Onboarding

  Used with [@atlaskit/spotlight](https://atlassian.design/components/spotlight/examples) to show a spotlight. Useful for onboarding customers to link-picker in a new product.
  The spotlight will appear wrapping the main search input.

  Wrap the \`LinkPicker\` with a \`PopoverProvider\` and nest it inside a \`PopoverTarget\`. Place a \`PopoverContent\` (containing your \`SpotlightCard\`) as a sibling inside the same \`PopoverProvider\`:

  ${code`
  import { LinkPicker } from '@atlaskit/link-picker';
  import {
    PopoverProvider,
    PopoverContent,
    SpotlightCard,
    SpotlightBody,
  } from '@atlaskit/spotlight';
  ...

  const [isSpotlightActive, setIsSpotlightActive] = useState(true);

  return (
    <PopoverProvider>
        <LinkPicker
          onSubmit={handleCreateLink}
          onCancel={handleCancel}
          spotlightTargetName="link-picker-search-field-spotlight-target"
          {...}
        />
      {isSpotlightActive && (
        <PopoverContent>
          <SpotlightCard>
            <SpotlightBody>You can now link Confluence pages directly from Trello!</SpotlightBody>
          </SpotlightCard>
        </PopoverContent>
      )}
    </PopoverProvider>
  )
  `}

  Be aware that it can be difficult to properly position the spotlight due to content resize events occurring within Link Picker.
  If that happens, you can use onContentResize to debounce when the spotlight should appear:

  ${code`
  ...

  const [linkPickerResized, setLinkPickerResized] = useState(0);
  const [linkPickerResizedDebounced] = useDebounce(linkPickerResized, 100);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);

  const onContentResize = useCallback(() => {
    setLinkPickerResized((resizedCount) => ++resizedCount);
  }, [])

  useEffect(() => {
    if (linkPickerResizedDebounced > 0) {
      setIsSpotlightActive(true);
    }
  }, [linkPickerResizedDebounced]);

  return (
    <PopoverProvider>
        <LinkPicker
          onContentResize={onContentResize}
          spotlightTargetName="link-picker-search-field-spotlight-target"
          {...}
        />
      {isSpotlightActive && (
        <PopoverContent>
          <SpotlightCard>
            <SpotlightBody>You can now link Confluence pages directly from Trello!</SpotlightBody>
          </SpotlightCard>
        </PopoverContent>
      )}
    </PopoverProvider>
  )
  `}

  ## Complete Example

  It is expected to be used in a popup (see other examples).

  ${(
		<Example
			packageName="@atlaskit/link-picker"
			Component={require('../examples/60-link-picker-plugins').default}
			title="Example"
			source={require('!!raw-loader!../examples/60-link-picker-plugins')}
		/>
	)}
`;
export default _default_1;
