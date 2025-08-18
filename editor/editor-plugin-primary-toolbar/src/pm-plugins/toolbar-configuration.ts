import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ComponentRegistry, ToolbarElementConfig } from '../primaryToolbarPluginType';

type GetToolbarComponentsOptions = {
	componentRegistry: ComponentRegistry;
	editorState: EditorState;
	contextualFormattingEnabled?: boolean;
};

export const getToolbarComponents = ({
	componentRegistry,
	editorState,
	contextualFormattingEnabled,
}: GetToolbarComponentsOptions): ToolbarUIComponentFactory[] => {
	let configuration: ToolbarElementConfig[];
	if (
		contextualFormattingEnabled &&
		editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
	) {
		const shouldShowUndoRedoGroup = fg('platform_editor_undo_redo_find_on_primary_toolbar');
		configuration = toolbarConfigurationV2(true, shouldShowUndoRedoGroup);
	} else {
		const shouldShowFindGroup = !!contextualFormattingEnabled;
		if (componentRegistry.has('trackChanges')) {
			configuration = toolbarConfigurationV3(shouldShowFindGroup);
		} else {
			configuration = toolbarConfiguration(shouldShowFindGroup);
		}
	}

	return configuration
		.filter(
			(toolbarElement) =>
				typeof toolbarElement.enabled === 'undefined' ||
				toolbarElement.enabled(componentRegistry, editorState),
		)
		.reduce<ToolbarUIComponentFactory[]>((acc, toolbarElement) => {
			if (componentRegistry.has(toolbarElement.name)) {
				const component = componentRegistry.get(toolbarElement.name);

				if (!!component) {
					acc.push(component);
				}
			}
			return acc;
		}, []);
};

const trackChangesGroup: ToolbarElementConfig[] = [
	{
		name: 'separator',
		enabled: (componentRegistry) =>
			componentRegistry.has('undoRedo') || componentRegistry.has('trackChanges'),
	},
	{
		name: 'undoRedoPlugin',
		enabled: (componentRegistry) => componentRegistry.has('undoRedoPlugin'),
	},
	{
		name: 'trackChanges',
		enabled: (componentRegistry) => componentRegistry.has('trackChanges'),
	},
];

const undoRedoGroup: ToolbarElementConfig[] = [
	{
		name: 'undoRedoPlugin',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('undoRedoPlugin'),
	},
];

const spellCheckGroup: ToolbarElementConfig[] = [
	{
		name: 'spellCheck',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('spellCheck'),
	},
];

const blockTypeGroup: ToolbarElementConfig[] = [
	{
		name: 'blockType',
	},
	{
		name: 'separator',
		enabled: (componentRegistry, editorState) =>
			componentRegistry.has('blockType') &&
			// Use case where you want to have the block plugin but not render any toolbar items (when you exclude headings), we should be able to get rid of this when we split block type plugin up and check for the presence of the heading plugin directly
			!!editorState.schema.nodes.heading,
	},
];
const textFormattingGroup: ToolbarElementConfig[] = [
	{
		name: 'textFormatting',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('textFormatting'),
	},
];
const alignmentGroup: ToolbarElementConfig[] = [
	{
		name: 'alignment',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('alignment'),
	},
];
const textColorGroup: ToolbarElementConfig[] = [
	{
		name: 'textColor',
	},
	{
		name: 'highlight',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) =>
			componentRegistry.has('textColor') || componentRegistry.has('highlight'),
	},
];
const listFormattingGroup: ToolbarElementConfig[] = [
	{
		name: 'toolbarListsIndentation',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('toolbarListsIndentation'),
	},
];
const hyperlinkGroup: ToolbarElementConfig[] = [
	{
		name: 'hyperlink',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('hyperlink'),
	},
];
const insertBlockGroup: ToolbarElementConfig[] = [
	{
		name: 'insertBlock',
	},
];
const others: ToolbarElementConfig[] = [
	{
		name: 'beforePrimaryToolbar',
	},
	{
		name: 'avatarGroup',
	},
	{
		name: 'findReplace',
	},
	{
		// TODO: ED-26962 - Should likely be split into three: spelling & grammar, separator, and AI trigger
		name: 'aiExperience',
	},
	{
		name: 'loom',
	},
];
const othersGroupNoFind: ToolbarElementConfig[] = [
	{
		name: 'beforePrimaryToolbar',
	},
	{
		name: 'avatarGroup',
	},
	{
		// TODO: ED-26962 - Should likely be split into three: spelling & grammar, separator, and AI trigger
		name: 'aiExperience',
	},
	{
		name: 'loom',
	},
];
const findGroup: ToolbarElementConfig[] = [
	{
		name: 'findReplace',
	},
];

const toolbarConfigurationV3 = (shouldShowFindGroup: boolean): ToolbarElementConfig[] => [
	...spellCheckGroup,
	...blockTypeGroup,
	...textFormattingGroup,
	...alignmentGroup,
	...textColorGroup,
	...listFormattingGroup,
	...insertBlockGroup,
	...(shouldShowFindGroup ? others : othersGroupNoFind),
	...trackChangesGroup,
];

const toolbarConfiguration = (shouldShowFindGroup: boolean): ToolbarElementConfig[] => [
	...undoRedoGroup,
	...spellCheckGroup,
	...blockTypeGroup,
	...textFormattingGroup,
	...alignmentGroup,
	...textColorGroup,
	...listFormattingGroup,
	...insertBlockGroup,
	...(shouldShowFindGroup ? others : othersGroupNoFind),
];

const pinToolbar: ToolbarElementConfig[] = [
	{
		name: 'pinToolbar',
	},
];

const toolbarConfigurationV2 = (
	shouldShowInsertBlock: boolean,
	shouldShowUndoRedoGroup: boolean,
	shouldShowFindGroup = false,
): ToolbarElementConfig[] => [
	...(shouldShowUndoRedoGroup ? undoRedoGroup : []),
	...blockTypeGroup,
	...textFormattingGroup,
	...textColorGroup,
	...alignmentGroup,
	...listFormattingGroup,
	...hyperlinkGroup,
	...(shouldShowInsertBlock ? insertBlockGroup : []),
	{
		name: 'selectionExtension',
	},
	...pinToolbar,
	{
		name: 'beforePrimaryToolbar',
	},
	...(shouldShowFindGroup ? findGroup : []),
];
