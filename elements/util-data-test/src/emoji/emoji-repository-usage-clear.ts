// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiRepository } from '@atlaskit/emoji/resource';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiDescription } from '@atlaskit/emoji/types';

export const isUsageClearEmojiRepository = (
  object: any,
): object is EmojiRepositoryUsageClear => {
  return 'clear' in object;
};

export class EmojiRepositoryUsageClear extends EmojiRepository {
  constructor(emojis: EmojiDescription[]) {
    super(emojis);
  }

  clear() {
    this.usageTracker.clear();
  }
}
