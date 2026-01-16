import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Floating Toolbar', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    // eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )
  }

  This package includes the floating toolbar plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type FloatingToolbarPlugin = NextEditorPlugin<
  'floatingToolbar',
  {
    dependencies: [
      FeatureFlagsPlugin,
      DecorationsPlugin,
      OptionalPlugin<ContextPanelPlugin>,
      EditorDisabledPlugin,
    ];
    actions: { forceFocusSelector: ForceFocusSelector };
    sharedState:
      | {
          configWithNodeInfo: ConfigWithNodeInfo | undefined;
          floatingToolbarData: FloatingToolbarPluginData | undefined;
        }
      | undefined;
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
export default _default_1;
