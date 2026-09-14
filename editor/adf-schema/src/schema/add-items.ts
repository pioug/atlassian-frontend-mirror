import type { NodeSpec, MarkSpec } from '@atlaskit/editor-prosemirror/model';

import type {
	SchemaBuiltInItem,
	SchemaCustomMarkSpecs,
	SchemaCustomNodeSpecs,
} from './create-schema';

export function addItems(
	builtInItems: SchemaBuiltInItem[],
	config: string[],
	customSpecs: SchemaCustomNodeSpecs | SchemaCustomMarkSpecs = {},
): Record<string, NodeSpec | MarkSpec> {
	if (!config) {
		return {};
	}

	/**
	 * Add built-in Node / Mark specs
	 */
	const items = builtInItems.reduce<Record<string, NodeSpec | MarkSpec>>(
		(items, { name, spec }) => {
			if (config.indexOf(name) !== -1) {
				items[name] = customSpecs[name] || spec;
			}

			return items;
		},
		{},
	);

	/**
	 * Add Custom Node / Mark specs
	 */
	return Object.keys(customSpecs).reduce((items, name) => {
		if (items[name]) {
			return items;
		}

		items[name] = customSpecs[name];

		return items;
	}, items);
}
