import type {
	ParagraphDefinition,
	OrderedListDefinition,
	BulletListDefinition,
	CodeBlockDefinition,
	MediaGroupDefinition,
	BlockQuoteDefinition,
	MediaSingleDefinition,
} from '@atlaskit/adf-schema';

export const blockQuote = (
	...content: Array<
		| ParagraphDefinition
		| OrderedListDefinition
		| BulletListDefinition
		| CodeBlockDefinition
		| MediaGroupDefinition
		| MediaSingleDefinition
	>
): BlockQuoteDefinition => ({
	type: 'blockquote',
	content,
});
