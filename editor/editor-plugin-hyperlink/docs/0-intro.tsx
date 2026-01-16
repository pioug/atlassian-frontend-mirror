import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Hyperlink', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    // eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )
  }

  This package includes the hyperlink plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type HyperlinkPlugin = NextEditorPlugin<
  'hyperlink',
  {
    pluginConfiguration: HyperlinkPluginOptions | undefined;
    dependencies: [
      OptionalPlugin<AnalyticsPlugin>,
    ];
    actions: {
      /**
       * Add items to the left of the hyperlink floating toolbar
       * @param props
       * -
       * - items: Retrieve floating toolbar items to add
       * - onEscapeCallback (optional): To be called when the link picker is escaped.
       * - onInsertLinkCallback (optional): To be called when a link is inserted and it can be changed into a card.
       */
      prependToolbarButtons: PrependToolbarButtons;
      hideLinkToolbar: HideLinkToolbar;
      insertLink: InsertLink;
      updateLink: UpdateLink;
    };
    commands: {
      showLinkToolbar: ShowLinkToolbar;
    };
    sharedState: HyperlinkState | undefined;
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
