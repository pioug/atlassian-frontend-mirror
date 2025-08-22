import type { NextEditorPlugin, ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

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
