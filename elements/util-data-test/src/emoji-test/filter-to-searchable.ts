// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiDescription } from '@atlaskit/emoji';

export const filterToSearchable = (emojis: EmojiDescription[]) =>
  emojis.filter(emoji => emoji.searchable);
