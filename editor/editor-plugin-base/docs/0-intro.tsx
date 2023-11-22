import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-core/docs/editor-use-only';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Base', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )}

  This package includes the base plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, and \`state\` of the plugin are defined below:  

${code`
export type BasePlugin = NextEditorPlugin<
  'base',
  {
    pluginConfiguration: BasePluginOptions | undefined;
    dependencies: [OptionalPlugin<FeatureFlagsPlugin>];
    sharedState: BasePluginState;
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
