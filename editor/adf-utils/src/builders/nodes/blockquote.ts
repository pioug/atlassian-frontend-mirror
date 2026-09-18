import type { BlockQuoteDefinition } from '@atlaskit/adf-schema/blockquote';
import type { CodeBlockDefinition } from '@atlaskit/adf-schema/code-block';
import type { OrderedListDefinition, BulletListDefinition } from '@atlaskit/adf-schema/list';
import type { MediaGroupDefinition } from '@atlaskit/adf-schema/media-group';
import type { MediaSingleDefinition } from '@atlaskit/adf-schema/media-single';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';

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
