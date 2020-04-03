/**
 * Mocking out emojis for the editor, so they easily fall back to text.
 */
import { EmojiProvider } from '@atlaskit/emoji/resource';

class EmojiProviderImpl implements EmojiProvider {
  findByShortName() {
    return undefined;
  }

  findByEmojiId() {
    return undefined;
  }

  findById() {
    return undefined;
  }

  findInCategory() {
    return Promise.resolve([]);
  }

  getAsciiMap() {
    return Promise.resolve(new Map());
  }

  getFrequentlyUsed() {
    return Promise.resolve([]);
  }

  recordSelection() {
    return Promise.resolve();
  }

  deleteSiteEmoji() {
    return Promise.resolve(false);
  }

  loadMediaEmoji() {
    return undefined;
  }

  optimisticMediaRendering() {
    return false;
  }

  getSelectedTone() {
    return undefined;
  }

  getCurrentUser() {
    return undefined;
  }

  setSelectedTone() {}
  filter() {}
  subscribe() {}
  unsubscribe() {}
}

export default new EmojiProviderImpl();
