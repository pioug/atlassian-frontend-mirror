import { getExtensionAttrs } from '../../utils/extensions';
import type { InlineExtensionAttributes } from './types/extensions';
import type { MarksObject } from './types/mark';
import type { DataConsumerDefinition } from '../marks/data-consumer';
import type { FragmentDefinition } from '../marks/fragment';
import { inlineExtensionWithMarks as inlineExtensionWithMarksFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name inlineExtension_node
 */
export interface InlineExtensionBaseDefinition {
	attrs: InlineExtensionAttributes;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'inlineExtension';
}

/**
 * @name inlineExtension_with_marks_node
 */
export type InlineExtensionDefinition = InlineExtensionBaseDefinition &
	MarksObject<DataConsumerDefinition | FragmentDefinition>;

export const inlineExtension: NodeSpec = inlineExtensionWithMarksFactory({
	parseDOM: [
		{
			tag: 'span[data-extension-type]',
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			getAttrs: (domNode) => getExtensionAttrs(domNode as HTMLElement, true),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-extension-type': node.attrs.extensionType,
			'data-extension-key': node.attrs.extensionKey,
			'data-text': node.attrs.text,
			'data-parameters': JSON.stringify(node.attrs.parameters),
			'data-local-id:': node.attrs.localId,
			contenteditable: 'false',
		};
		return ['span', attrs];
	},
});
