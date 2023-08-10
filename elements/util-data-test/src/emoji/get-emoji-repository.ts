// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiRepository } from '@atlaskit/emoji/resource';
import { getEmojis } from './get-emojis';

export const getEmojiRepository = () => new EmojiRepository(getEmojis());
