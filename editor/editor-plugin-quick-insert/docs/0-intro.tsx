import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-core/docs/editor-use-only';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const warnStyles = xcss({ marginTop: token('space.100', '8px') });

export default md`

${createEditorUseOnlyNotice('Editor Plugin Quick Insert', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    <Box xcss={warnStyles}>
      <AtlassianInternalWarning />
    </Box>
  )}

  This package includes the quick insert plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:  

${code`
type QuickInsertPlugin = NextEditorPlugin<
  'quickInsert',
  {
    pluginConfiguration: QuickInsertPluginOptions | undefined;
    sharedState: QuickInsertSharedState | null;
    actions: {
      insertItem: (item: QuickInsertItem) => Command;
      getSuggestions: (
        searchOptions: QuickInsertSearchOptions,
      ) => QuickInsertItem[];
    };
    commands: {
      openElementBrowserModal: EditorCommand;
    };
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
