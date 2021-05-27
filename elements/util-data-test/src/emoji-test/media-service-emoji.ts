import {
  customCategory,
  customType,
  mediaEmojiAlternateImagePath,
  mediaEmojiImagePath,
} from '../emoji-constants';

export const mediaServiceEmoji = {
  id: 'media',
  shortName: ':media:',
  name: 'Media example',
  fallback: ':media:',
  type: customType,
  category: customCategory,
  order: -2,
  representation: {
    imagePath: mediaEmojiImagePath,
    width: 24,
    height: 24,
  },
  altRepresentations: {
    XHDPI: {
      imagePath: mediaEmojiAlternateImagePath,
      width: 48,
      height: 48,
    },
  },
  searchable: true,
};
