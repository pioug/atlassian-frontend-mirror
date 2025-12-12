import type { ExtensionAttributes } from './types/extensions';
import { getExtensionAttrs } from '../../utils/extensions';
import type { MarksObject } from './types/mark';
import type { DataConsumerDefinition } from '../marks/data-consumer';
import type { FragmentDefinition } from '../marks/fragment';
import { extension as extensionFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name extension_node
 */
export interface ExtensionBaseDefinition {
	attrs: ExtensionAttributes;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'extension';
}

/**
 * @name extension_with_marks_node
 */
export type ExtensionDefinition = ExtensionBaseDefinition &
	MarksObject<DataConsumerDefinition | FragmentDefinition>;

export const extension = extensionFactory({
	parseDOM: [
		{
			tag: '[data-node-type="extension"]',
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			getAttrs: (domNode) => getExtensionAttrs(domNode as HTMLElement),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'extension',
			'data-extension-type': node.attrs.extensionType,
			'data-extension-key': node.attrs.extensionKey,
			'data-text': node.attrs.text,
			'data-parameters': JSON.stringify(node.attrs.parameters),
			'data-layout': node.attrs.layout,
			'data-local-id:': node.attrs.localId,
		};
		return ['div', attrs];
	},
});
