import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- md template from @atlaskit/docs
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Local Id', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the local id plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type ActionProps = {
	localId: string;
};

export type LocalIdStatusCode =
	| 'current'
	| 'localChangeByAttr'
	| 'localChangeBySetAttrs'
	| 'localChangeByBatchAttrs'
	| 'localChangeByReplace'
	| 'localChangeByDelete'
	| 'localChangeByReplaceAround'
	| 'localChangeByUnknown'
	| 'remoteChangeByAttr'
	| 'remoteChangeBySetAttrs'
	| 'remoteChangeByBatchAttrs'
	| 'remoteChangeByReplace'
	| 'remoteChangeByDelete'
	| 'remoteChangeByReplaceAround'
	| 'remoteChangeByUnknown'
	| 'AIChangeByAttr'
	| 'AIChangeBySetAttrs'
	| 'AIChangeByBatchAttrs'
	| 'AIChangeByReplace'
	| 'AIChangeByDelete'
	| 'AIChangeByReplaceAround'
	| 'AIChangeByUnknown'
	| 'docChangeByAttr'
	| 'docChangeBySetAttrs'
	| 'docChangeByBatchAttrs'
	| 'docChangeByReplace'
	| 'docChangeByDelete'
	| 'docChangeByReplaceAround'
	| 'docChangeByUnknown';

export interface LocalIdSharedState {
	localIdStatus: Map<string, LocalIdStatusCode> | undefined;
	localIdWatchmenEnabled: boolean | undefined;
}

export type LocalIdPlugin = NextEditorPlugin<
	'localId',
	{
		actions: {
			getNode: (props: ActionProps) => NodeWithPos | undefined;
			replaceNode: (props: ActionProps & { value: Node }) => boolean;
		};
		dependencies: [
			CompositionPlugin,
			OptionalPlugin<CollabEditPlugin>,
			OptionalPlugin<LimitedModePlugin>,
		];
		sharedState: LocalIdSharedState | undefined;
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
