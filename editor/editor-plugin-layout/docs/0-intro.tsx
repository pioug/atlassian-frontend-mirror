import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Layout', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )}

  This package includes the layout plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type LayoutPlugin = NextEditorPlugin<
  'layout',
  {
    pluginConfiguration: LayoutPluginOptions | undefined;
    dependencies: [DecorationsPlugin, OptionalPlugin<AnalyticsPlugin>];
    actions: {
      insertLayoutColumns: ReturnType<typeof insertLayoutColumnsWithAnalytics>;
    };
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
