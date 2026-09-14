import type { InlineCardDefinition } from '@atlaskit/adf-schema/inline-card';
import type { CardAttributes } from '@atlaskit/adf-schema/block-card';

export const inlineCard = (attrs: CardAttributes): InlineCardDefinition => ({
	type: 'inlineCard',
	attrs,
});
