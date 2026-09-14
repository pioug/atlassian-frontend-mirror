import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { bodiedExtension as bodiedExtensionFactory } from '../../next-schema/generated/nodeTypes';
import { getExtensionAttrs } from '../../utils/get-extension-attrs';
import type { BreakoutMarkDefinition } from '../marks/breakout';
import type { DataConsumerDefinition } from '../marks/data-consumer';
import type { FragmentDefinition } from '../marks/fragment';
import type { ExtensionAttributes } from './types/extensions';
import type { MarksObject } from './types/mark';
import type { NonNestableBlockContent } from './types/non-nestable-block-content';

/**
 * @name bodiedExtension_node
 */
export interface BodiedExtensionBaseDefinition {
	attrs: ExtensionAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<NonNestableBlockContent>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'bodiedExtension';
}

/**
 * @name bodiedExtension_with_marks_node
 */
export type BodiedExtensionDefinition = BodiedExtensionBaseDefinition &
	MarksObject<DataConsumerDefinition | FragmentDefinition>;

/**
 * @name bodiedExtension_root_only_node
 */
export type BodiedExtensionRootOnlyDefinition = BodiedExtensionBaseDefinition &
	MarksObject<BreakoutMarkDefinition | DataConsumerDefinition | FragmentDefinition>;

export const bodiedExtension: NodeSpec = bodiedExtensionFactory({
	parseDOM: [
		{
			context: 'bodiedExtension//',
			tag: '[data-node-type="bodied-extension"]',
			skip: true,
		},
		{
			tag: '[data-node-type="bodied-extension"]',
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			getAttrs: (domNode) => getExtensionAttrs(domNode as HTMLElement),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'bodied-extension',
			'data-extension-type': node.attrs.extensionType,
			'data-extension-key': node.attrs.extensionKey,
			'data-text': node.attrs.text,
			'data-parameters': JSON.stringify(node.attrs.parameters),
			'data-layout': node.attrs.layout,
			'data-local-id:': node.attrs.localId,
		};
		return ['div', attrs, 0];
	},
});

export const bodiedExtensionRootOnlyStage0: NodeSpec = {
	...bodiedExtension,
	marks: `breakout ${bodiedExtension.marks}`,
};
