import { getTestMediaApiToken } from './get-test-media-api-token';
import { mediaServiceEmoji } from './media-service-emoji';

export const getTestSiteServiceEmojis = () => ({
  emojis: [mediaServiceEmoji],
  meta: {
    mediaApiToken: getTestMediaApiToken(),
  },
});
