import {
  customCategory,
  customType,
  mediaEmojiAlternateImagePath,
  mediaEmojiImagePath,
} from '../emoji-constants';

export const mediaEmojiId = {
  id: 'media',
  shortName: ':media:',
  fallback: ':media:',
};

export const mediaEmoji = {
  ...mediaEmojiId,
  name: 'Media example',
  type: customType,
  category: customCategory,
  order: -2,
  representation: {
    mediaPath: mediaEmojiImagePath,
    width: 24,
    height: 24,
  },
  altRepresentation: {
    mediaPath: mediaEmojiAlternateImagePath,
    width: 48,
    height: 48,
  },
  skinVariations: [],
  searchable: true,
};
