import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Mentions', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100', '8px') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the mentions plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type MentionActionOpenTypeAhead = (inputMethod: TypeAheadInputMethod) => boolean;

export type MentionActionAnnounceMentionsInsertion = (
  mentionIds: {
    id: string;
    localId: string;
    taskLocalId?: string;
    type: 'added' | 'deleted';
  }[],
) => void;

export type MentionActionSetProvider = (provider: Promise<MentionProvider>) => Promise<boolean>;

export type MentionActions = {
  announceMentionsInsertion: MentionActionAnnounceMentionsInsertion;
  openTypeAhead: MentionActionOpenTypeAhead;
  setProvider: MentionActionSetProvider;
};

export type MentionPluginDependencies = [
  OptionalPlugin<AnalyticsPlugin>,
  TypeAheadPlugin,
  OptionalPlugin<ContextIdentifierPlugin>,
  OptionalPlugin<BasePlugin>,
  OptionalPlugin<SelectionPlugin>,
];

export type MentionsPlugin = NextEditorPlugin<
  'mention',
  {
    actions: MentionActions;
    commands: {
      /**
       * Inserts mention node into the document based on parameters.
       *
       * !Warning at this stage only inserts single mentions
       *
       * @param params.name string
       * @param params.id string
       * @param params.userType string (optional)
       * @param params.nickname string (optional)
       * @param params.localId string (optional)
       * @param params.accessLevel string (optional)
       * @param params.isXProductUser boolean (optional)
       * @returns
       */
      insertMention: (params: InsertMentionParameters) => EditorCommand;
    };
    dependencies: MentionPluginDependencies;
    pluginConfiguration: MentionPluginOptions | undefined;
    sharedState: MentionSharedState | undefined;
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
