import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

  ${createEditorUseOnlyNotice('Editor Plugin Collab Edit', [
    { name: 'Editor Core', link: '/packages/editor/editor-core' },
  ])}

  ${(
    <>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <div style={{ marginTop: token('space.100', '8px') }}>
        <AtlassianInternalWarning />
      </div>
    </>
  )}

  This package includes the collab-edit plugin used by @atlaskit/editor-core.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type CollabEditPlugin = NextEditorPlugin<
  'collabEdit',
  {
    pluginConfiguration: PrivateCollabEditOptions;
    dependencies: [
      OptionalPlugin<FeatureFlagsPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    sharedState:
      | {
          activeParticipants: ReadOnlyParticipants | undefined;
          sessionId: string | undefined;
        }
      | undefined;
    actions: {
      getAvatarColor: (str: string) => { index: number; color: Color };
    };
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
