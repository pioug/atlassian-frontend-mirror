import type { NextEditorPlugin, NextEditorPluginMetadata } from '@atlaskit/editor-common/types';
import type { NodeSpec, MarkSpec } from '@atlaskit/editor-prosemirror/model';

export const decoratePlugin = <Name extends string, Meta extends NextEditorPluginMetadata>(
	plugin: NextEditorPlugin<Name, Meta>,
	nodes: string[],
	{
		// Nested expand added here to support expands in tables.
		content = '(block | unsupportedBlock | nestedExpand)+',
		transformer,
	}: { content?: string; transformer?: (node: NodeSpec) => NodeSpec } = {},
	markSpecTransformers?: Map<string, (mark: MarkSpec) => MarkSpec>,
) => {
	return ((args) => {
		const pluginInstance = plugin(args);
		return {
			...pluginInstance,
			nodes: () => {
				return (
					pluginInstance.nodes?.().map(({ name, node }) => {
						if (nodes.includes(name)) {
							node = {
								...node,
								content,
							};
							if (transformer) {
								node = transformer(node);
							}
						}
						return { name, node };
					}) ?? []
				);
			},
			marks: () =>
				pluginInstance.marks?.().map(({ name, mark }) => {
					const transformer = markSpecTransformers?.get(name);
					if (transformer) {
						return { name, mark: transformer(mark) };
					}
					return { name, mark };
				}) ?? [],
		};
	}) as NextEditorPlugin<Name, Meta>;
};
