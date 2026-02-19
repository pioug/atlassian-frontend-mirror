import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Code Block Advanced', [
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

  This package includes the code block advanced plugin used by \`@atlaskit/editor-core\`.

  This can be used to extend \`@atlaskit/editor-plugin-code-block\` by using a CodeMirror editor for
  the nodeview to use rich functionality. Extensions can be injected via its configuration.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type CodeBlockAdvancedPlugin = NextEditorPlugin<
	'codeBlockAdvanced',
	{
		dependencies: [
			OptionalPlugin<CodeBlockPlugin>,
			SelectionPlugin,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<SelectionMarkerPlugin>,
			OptionalPlugin<FindReplacePlugin>,
			OptionalPlugin<ContentFormatPlugin>,
		];
		pluginConfiguration: CodeBlockAdvancedPluginOptions | undefined;
	}
>;

export type CodeBlockAdvancedPluginOptions = {
	allowCodeFolding?: boolean;
	extensions?: Extension[];
};
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
