import type { BlockCardDefinition, CardAttributes } from '@atlaskit/adf-schema/block-card';

export const blockCard = (attrs: CardAttributes): BlockCardDefinition => ({
	type: 'blockCard',
	attrs,
});
