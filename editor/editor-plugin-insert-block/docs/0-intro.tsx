import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Insert Block', [
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

  This package includes the insert block plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type InsertBlockPlugin = NextEditorPlugin<
  'insertBlock',
  {
    actions: {
      toggleAdditionalMenu: () => void;
    };
    dependencies: InsertBlockPluginDependencies;
    pluginConfiguration: InsertBlockPluginOptions | undefined;
    sharedState: InsertBlockPluginState | undefined;
  }
>;

type InsertBlockPluginDependencies = [
  TypeAheadPlugin,
  OptionalPlugin<TablePlugin>,
  OptionalPlugin<HyperlinkPlugin>,
  OptionalPlugin<DatePlugin>,
  OptionalPlugin<BlockTypePlugin>,
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<ImageUploadPlugin>,
  OptionalPlugin<EmojiPlugin>,
  OptionalPlugin<QuickInsertPlugin>,
  OptionalPlugin<RulePlugin>,
  OptionalPlugin<CodeBlockPlugin>,
  OptionalPlugin<PanelPlugin>,
  OptionalPlugin<MediaPlugin>,
  OptionalPlugin<MediaInsertPlugin>,
  OptionalPlugin<MentionsPlugin>,
  OptionalPlugin<MetricsPlugin>,
  OptionalPlugin<StatusPlugin>,
  OptionalPlugin<LayoutPlugin>,
  OptionalPlugin<ExpandPlugin>,
  OptionalPlugin<PlaceholderTextPlugin>,
  OptionalPlugin<ExtensionPlugin>,
  OptionalPlugin<TasksAndDecisionsPlugin>,
  OptionalPlugin<PrimaryToolbarPlugin>,
  OptionalPlugin<FeatureFlagsPlugin>,
  OptionalPlugin<ContextPanelPlugin>,
  OptionalPlugin<ConnectivityPlugin>,
  OptionalPlugin<ToolbarPlugin>,
];

type ToolbarInsertBlockButtonsConfig = PluginToolbarComponentsConfig<
  'codeBlock' | 'emoji' | 'insert' | 'layout' | 'media' | 'mention' | 'table' | 'taskList'
>;

interface InsertBlockPluginOptions {
  allowExpand?: boolean;
  allowTables?: boolean;
  appearance?: EditorAppearance;
  horizontalRuleEnabled?: boolean;
  insertMenuItems?: any;
  nativeStatusSupported?: boolean;
  showElementBrowserLink?: boolean;
  tableSelectorSupported?: boolean;
  toolbarButtons?: ToolbarInsertBlockButtonsConfig;
  toolbarShowPlusInsertOnly?: boolean;
}

interface InsertBlockPluginState {
  showElementBrowser: boolean;
}
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default _default_1;
