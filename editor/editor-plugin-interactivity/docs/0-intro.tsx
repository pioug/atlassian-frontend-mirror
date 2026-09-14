import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readmeDocs: any = md`

${createEditorUseOnlyNotice('Editor Plugin Interactivity', [
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

  This package includes the interactivity plugin used by \`@atlaskit/editor-core\`.

  It reports the \`editor interactivity\` operational event: session-to-date interaction latency
  histograms for full page editor sessions — for the page as a whole, for the editor as a whole, and
  for the editor's typing, pointer and other interactions — along with the slowest interactions of
  the session, per
  [RFC 095](https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7527607488/Editor+RFC+095+Confluence+editor+responsiveness+bucketed+INP+telemetry).
  See the package README for the event shape, the snapshot cadence and what ends a session.

  The plugin has no configuration, state, actions or commands — adding it to a preset is what turns
  collection on.

  ## Usage
---

Add the plugin to a preset. It reports for as long as the editor stays mounted, so there is
nothing to call:

${code`
import { interactivityPlugin } from '@atlaskit/editor-plugin-interactivity';

const preset = new EditorPresetBuilder()
	.add(analyticsPlugin)
	.add(contextIdentifierPlugin)
	.add(editorViewModePlugin)
	.add(interactivityPlugin);
`}

All three dependencies are optional, but the event is only fired when the analytics plugin is
present, and the session is only split per document and per mode when the other two are:

${code`
type InteractivityPlugin = NextEditorPlugin<
	'interactivity',
	{
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<ContextIdentifierPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
	}
>
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default readmeDocs;
