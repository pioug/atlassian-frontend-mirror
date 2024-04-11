import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { Box, xcss } from '@atlaskit/primitives';

const warnStyles = xcss({ marginTop: 'space.100' });

export default md`

${createEditorUseOnlyNotice('Editor Plugin Rule', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    <Box xcss={warnStyles}>
      <AtlassianInternalWarning />
    </Box>
  )}

  This package includes the rule plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type RulePlugin = NextEditorPlugin<
  'rule',
  {
    pluginConfiguration: undefined;
    dependencies: [
      OptionalPlugin<AnalyticsPlugin>
    ];
    actions: {
      insertHorizontalRule: ReturnType<typeof insertHorizontalRule>;
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
