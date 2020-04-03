import { BlockCardDefinition, CardAttributes } from '@atlaskit/adf-schema';

export const blockCard = (attrs: CardAttributes): BlockCardDefinition => ({
  type: 'blockCard',
  attrs,
});
