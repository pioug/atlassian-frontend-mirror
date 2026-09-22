import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { extension as extensionFactory } from '../../next-schema/generated/nodeTypes';
import { getExtensionAttrs } from '../../utils/get-extension-attrs';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import type { BreakoutMarkDefinition } from '../marks/breakout';
import type { DataConsumerDefinition } from '../marks/data-consumer';
import type { FragmentDefinition } from '../marks/fragment';
import type { ExtensionAttributes } from './types/extensions';
import type { MarksObject } from './types/mark';

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

/**
 * @name extension_root_only_node
 */
export type ExtensionRootOnlyDefinition = ExtensionBaseDefinition &
	MarksObject<BreakoutMarkDefinition | DataConsumerDefinition | FragmentDefinition>;

/**
 * @name extension_with_annotation_node
 */
export type ExtensionWithAnnotationDefinition = ExtensionBaseDefinition &
	MarksObject<AnnotationMarkDefinition | DataConsumerDefinition | FragmentDefinition>;

/**
 * @name extension_root_only_with_annotation_node
 */
export type ExtensionRootOnlyWithAnnotationDefinition = ExtensionBaseDefinition &
	MarksObject<
		AnnotationMarkDefinition | BreakoutMarkDefinition | DataConsumerDefinition | FragmentDefinition
	>;

export const extension: NodeSpec = extensionFactory({
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

export const extensionRootOnlyStage0: NodeSpec = {
	...extension,
	marks: 'breakout dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
};

export const extensionWithAnnotationStage0: NodeSpec = {
	...extension,
	marks: 'annotation dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
};

export const extensionRootOnlyWithAnnotationStage0: NodeSpec = {
	...extension,
	marks: 'annotation breakout dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
};
