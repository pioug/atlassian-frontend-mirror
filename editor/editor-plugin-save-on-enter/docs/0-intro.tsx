import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

import { createEditorUseOnlyNotice } from './editor-use-only';

export default md`
  ${createEditorUseOnlyNotice('Editor Plugin Save-on-enter', [
		{ name: 'Editor Core', link: '/packages/editor/editor-core' },
	])}
  ${(
		<>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.100', '8px') }}>
				<AtlassianInternalWarning />
			</div>
		</>
	)}
  This package includes the Save-on-enter plugin used by @atlaskit/editor-core.
  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type Config = (editorView: EditorView) => void;

export type SaveOnEnter = NextEditorPlugin<
  'saveOnEnter',
  {
    pluginConfiguration: Config | undefined;
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
