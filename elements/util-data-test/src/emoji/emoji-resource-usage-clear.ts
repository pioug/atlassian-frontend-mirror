// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiDescription } from '@atlaskit/emoji/types';
import {
  EmojiRepositoryUsageClear,
  isUsageClearEmojiRepository,
} from './emoji-repository-usage-clear';
import { MockNonUploadingEmojiResource } from './mock-non-uploading-emoji-resource';

export class EmojiResourceUsageClear extends MockNonUploadingEmojiResource {
  constructor(emojis: EmojiDescription[]) {
    super(new EmojiRepositoryUsageClear(emojis));
  }

  clearFrequentlyUsed() {
    if (isUsageClearEmojiRepository(this.emojiRepository)) {
      this.emojiRepository.clear();
    }
  }
}
