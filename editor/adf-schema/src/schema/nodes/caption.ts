import type { InlineFormattedText, InlineCode } from './types/inline-content';
import type { HardBreakDefinition as HardBreak } from './hard-break';
import type { MentionDefinition as Mention } from './mention';
import type { EmojiDefinition as Emoji } from './emoji';
import type { DateDefinition as Date } from './date';
import type { PlaceholderDefinition as Placeholder } from './placeholder';
import type { InlineCardDefinition as InlineCard } from './inline-card';
import type { StatusDefinition as Status } from './status';
import { caption as captionFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name caption_node
 */
export interface CaptionDefinition {
	attrs?: {
		localId?: string;
	};
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 0
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedInline true
	 */
	content: Array<
		| InlineFormattedText
		| InlineCode
		| HardBreak
		| Mention
		| Emoji
		| Date
		| Placeholder
		| InlineCard
		| Status
	>;
	type: 'caption';
}

export const caption: NodeSpec = captionFactory({
	parseDOM: [
		{
			tag: 'figcaption[data-caption]',
		},
	],
	toDOM() {
		const attrs: Record<string, string> = {
			'data-caption': 'true',
		};

		return ['figcaption', attrs, 0];
	},
});

export const captionWithLocalId: NodeSpec = captionFactory({
	parseDOM: [
		{
			tag: 'figcaption[data-caption]',
			getAttrs: () => {
				return {
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const attrs: Record<string, string> = {
			'data-caption': 'true',
		};
		if (node?.attrs?.localId !== undefined) {
			attrs['data-local-id'] = node.attrs.localId;
		}

		return ['figcaption', attrs, 0];
	},
});
