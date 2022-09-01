import { EmojiId } from './src/types';

export default {
  providers: [
    {
      url: 'http://localhost:9000/emoji/standard',
    },
    {
      url:
        'http://localhost:9000/emoji/DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5/site',
    },
  ],
  singleEmojiApi: {
    getUrl: (emojiId: EmojiId) =>
      `http://localhost:9000/emoji/${emojiId.id || emojiId.shortName}`,
  },
  optimisticImageApi: {
    getUrl: (emojiId: EmojiId) =>
      `http://localhost:9000/emoji/DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5/${
        emojiId.id || emojiId.shortName
      }/path`,
  },
  allowUpload: true,
};
