import {
  buildEmojiDescriptionWithAltRepresentation,
  convertMediaToImageEmoji,
  convertMediaToImageRepresentation,
} from '../../../util/type-helpers';
import {
  EmojiDescriptionWithVariations,
  MediaApiRepresentation,
} from '../../../types';
import { evilburnsEmoji, mediaEmoji } from '../_test-data';

const newPath = 'http://new-path/';

describe('#convertMediaToImageEmoji', () => {
  it('should return original if not media emoji', () => {
    expect(convertMediaToImageEmoji(evilburnsEmoji)).toEqual(evilburnsEmoji);
  });

  it('should convert MediaApiRepresentation to ImageRepresentation', () => {
    expect(convertMediaToImageEmoji(mediaEmoji)).toEqual({
      ...mediaEmoji,
      representation: convertMediaToImageRepresentation(
        mediaEmoji.representation as MediaApiRepresentation,
      ),
      altRepresentation: convertMediaToImageRepresentation(
        mediaEmoji.altRepresentation as MediaApiRepresentation,
      ),
    });
  });

  it('should not include altRepresentation field if mediaEmoji does not contain it', () => {
    const { altRepresentation, ...newEmoji } = mediaEmoji;
    expect(convertMediaToImageEmoji(newEmoji)).toEqual({
      ...newEmoji,
      representation: convertMediaToImageRepresentation(
        mediaEmoji.representation as MediaApiRepresentation,
      ),
    });
  });

  it('should apply the new image path to representation if not useAlt', () => {
    const newRepresentation = {
      ...convertMediaToImageRepresentation(
        mediaEmoji.representation as MediaApiRepresentation,
      ),
      imagePath: newPath,
    };
    expect(convertMediaToImageEmoji(mediaEmoji, newPath)).toEqual({
      ...mediaEmoji,
      representation: newRepresentation,
      altRepresentation: convertMediaToImageRepresentation(
        mediaEmoji.altRepresentation as MediaApiRepresentation,
      ),
    });
  });

  it('should apply the new image path to altRepresentation if useAlt', () => {
    const newAltRepresentation = {
      ...convertMediaToImageRepresentation(
        mediaEmoji.altRepresentation as MediaApiRepresentation,
      ),
      imagePath: newPath,
    };
    expect(convertMediaToImageEmoji(mediaEmoji, newPath, true)).toEqual({
      ...mediaEmoji,
      representation: convertMediaToImageRepresentation(
        mediaEmoji.representation as MediaApiRepresentation,
      ),
      altRepresentation: newAltRepresentation,
    });
  });
});

describe('#buildEmojiDescriptionWithAltRepresentation', () => {
  const emoji: EmojiDescriptionWithVariations = {
    id: '1f600',
    name: 'grinning face',
    shortName: ':grinning:',
    type: 'STANDARD',
    category: 'PEOPLE',
    order: 1,
    representation: {
      imagePath: 'https://something/something.png',
      height: 64,
      width: 64,
    },
    skinVariations: [
      {
        id: '1f600-1f3fb',
        name: 'grinning face',
        shortName: ':grinning::skin-tone-2',
        type: 'STANDARD',
        category: 'PEOPLE',
        order: 1,
        representation: {
          imagePath: 'https://something/something2.png',
          height: 64,
          width: 64,
        },
        searchable: true,
      },
    ],
    searchable: true,
  };

  it('does not contain altRepresentation in the returned EmojiDescription if undefined', () => {
    expect(
      buildEmojiDescriptionWithAltRepresentation(emoji, undefined),
    ).toEqual(emoji);
  });

  it('adds altRepresentation to the EmojiDescription if is defined representation', () => {
    const altRepresentation = {
      imagePath: 'https://something/something3.png',
      height: 128,
      width: 128,
    };
    expect(
      buildEmojiDescriptionWithAltRepresentation(emoji, altRepresentation),
    ).toEqual({ ...emoji, altRepresentation });
  });
});
