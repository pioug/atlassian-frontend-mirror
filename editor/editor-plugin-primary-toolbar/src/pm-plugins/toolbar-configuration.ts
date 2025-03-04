import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ComponentRegistry, ToolbarElementConfig } from '../primaryToolbarPluginType';

export const getToolbarComponents = (
	componentRegistry: ComponentRegistry,
	editorState: EditorState,
): ToolbarUIComponentFactory[] => {
	return (
		editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
			? toolbarConfigurationV2
			: toolbarConfiguration
	)
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
		// TODO: Should likely be split into three: spelling & grammar, separator, and AI trigger
		name: 'aiExperience',
	},
	{
		name: 'loom',
	},
];

const toolbarConfiguration: ToolbarElementConfig[] = [
	...undoRedoGroup,
	...spellCheckGroup,
	...blockTypeGroup,
	...textFormattingGroup,
	...alignmentGroup,
	...textColorGroup,
	...listFormattingGroup,
	...insertBlockGroup,
	...others,
];

const toolbarConfigurationV2: ToolbarElementConfig[] = [
	...blockTypeGroup,
	...textFormattingGroup,
	...textColorGroup,
	...alignmentGroup,
	...listFormattingGroup,
	...hyperlinkGroup,
	{
		name: 'overflowMenu',
	},
	{
		name: 'beforePrimaryToolbar',
	},
];
