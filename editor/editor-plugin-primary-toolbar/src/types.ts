import type { NextEditorPlugin, ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

export type PrimaryToolbarPlugin = NextEditorPlugin<
	'primaryToolbar',
	{
		sharedState: PrimaryToolbarPluginState | undefined;
		actions: {
			registerComponent: ({
				name,
				component,
			}: {
				name: ToolbarElementNames;
				component: ToolbarUIComponentFactory;
			}) => void;
		};
	}
>;

export type ComponentRegistry = Map<string, ToolbarUIComponentFactory>;

export type ToolbarElementNames =
	| 'separator'
	| 'undoRedoPlugin'
	| 'blockType'
	| 'textFormatting'
	| 'alignment'
	| 'textColor'
	| 'highlight'
	| 'toolbarListsIndentation'
	| 'insertBlock'
	| 'beforePrimaryToolbar'
	| 'avatarGroup'
	| 'findReplace'
	| 'aiExperience'
	| 'loom'
	| 'spellCheck';

export type ToolbarElementConfig = {
	name: ToolbarElementNames;
	enabled?: (componentRegistry: ComponentRegistry) => boolean;
};

export type PrimaryToolbarPluginState = {
	components: ToolbarUIComponentFactory[];
};
