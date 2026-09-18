import type { CardAttributes } from '@atlaskit/adf-schema/block-card';
import type { InlineCardDefinition } from '@atlaskit/adf-schema/inline-card';

export const inlineCard = (attrs: CardAttributes): InlineCardDefinition => ({
	type: 'inlineCard',
	attrs,
});
