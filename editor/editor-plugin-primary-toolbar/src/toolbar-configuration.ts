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

const toolbarConfiguration: ToolbarElementConfig[] = [
	...undoRedoGroup,
	...blockTypeGroup,
	...textFormattingGroup,
	...alignmentGroup,
	...textColorGroup,
];
