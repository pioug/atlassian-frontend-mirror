import { EmojiResource } from '../../../api/EmojiResource';

/**
 * #initSiteEmojiResource throws error
 */
export class ErrorEmojiResource extends EmojiResource {
  getActiveLoaders() {
    return this.activeLoaders;
  }

  initSiteEmojiResource(): Promise<void> {
    throw new Error('Cannot initSiteEmojiResource');
  }
}
