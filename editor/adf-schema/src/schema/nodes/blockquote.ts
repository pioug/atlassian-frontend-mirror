import type { ParagraphDefinition as Paragraph } from './paragraph';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from './types/list';
import type { BlockquoteNode } from '../../next-schema/generated/nodeTypes';
import {
	blockquote as blockquoteFactory,
	blockquoteLegacy as blockquoteLegacyFactory,
} from '../../next-schema/generated/nodeTypes';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { ExtensionDefinition as Extension } from './extension';
import type { NodeSpecOptions } from '../createPMSpecFactory';
import { uuid } from '../../utils';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name blockquote_node
 */
export interface BlockQuoteDefinition {
	attrs?: {
		localId?: string;
	};
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<
		Paragraph | OrderedList | BulletList | CodeBlock | MediaGroup | MediaSingle | Extension
	>;
	type: 'blockquote';
}

const nodeSpecOptions: NodeSpecOptions<BlockquoteNode> = {
	parseDOM: [{ tag: 'blockquote' }],
	toDOM() {
		return ['blockquote', 0];
	},
};

export const blockquote: NodeSpec = blockquoteLegacyFactory(nodeSpecOptions);

/**
 * @name extentedBlockquote
 * @description the block quote node with nested code block, media, and extension
 */
export const extendedBlockquote: NodeSpec = blockquoteFactory(nodeSpecOptions);

const nodeSpecOptionsWithLocalId: NodeSpecOptions<BlockquoteNode> = {
	parseDOM: [
		{
			tag: 'blockquote',
			getAttrs: () => {
				return {
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		return ['blockquote', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
};

export const extendedBlockquoteWithLocalId: NodeSpec = blockquoteFactory(
	nodeSpecOptionsWithLocalId,
);
