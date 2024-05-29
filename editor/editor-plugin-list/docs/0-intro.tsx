import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin List', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )}

  This package includes the list plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type ListPlugin = NextEditorPlugin<
  'list',
  {
    pluginConfiguration: ListPluginOptions | undefined;
    dependencies: [
      FeatureFlagsPlugin,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    actions: {
      isInsideListItem: IsInsideListItem;
      findRootParentListNode: FindRootParentListNode;
    };
    commands: {
      indentList: IndentList;
      outdentList: OutdentList;
      toggleOrderedList: ToggleOrderedList;
      toggleBulletList: ToggleBulletList;
    };
    sharedState: ListState | undefined;
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
