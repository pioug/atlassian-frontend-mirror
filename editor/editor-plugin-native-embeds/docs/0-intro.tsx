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
    pluginConfiguration: EditorPluginNativeEmbedsPluginConfig | undefined;
  }
>

interface EditorPluginNativeEmbedsPluginConfig {
  actionHandlers?: Record<string, () => void>;
  getEditorToolbarActions?: (url: string) => ManifestEditorToolbarActions | undefined;
  handlers?: EditorPluginNativeEmbedsToolbarHandlers;
}
`}

### Manifest-driven toolbar (recommended)

Use \`getEditorToolbarActions\` to provide toolbar and "More Options" dropdown
configuration per embed URL, with \`actionHandlers\` to wire up custom actions:

${code`
import { nativeEmbedsPlugin } from '@atlaskit/editor-plugin-native-embeds';
import {
  createEditorToolbarActions,
  BUILTIN_TOOLBAR_KEYS,
} from '@atlaskit/native-embeds-common';

const toolbarActions = createEditorToolbarActions({
  customActions: {
    myAction: {
      type: 'button',
      key: 'myAction',
      handlerKey: 'doThing',
      label: 'Do Thing',
      icon: SomeIcon,
    },
  },
  items: [
    BUILTIN_TOOLBAR_KEYS.REFRESH,
    BUILTIN_TOOLBAR_KEYS.ALIGNMENT,
    BUILTIN_TOOLBAR_KEYS.SEPARATOR,
    'myAction',
  ],
  moreItems: [
    BUILTIN_TOOLBAR_KEYS.COPY_LINK,
    'myAction',
    BUILTIN_TOOLBAR_KEYS.SEPARATOR,
    BUILTIN_TOOLBAR_KEYS.DELETE,
  ],
});

new EditorPresetBuilder()
  .add([nativeEmbedsPlugin, {
    getEditorToolbarActions: (url) => toolbarActions,
    actionHandlers: {
      doThing: () => { /* handle custom action */ },
    },
  }]);
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
