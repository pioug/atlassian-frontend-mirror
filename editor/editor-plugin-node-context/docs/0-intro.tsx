import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readmeDocs: any = md`

${createEditorUseOnlyNotice('Editor Plugin Node Context', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
		<>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.100') }}>
				<AtlassianInternalWarning />
			</div>
		</>
	)}

  This package provides opt-in actions that resolve viewport coordinates to ADF node context.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
const preset = new Preset().add(nodeContextPlugin);

const pointTarget = editorApi.nodeContext.actions.getNodeContextAtCoords({ x: 120, y: 240 });
const regionTargets = editorApi.nodeContext.actions.getNodeContextsInViewportRect({
  x: 100,
  y: 200,
  width: 300,
  height: 180,
});
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default readmeDocs;
