import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-core/docs/editor-use-only';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const warnStyles = xcss({ marginTop: token('space.100', '8px') });

export default md`

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
    pluginConfiguration: SelectionPluginOptions | undefined;
    actions: NextEditorSelectionAPI;
    commands: {
      displayGapCursor: (toggle: boolean) => EditorCommand;
    };
    sharedState: SelectionSharedState;
  }
>;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
 Please see [Atlassian Frontend - License](https://developer.atlassian.com/cloud/framework/atlassian-frontend/#license) for more licensing information.
`;
