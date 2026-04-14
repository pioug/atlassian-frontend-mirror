import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Hyperlink', [
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

  This package includes the hyperlink plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type HyperlinkPluginDependencies = [
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<CardPlugin>,
  OptionalPlugin<EditorViewModePlugin>,
  OptionalPlugin<ConnectivityPlugin>,
  OptionalPlugin<PrimaryToolbarPlugin>,
  OptionalPlugin<SelectionToolbarPlugin>,
  OptionalPlugin<UserPreferencesPlugin>,
  OptionalPlugin<ToolbarPlugin>,
  OptionalPlugin<UserIntentPlugin>,
];

export type HyperlinkPluginActions = {
  hideLinkToolbar: HideLinkToolbar;
  insertLink: InsertLink;
  updateLink: UpdateLink;
};

export type HyperlinkPluginCommands = {
  /**
   * EditorCommand to remove the current active link.
   *
   * Example:
   *
   * \`\`\`
   * api.core.actions.execute(
   *   api.hyperlink.commands.removeLink()
   * )
   * \`\`\`
   */
  removeLink: () => EditorCommand;

  /**
   * EditorCommand to show link toolbar.
   *
   * Example:
   *
   * \`\`\`
   * const newTr = pluginInjectionApi?.hyperlink.commands.showLinkToolbar(
   *   inputMethod
   * )({ tr })
   * \`\`\`
   */
  showLinkToolbar: ShowLinkToolbar;

  /**
   * EditorCommand to edit the current active link.
   *
   * Example:
   *
   * \`\`\`
   * api.core.actions.execute(
   *   api.hyperlink.commands.updateLink(href, text)
   * )
   * \`\`\`
   */
  updateLink: (href: string, text: string) => EditorCommand;
};

export type HyperlinkPluginOptions = CommonHyperlinkPluginOptions;

export type HyperlinkPluginSharedState = HyperlinkState | undefined;

export type HyperlinkPlugin = NextEditorPlugin<
  'hyperlink',
  {
    actions: HyperlinkPluginActions;
    commands: HyperlinkPluginCommands;
    dependencies: HyperlinkPluginDependencies;
    pluginConfiguration: HyperlinkPluginOptions | undefined;
    sharedState: HyperlinkPluginSharedState;
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
