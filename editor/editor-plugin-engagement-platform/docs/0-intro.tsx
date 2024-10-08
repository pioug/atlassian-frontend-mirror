import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Engagement Platform', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100', '8px') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the engagement platform plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type EngagementPlatformPlugin = NextEditorPlugin<
	'engagementPlatform',
	{
		pluginConfiguration: EngagementPlatformPluginOptions;
		dependencies: [];
		sharedState: EngagementPlatformPluginState;
	}
>;

type EngagementPlatformPluginState = {
	epComponents: EpComponents;
	epHooks: EpHooks;
	coordinationClient: CoordinationClient;
} | undefined;

type EngagementPlatformPluginOptions = {
	epComponents: EpComponents;
	epHooks: EpHooks;
	coordinationClient: CoordinationClient;
}

type EpComponents = {
	EngagementProvider: React.ComponentType<PropsWithChildren<{}>>;
	EngagementSpotlight: React.ComponentType<{ engagementId: string }>;
	EngagementInlineDialog: React.ComponentType<PropsWithChildren<{ engagementId: string }>>;
	Coordination: React.ComponentType<PropsWithChildren<{ client: CoordinationClient; messageId: string; fallback: ReactNode }>>;
};

type EpHooks = {
	useCoordination: (client: CoordinationClient, messageId: string) => [boolean, (force?: boolean) => Promise<void>];
};
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
