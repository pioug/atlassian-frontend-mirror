import { getExtensionAttrs } from '../../utils/extensions';
import type { ExtensionAttributes } from './types/extensions';
import type { BodiedExtensionDefinition as BodiedExtension } from './bodied-extension';
import type { PanelDefinition as Panel } from './panel';
import type { ParagraphDefinition as Paragraph } from './paragraph';
import type { BlockQuoteDefinition as Blockquote } from './blockquote';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from './types/list';
import type { RuleDefinition as Rule } from './rule';
import type { HeadingDefinition as Heading } from './heading';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { DecisionListDefinition as DecisionList } from './decision-list';
import type { TaskListDefinition as TaskList } from './task-list';
import type { TableDefinition as Table } from './tableNodes';
import type { ExtensionDefinition as Extension } from './extension';
import type { BlockCardDefinition as BlockCard } from './block-card';
import type { EmbedCardDefinition as EmbedCard } from './embed-card';
import type { DataConsumerDefinition, FragmentDefinition } from '../marks';
import {
	multiBodiedExtensionStage0 as multiBodiedExtensionStage0Factory,
	extensionFrameStage0 as extensionFrameStage0Factory,
} from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @stage 0
 * @name extensionFrame_node
 * @description Wraps the block content
 */
export interface ExtensionFrameDefinition {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 */
	// Excplicitly listed all the non-nestable block content types, to avoid cyclically referencing
	// MultiBodiedExtensionDefinition - which is included in the @NonNestableBlockContent
	content: Array<
		| BodiedExtension
		| Panel
		| Paragraph
		| Blockquote
		| OrderedList
		| BulletList
		| Rule
		| Heading
		| CodeBlock
		| MediaGroup
		| MediaSingle
		| DecisionList
		| TaskList
		| Table
		| Extension
		| BlockCard
		| EmbedCard
	>;
	marks?: Array<DataConsumerDefinition | FragmentDefinition>;
	type: 'extensionFrame';
}

/**
 * @returns NodeSpec for ExtensionFrameDefinition
 */
export const extensionFrame: NodeSpec = extensionFrameStage0Factory({
	parseDOM: [
		{
			context: 'extensionFrame//',
			tag: 'div[data-extension-frame]',
			skip: true,
		},
		{
			tag: 'div[data-extension-frame]',
		},
	],
	toDOM() {
		const attrs: Record<string, string> = {
			'data-extension-frame': 'true',
		};

		return ['div', attrs, 0];
	},
});

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @stage 0
 * @name multiBodiedExtension_node
 * @description Wraps multiple extensionFrame objects.
 */
export interface MultiBodiedExtensionDefinition {
	attrs: ExtensionAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minLength 1
	 */
	content: Array<ExtensionFrameDefinition>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'multiBodiedExtension';
}

export const multiBodiedExtension: NodeSpec = multiBodiedExtensionStage0Factory(
	{
		parseDOM: [
			{
				context: 'multiBodiedExtension//',
				tag: '[data-node-type="multi-bodied-extension"]',
				skip: true,
			},
			{
				tag: '[data-node-type="multi-bodied-extension"]',
				getAttrs: (domNode: HTMLElement) => getExtensionAttrs(domNode),
			},
		],
		toDOM(node) {
			const attrs = {
				'data-node-type': 'multi-bodied-extension',
				'data-extension-type': node.attrs.extensionType,
				'data-extension-key': node.attrs.extensionKey,
				'data-text': node.attrs.text,
				'data-parameters': JSON.stringify(node.attrs.parameters),
				'data-layout': node.attrs.layout,
				'data-local-id:': node.attrs.localId,
			};
			return ['div', attrs, 0];
		},
	},
);
