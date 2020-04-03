import { InlineCardDefinition, CardAttributes } from '@atlaskit/adf-schema';

export const inlineCard = (attrs: CardAttributes): InlineCardDefinition => ({
  type: 'inlineCard',
  attrs,
});
