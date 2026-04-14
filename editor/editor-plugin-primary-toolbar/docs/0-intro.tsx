import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Primary Toolbar', [
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

  This package includes the Primary Toolbar plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, and \`state\` of the plugin are defined below:

${code`
export interface PrimaryToolbarPluginOptions {
	contextualFormattingEnabled?: boolean;
}

export type PrimaryToolbarPlugin = NextEditorPlugin<
	'primaryToolbar',
	{
		actions: {
			registerComponent: ({
				name,
				component,
			}: {
				component: ToolbarUIComponentFactory;
				name: ToolbarElementNames;
			}) => void;
		};
		pluginConfiguration?: PrimaryToolbarPluginOptions;
		sharedState: PrimaryToolbarPluginState | undefined;
	}
>;

export type ComponentRegistry = Map<string, ToolbarUIComponentFactory>;

export type ToolbarElementNames =
	| 'aiExperience'
	| 'aiSimplified'
	| 'alignment'
	| 'avatarGroup'
	| 'beforePrimaryToolbar'
	| 'blockType'
	| 'findReplace'
	| 'highlight'
	| 'hyperlink'
	| 'insertBlock'
	| 'loom'
	| 'overflowMenu'
	| 'pinToolbar'
	| 'selectionExtension'
	| 'separator'
	| 'spellCheck'
	| 'textColor'
	| 'textFormatting'
	| 'toolbarListsIndentation'
	| 'trackChanges'
	| 'undoRedoPlugin';

export type ToolbarElementConfig = {
	enabled?: (componentRegistry: ComponentRegistry, editorState: EditorState) => boolean;
	name: ToolbarElementNames;
};

export type PrimaryToolbarPluginState = {
	components: ToolbarUIComponentFactory[];
};
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default _default_1;
