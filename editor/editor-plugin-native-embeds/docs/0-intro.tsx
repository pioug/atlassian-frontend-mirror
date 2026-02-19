import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Native Embeds', [
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

  This package includes the editor plugin native embeds plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type EditorPluginNativeEmbedsPlugin = NextEditorPlugin<
  'editorPluginNativeEmbeds',
  {
    dependencies: [OptionalPlugin<AnalyticsPlugin>, DecorationsPlugin, ExtensionPlugin];
    pluginConfiguration: { handlers?: EditorPluginNativeEmbedsToolbarHandlers } | undefined;
  }
>
`}

To use the plugin with optional toolbar handlers:

${code`
import {
  nativeEmbedsPlugin,
  type EditorPluginNativeEmbedsToolbarHandlers,
} from '@atlaskit/editor-plugin-native-embeds';

const handlers: EditorPluginNativeEmbedsToolbarHandlers = {
  onRefreshClick: () => { /* handle refresh */ },
  onEmbedClick: () => { /* handle embed */ },
  onChangeBorderClick: () => { /* handle border change */ },
  onAlignmentClick: () => { /* handle alignment */ },
  onOpenInNewWindowClick: () => { /* handle open in new window */ },
  onMoreOptionsClick: () => { /* handle more options */ },
};

new EditorPresetBuilder()
  .add([nativeEmbedsPlugin, { handlers }]);
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
