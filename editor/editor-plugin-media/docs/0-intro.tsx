import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Media', [
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

  This package includes the Media plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type MediaInsertPlugin = NextEditorPlugin<'mediaInsert', any>;

export type MediaPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<GuidelinePlugin>,
	GridPlugin,
	WidthPlugin,
	DecorationsPlugin,
	FloatingToolbarPlugin,
	EditorDisabledPlugin,
	FocusPlugin,
	OptionalPlugin<MediaInsertPlugin>,
	OptionalPlugin<InteractionPlugin>,
	SelectionPlugin,
	OptionalPlugin<AnnotationPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<MediaEditingPlugin>,
];

export type MediaNextEditorPluginType = NextEditorPlugin<
	'media',
	{
		actions: {
			handleMediaNodeRenderError: (node: PMNode, reason: string, nestedUnder?: string) => void;
			insertMediaAsMediaSingle: InsertMediaAsMediaSingle;
			setProvider: (provider: Promise<MediaProvider>) => boolean;
		};
		commands: {
			hideMediaViewer: EditorCommand;
			insertMediaSingle: (
				attrs: MediaADFAttrs,
				inputMethod: InputMethodInsertMedia,
				insertMediaVia?: InsertMediaVia,
			) => EditorCommand;
			showMediaViewer: (media: MediaADFAttrs) => EditorCommand;
			trackMediaPaste: (attrs: MediaADFAttrs) => EditorCommand;
		};
		dependencies: MediaPluginDependencies;
		pluginConfiguration: MediaOptions | undefined;
		sharedState: MediaPluginState | null;
	}
>;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#Platform-License) for more licensing information.
`;
export default _default_1;
