import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';
import type { OrderedListDefinition, BulletListDefinition } from '@atlaskit/adf-schema/list';
import type { CodeBlockDefinition } from '@atlaskit/adf-schema/code-block';
import type { MediaGroupDefinition } from '@atlaskit/adf-schema/media-group';
import type { BlockQuoteDefinition } from '@atlaskit/adf-schema/blockquote';
import type { MediaSingleDefinition } from '@atlaskit/adf-schema/media-single';

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
