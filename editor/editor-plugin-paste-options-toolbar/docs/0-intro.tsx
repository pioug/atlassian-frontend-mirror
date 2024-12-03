import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points, @repo/internal/import/no-unresolved
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { Box, xcss } from '@atlaskit/primitives';

const warnStyles = xcss({ marginTop: 'space.100' });

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export default md`

${createEditorUseOnlyNotice('Editor Plugin Paste Options Toolbar', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
		<Box xcss={warnStyles}>
			<AtlassianInternalWarning />
		</Box>
	)}

  This package includes the PasteOptionsToolbar plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type PasteOptionsToolbarPlugin = NextEditorPlugin<
  'pasteOptionsToolbarPlugin',
  {
    dependencies: [OptionalPlugin<AnalyticsPlugin>, PastePlugin];
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
