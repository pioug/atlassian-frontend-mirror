import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import type { PrimaryToolbarPluginState, ToolbarElementConfig } from './types';

export const getToolbarComponents = (
	pluginState: PrimaryToolbarPluginState,
): ToolbarUIComponentFactory[] =>
	toolbarConfiguration
		.filter(
			(toolbarElement) =>
				typeof toolbarElement.enabled === 'undefined' ||
				toolbarElement.enabled(pluginState.componentRegistry),
		)
		.reduce<ToolbarUIComponentFactory[]>((acc, toolbarElement) => {
			if (pluginState.componentRegistry.has(toolbarElement.name)) {
				const component = pluginState.componentRegistry.get(toolbarElement.name);

				if (!!component) {
					acc.push(component);
				}
			}
			return acc;
		}, []);

const undoRedoGroup: ToolbarElementConfig[] = [
	{
		name: 'undoRedoPlugin',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('undoRedoPlugin'),
	},
];
const blockTypeGroup: ToolbarElementConfig[] = [
	{
		name: 'blockType',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('blockType'),
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
const listFormatting: ToolbarElementConfig[] = [
	{
		name: 'toolbarListsIndentation',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) => componentRegistry.has('toolbarListsIndentation'),
	},
];
const insertBlockGroup: ToolbarElementConfig[] = [
	{
		name: 'insertBlock',
	},
	{
		name: 'separator',
		enabled: (componentRegistry) =>
			componentRegistry.has('insertBlock') &&
			// is last group in the toolbar
			!componentRegistry.has('beforePrimaryToolbar') &&
			!componentRegistry.has('avatarGroup') &&
			!componentRegistry.has('findReplace') &&
			!componentRegistry.has('aiExperience') &&
			!componentRegistry.has('loom'),
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
	...blockTypeGroup,
	...textFormattingGroup,
	...alignmentGroup,
	...textColorGroup,
	...listFormatting,
	...insertBlockGroup,
	...others,
];
