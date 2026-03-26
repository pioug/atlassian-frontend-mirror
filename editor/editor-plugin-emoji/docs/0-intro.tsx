import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Emoji', [
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

  This package includes the emoji plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
interface EmojiPluginOptions {
  disableAutoformat?: boolean;
  emojiNodeDataProvider?: EmojiNodeDataProvider;
  emojiProvider?: Promise<EmojiProvider>;
  headless?: boolean;
}

type EmojiPluginState = {
  asciiMap?: Map<string, EmojiDescription>;
  emojiProvider?: EmojiProvider;
  emojiProviderPromise?: Promise<EmojiProvider>;
  emojiResourceConfig?: EmojiResourceConfig;
  inlineEmojiPopupOpen?: boolean;
};

type EmojiPluginSharedState = EmojiPluginState & {
  typeAheadHandler: TypeAheadHandler;
};

type EmojiPluginCommands = {
  insertEmoji: (
    emojiId: EmojiId,
    inputMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.ASCII | INPUT_METHOD.TYPEAHEAD,
  ) => EditorCommand;
};

type EmojiPluginActions = {
  openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
  setProvider: (provider: Promise<EmojiProvider>) => Promise<boolean>;
};

type EmojiPluginDependencies = [
  OptionalPlugin<AnalyticsPlugin>,
  TypeAheadPlugin,
  OptionalPlugin<AnnotationPluginType>,
  OptionalPlugin<EditorViewModePluginType>,
  OptionalPlugin<BasePlugin>,
  OptionalPlugin<MetricsPlugin>,
  OptionalPlugin<ConnectivityPlugin>,
];

type EmojiPlugin = NextEditorPlugin<
  'emoji',
  {
    actions: EmojiPluginActions;
    commands: EmojiPluginCommands;
    dependencies: EmojiPluginDependencies;
    pluginConfiguration: EmojiPluginOptions | undefined;
    sharedState: EmojiPluginSharedState | undefined;
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
