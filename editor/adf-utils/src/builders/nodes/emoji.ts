import { EmojiDefinition, EmojiAttributes } from '@atlaskit/adf-schema';

export const emoji = (attrs: EmojiAttributes): EmojiDefinition => ({
  type: 'emoji',
  attrs,
});
