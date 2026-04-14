import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Selection Toolbar', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the selection toolbar plugin used by @atlaskit/editor-core.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type SelectionToolbarPluginOptions = {
  contextualFormattingEnabled?: boolean;
  disablePin?: boolean;
  preferenceToolbarAboveSelection?: boolean;
  userPreferencesProvider?: UserPreferencesProvider;
};

type SelectionToolbarPlugin = NextEditorPlugin<
  'selectionToolbar',
  {
    actions?: {
      forceToolbarDockingWithoutAnalytics?: (toolbarDocking: ToolbarDocking) => boolean;
      refreshToolbarDocking?: () => boolean;
      setToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean;
      suppressToolbar?: () => boolean;
      unsuppressToolbar?: () => boolean;
    };
    dependencies: [
      OptionalPlugin<EditorViewModePlugin>,
      OptionalPlugin<PrimaryToolbarPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
      OptionalPlugin<BlockControlsPlugin>,
      OptionalPlugin<ConnectivityPlugin>,
      OptionalPlugin<UserPreferencesPlugin>,
      OptionalPlugin<ToolbarPlugin>,
      OptionalPlugin<UserIntentPlugin>,
    ];
    pluginConfiguration: SelectionToolbarPluginOptions;
    sharedState: {
      toolbarDocking: ToolbarDocking;
    };
  }
>;
`}

  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
  Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#Platform-License) for more licensing information.
`;
export default _default_1;
