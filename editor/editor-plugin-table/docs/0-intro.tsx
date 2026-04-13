import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- md template from @atlaskit/docs
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Table', [
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

  This package includes the table plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type TablePluginOptions = {
  allowContextualMenu?: boolean;
  allowFixedColumnWidthOption?: boolean;
  dragAndDropEnabled?: boolean;
  fullWidthEnabled?: boolean;
  getEditorFeatureFlags?: GetEditorFeatureFlags;
  isChromelessEditor?: boolean;
  isCommentEditor?: boolean;
  isTableScalingEnabled?: boolean;
  maxWidthEnabled?: boolean;
  tableOptions: PluginConfig;
  wasFullWidthEnabled?: boolean;
  wasMaxWidthEnabled?: boolean;
};

type InsertTableAction = (analyticsPayload: AnalyticsEventPayload) => Command;

type TablePluginActions = {
  insertTable: InsertTableAction;
};

type TablePluginCommands = {
  insertTableWithSize: (
    rowsCount: number,
    colsCount: number,
    inputMethod?: INPUT_METHOD.PICKER,
  ) => EditorCommand;
};

type TablePluginDependencies = [
  AnalyticsPlugin,
  ContentInsertionPlugin,
  WidthPlugin,
  SelectionPlugin,
  OptionalPlugin<LimitedModePlugin>,
  OptionalPlugin<GuidelinePlugin>,
  OptionalPlugin<BatchAttributeUpdatesPlugin>,
  OptionalPlugin<AccessibilityUtilsPlugin>,
  OptionalPlugin<MediaPlugin>,
  OptionalPlugin<EditorViewModePlugin>,
  OptionalPlugin<FeatureFlagsPlugin>,
  OptionalPlugin<ExtensionPlugin>,
  OptionalPlugin<InteractionPlugin>,
  OptionalPlugin<UserIntentPlugin>,
  OptionalPlugin<ToolbarPlugin>,
];

type TablePlugin = NextEditorPlugin<
  'table',
  {
    pluginConfiguration: TablePluginOptions | undefined;
    actions: TablePluginActions;
    commands: TablePluginCommands;
    dependencies: TablePluginDependencies;
    sharedState?: TableSharedState;
  }
>;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default _default_1;
