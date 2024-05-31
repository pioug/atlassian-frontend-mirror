import { type EmbedCardDefinition, type EmbedCardAttributes } from '@atlaskit/adf-schema';

export const embedCard = (attrs: EmbedCardAttributes): EmbedCardDefinition => ({
	type: 'embedCard',
	attrs,
});
