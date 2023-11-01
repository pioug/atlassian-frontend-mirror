import type { EmojiId } from './src/types';

export default {
  recordConfig: {
    url: 'https://www.example.org/',
  },
  providers: [
    {
      url: 'https://www.example.org/emoji/standard',
    },
    {
      url: 'https://www.example.org/emoji/site-id/site',
      securityProvider: () => ({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    },
  ],
  singleEmojiApi: {
    getUrl: (emojiId: EmojiId) =>
      `https://www.example.org/emoji/${emojiId.id || emojiId.shortName}`,
    securityProvider: () => ({
      headers: {
        'User-Context': '{token}',
        Authorization: 'Bearer {token}',
      },
    }),
  },
  optimisticImageApi: {
    getUrl: (emojiId: EmojiId) =>
      `http://www.example.org/emoji/site-id/${
        emojiId.id || emojiId.shortName
      }/path`,
    securityProvider: () => ({
      headers: {
        'User-Context': '{token}',
        Authorization: 'Bearer {token}',
      },
    }),
  },
};
