import { messages } from '../components/i18n';
import { CategoryId } from '../components/picker/categories';
import { customCategory, dataURLPrefix } from './constants';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  EmojiId,
  EmojiImageRepresentation,
  EmojiRepresentation,
  EmojiServiceRepresentation,
  EmojiVariationDescription,
  ImageRepresentation,
  MediaApiRepresentation,
  OptionalEmojiDescription,
  SpriteRepresentation,
  SpriteServiceRepresentation,
} from '../types';

export const isSpriteServiceRepresentation = (
  rep: EmojiServiceRepresentation,
): rep is SpriteServiceRepresentation =>
  !!(rep && (<SpriteServiceRepresentation>rep).spriteRef);
export const isSpriteRepresentation = (
  rep: EmojiRepresentation,
): rep is SpriteRepresentation => !!(rep && (<SpriteRepresentation>rep).sprite);
export const isImageRepresentation = (
  rep:
    | EmojiRepresentation
    | EmojiServiceRepresentation
    | EmojiImageRepresentation,
): rep is ImageRepresentation =>
  !!(rep && (<ImageRepresentation>rep).imagePath);
export const isMediaRepresentation = (
  rep: EmojiRepresentation | EmojiImageRepresentation,
): rep is MediaApiRepresentation =>
  !!(rep && (<MediaApiRepresentation>rep).mediaPath);
export const isPromise = <T>(p: any): p is Promise<T> =>
  !!(p && (<Promise<T>>p).then);
export const isEmojiDescription = (
  possibleEmojiDescription: any,
): possibleEmojiDescription is EmojiDescription =>
  possibleEmojiDescription &&
  possibleEmojiDescription.shortName &&
  possibleEmojiDescription.type;

export const isMediaEmoji = (emoji: EmojiDescription) =>
  isMediaRepresentation(emoji.representation);

export const hasDataURLImage = (rep: EmojiRepresentation) =>
  isImageRepresentation(rep) && rep.imagePath.indexOf(dataURLPrefix) === 0;

export const isLoadedMediaEmoji = (emoji: EmojiDescription) =>
  emoji.category === customCategory && hasDataURLImage(emoji.representation);

export const isEmojiDescriptionWithVariations = (
  emoji: OptionalEmojiDescription,
): emoji is EmojiDescriptionWithVariations =>
  !!(emoji && (<EmojiDescriptionWithVariations>emoji).skinVariations);

export const isEmojiVariationDescription = (
  object: any,
): object is EmojiVariationDescription => {
  return 'baseId' in object;
};

export const isMessagesKey = (key: string): key is keyof typeof messages =>
  key in messages;

export const toEmojiId = (emoji: EmojiDescription): EmojiId => ({
  shortName: emoji.shortName,
  id: emoji.id,
  fallback: emoji.fallback,
});

export const toOptionalEmojiId = (
  emoji: OptionalEmojiDescription,
): EmojiId | undefined => {
  if (!emoji) {
    return undefined;
  }
  return toEmojiId(emoji);
};

export const isEmojiIdEqual = (l?: EmojiId, r?: EmojiId) =>
  l === r || (l && r && l.id === r.id && l.shortName === r.shortName);

export const containsEmojiId = (
  emojis: EmojiDescription[],
  emojiId: EmojiId | undefined,
) => {
  if (!emojiId) {
    return false;
  }
  for (let i = 0; i < emojis.length; i++) {
    if (isEmojiIdEqual(emojis[i], emojiId)) {
      return true;
    }
  }
  return false;
};

export const convertImageToMediaRepresentation = (
  rep: ImageRepresentation,
): MediaApiRepresentation => ({
  mediaPath: rep.imagePath,
  height: rep.height,
  width: rep.width,
});

export const convertMediaToImageRepresentation = (
  rep: MediaApiRepresentation,
  newImagePath?: string,
): ImageRepresentation => ({
  imagePath: newImagePath || rep.mediaPath,
  height: rep.height,
  width: rep.width,
});

export const convertMediaToImageEmoji = (
  emoji: EmojiDescription,
  newImagePath?: string,
  useAlt?: boolean,
): EmojiDescription => {
  const mediaRepresentation = emoji.representation;
  const mediaAltRepresentation = emoji.altRepresentation;
  const imgPath = !useAlt ? newImagePath : undefined;
  const altImgPath = useAlt ? newImagePath : undefined;

  if (
    !isMediaRepresentation(mediaRepresentation) &&
    !isMediaRepresentation(mediaAltRepresentation)
  ) {
    return emoji;
  }
  const representation = isMediaRepresentation(mediaRepresentation)
    ? convertMediaToImageRepresentation(mediaRepresentation, imgPath)
    : mediaRepresentation;
  const altRepresentation = isMediaRepresentation(mediaAltRepresentation)
    ? convertMediaToImageRepresentation(mediaAltRepresentation, altImgPath)
    : mediaAltRepresentation;
  const baseEmoji = {
    ...emoji,
    representation,
  };
  return buildEmojiDescriptionWithAltRepresentation(
    baseEmoji,
    altRepresentation,
  );
};

// Prevent altRepresentation: undefined from being returned in EmojiDescription
export const buildEmojiDescriptionWithAltRepresentation = (
  emoji: EmojiDescriptionWithVariations,
  altRepresentation?: EmojiRepresentation,
): EmojiDescriptionWithVariations => {
  if (!altRepresentation) {
    return emoji;
  }
  return {
    ...emoji,
    altRepresentation,
  };
};

export const getCategoryId = (emoji: EmojiDescription): CategoryId =>
  emoji.category as CategoryId;
