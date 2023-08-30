import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-core/docs/editor-use-only';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Content Insertion', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )}

  This package includes the content insertion plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:  

${code`
type ContentInsertionPlugin = NextEditorPlugin<
  'contentInsertion',
  {
    actions: InsertNodeAPI;
    dependencies: [AnalyticsPlugin];
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
