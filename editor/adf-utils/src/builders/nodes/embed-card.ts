import type { EmbedCardDefinition, EmbedCardAttributes } from '@atlaskit/adf-schema/embed-card';

export const embedCard = (attrs: EmbedCardAttributes): EmbedCardDefinition => ({
	type: 'embedCard',
	attrs,
});
