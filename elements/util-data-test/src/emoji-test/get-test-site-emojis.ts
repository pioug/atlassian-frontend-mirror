import { getTestMediaApiToken } from './get-test-media-api-token';
import { mediaEmoji } from './media-emoji';

export const getTestSiteEmojis = () => ({
  emojis: [mediaEmoji],
  meta: {
    mediaApiToken: getTestMediaApiToken(),
  },
});
