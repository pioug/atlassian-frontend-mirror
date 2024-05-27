import { type BlockCardDefinition, type CardAttributes } from '@atlaskit/adf-schema';

export const blockCard = (attrs: CardAttributes): BlockCardDefinition => ({
  type: 'blockCard',
  attrs,
});
