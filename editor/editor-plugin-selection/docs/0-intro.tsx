import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const warnStyles = xcss({ marginTop: 'space.100' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

  ${createEditorUseOnlyNotice('Editor Plugin Selection', [
		{ name: 'Editor Core', link: '/packages/editor/editor-core' },
	])}

  ${(
		<Box xcss={warnStyles}>
			<AtlassianInternalWarning />
		</Box>
	)}

  This package includes the selection plugin used by @atlaskit/editor-core.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type SelectionPlugin = NextEditorPlugin<
  'selection',
  {
    actions: EditorSelectionAPI;
    commands: {
      clearBlockSelection: () => EditorCommand;
      clearManualSelection: () => EditorCommand;
      displayGapCursor: (toggle: boolean) => EditorCommand;
      hideCursor: (hide: boolean) => EditorCommand;
      setBlockSelection: (selection: Selection) => EditorCommand;
      setManualSelection: (anchor: number, head: number) => EditorCommand;
    };
    dependencies: [OptionalPlugin<InteractionPlugin>];
    pluginConfiguration: SelectionPluginOptions | undefined;
    sharedState: SelectionSharedState;
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export default _default_1;
