import {
  denormaliseEmojiServiceResponse,
  shouldUseAltRepresentation,
} from '../../../api/EmojiUtils';
import { customCategory } from '../../../util/constants';
import { isEmojiVariationDescription } from '../../../util/type-helpers';
import {
  EmojiDescription,
  EmojiServiceDescription,
  EmojiServiceDescriptionWithVariations,
  EmojiServiceResponse,
  ImageRepresentation,
  SpriteRepresentation,
} from '../../../types';
import {
  defaultMediaApiToken,
  mediaEmoji,
  mediaServiceEmoji,
} from '../_test-data';

describe('EmojiUtils', () => {
  describe('#denormaliseEmojiServiceResponse', () => {
    const emojiFields = [
      'id',
      'name',
      'shortName',
      'type',
      'category',
      'order',
    ];

    const checkFields = (
      actual: { [key: string]: any } = {},
      expected: { [key: string]: any } = {},
      fields: string[] = [],
    ) => {
      fields.forEach((field) => {
        expect(actual[field]).toEqual(expected[field]);
      });
    };

    it('denormaliseEmojiServiceResponse emoji with sprite', () => {
      const spriteRef = 'http://spriteref/test.png';
      const emoji: EmojiServiceDescriptionWithVariations = {
        id: '1f600',
        name: 'grinning face',
        shortName: 'grinning',
        type: 'STANDARD',
        category: 'PEOPLE',
        order: 1,
        skinVariations: [
          {
            id: '1f600-1f3fb',
            name: 'grinning face',
            shortName: ':grinning::skin-tone-2',
            type: 'STANDARD',
            category: 'PEOPLE',
            order: 1,
            representation: {
              spriteRef,
              x: 666,
              y: 777,
              height: 42,
              width: 43,
              xIndex: 6,
              yIndex: 23,
            },
            searchable: true,
          },
        ],
        representation: {
          spriteRef,
          x: 216,
          y: 2304,
          height: 72,
          width: 75,
          xIndex: 3,
          yIndex: 32,
        },
        searchable: true,
      };
      const spriteSheet = {
        url: spriteRef,
        row: 41,
        column: 56,
        height: 2952,
        width: 4032,
      };
      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
        meta: {
          spriteSheets: {
            [spriteRef]: spriteSheet,
          },
        },
      });
      const emojis = emojiResponse.emojis;
      expect(emojis.length).toEqual(1);
      const e = emojis[0];
      checkFields(e, emoji, emojiFields);
      const spriteFields = ['x', 'y', 'height', 'width', 'xIndex', 'yIndex'];
      checkFields(e.representation, emoji.representation, spriteFields);
      const spriteSheetFields = ['url', 'row', 'column', 'height', 'width'];
      const representation = e.representation as SpriteRepresentation;
      checkFields(
        representation && representation.sprite,
        spriteSheet,
        spriteSheetFields,
      );
      expect(e.skinVariations && e.skinVariations.length).toEqual(1);
      if (
        e.skinVariations &&
        emoji.skinVariations &&
        emoji.skinVariations.length
      ) {
        const skinEmoji0 = e.skinVariations[0];
        checkFields(skinEmoji0, emoji.skinVariations[0], spriteFields);
        const skinEmoji0Rep = skinEmoji0.representation as SpriteRepresentation;
        checkFields(skinEmoji0Rep.sprite, spriteSheet, spriteSheetFields);

        if (isEmojiVariationDescription(skinEmoji0)) {
          expect(skinEmoji0.baseId).toEqual(e.id);
        } else {
          fail('The skin variation emoji did not contain a baseId');
        }
      }
    });

    it('denormaliseEmojis emoji with image', () => {
      const emoji = {
        id: '13d29267-ff9e-4892-a484-1a1eef3b5ca3',
        name: 'standup.png',
        shortName: 'standup.png',
        type: 'SITE',
        category: customCategory,
        order: -1,
        skinVariations: [
          {
            id: '13d29267-ff9e-4892-a484-1a1eef3b5c45',
            name: 'standup-large.png',
            shortName: ':standup-large:',
            type: 'SITE',
            category: customCategory,
            order: -1,
            representation: {
              imagePath: 'https://something/something2.png',
              height: 666,
              width: 666,
            },
            searchable: true,
          },
        ],
        representation: {
          imagePath: 'https://something/something.png',
          height: 64,
          width: 64,
        },
        searchable: true,
      };
      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
      });
      const emojis = emojiResponse.emojis;
      expect(emojis.length).toEqual(1);
      const e = emojis[0];
      checkFields(e, emoji, emojiFields);

      checkFields(e.representation, emoji.representation, [
        'imagePath',
        'height',
        'width',
      ]);
      expect(e.skinVariations && e.skinVariations.length).toEqual(1);
      checkFields(
        e.skinVariations && e.skinVariations[0],
        emoji.skinVariations[0],
        ['imagePath', 'height', 'width'],
      );
    });

    it('maps out the ascii field when present', () => {
      const emoji = {
        id: '1f603',
        name: 'smiling face with open mouth',
        fallback: '😃',
        type: 'STANDARD',
        category: 'PEOPLE',
        order: 2,
        representation: {
          spriteRef: 'http:/example.com/sprite.png',
          x: 34,
          y: 0,
          height: 32,
          width: 32,
          xIndex: 1,
          yIndex: 0,
        },
        ascii: [':D', ':-D', '=D'],
        shortName: ':smiley:',
        searchable: true,
      };
      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
      });
      expect(emojiResponse.emojis[0].ascii).toEqual([':D', ':-D', '=D']);
    });

    it('denormalise includes emoji created date and creator user id when present', () => {
      const expectedDate = '2017-09-21T07:47:35Z';
      const expectedUserId = '655363:79c1186c-f343-4c9f-a84a-3a7680327da9';
      const spriteRef = 'http://spriteref/test.png';
      const emoji: EmojiServiceDescription = {
        id: '1f600',
        name: 'monkey trousers',
        shortName: 'monkey_trousers',
        type: 'CUSTOM',
        category: 'PEOPLE',
        order: 1,
        representation: {
          spriteRef,
          x: 216,
          y: 2304,
          height: 72,
          width: 75,
          xIndex: 3,
          yIndex: 32,
        },
        searchable: true,
        creatorUserId: expectedUserId,
        createdDate: expectedDate,
      };

      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
        meta: {},
      });

      const emojis = emojiResponse.emojis;
      expect(emojis.length).toEqual(1);
      const e = emojis[0];

      expect(e.createdDate).toEqual(expectedDate);
      expect(e.creatorUserId).toEqual(expectedUserId);
    });
  });

  it('denormalise works when created date and creator user id are not present', () => {
    const expectedName = 'monkey trousers';
    const spriteRef = 'http://spriteref/test.png';
    const emoji: EmojiServiceDescription = {
      id: '1f600',
      name: expectedName,
      shortName: 'monkey_trousers',
      type: 'CUSTOM',
      category: 'PEOPLE',
      order: 1,
      representation: {
        spriteRef,
        x: 216,
        y: 2304,
        height: 72,
        width: 75,
        xIndex: 3,
        yIndex: 32,
      },
      searchable: true,
    };

    const emojiResponse = denormaliseEmojiServiceResponse({
      emojis: [emoji],
      meta: {},
    });

    const emojis = emojiResponse.emojis;
    expect(emojis.length).toEqual(1);
    const e = emojis[0];

    expect(e.createdDate === undefined).toEqual(true);
    expect(e.creatorUserId === undefined).toEqual(true);
    expect(e.name).toEqual(expectedName);
  });

  describe('#denormaliseServiceRepresentation', () => {
    it('media emoji converted to media representation', () => {
      const mediaApiToken = defaultMediaApiToken();
      const emojiServiceData: EmojiServiceResponse = {
        emojis: [mediaServiceEmoji],
        meta: {
          mediaApiToken,
        },
      };
      const serviceRepresentation = mediaServiceEmoji.representation as ImageRepresentation;
      expect(
        serviceRepresentation.imagePath.indexOf(mediaApiToken.url),
      ).toEqual(0);

      const emojiData = denormaliseEmojiServiceResponse(emojiServiceData);
      expect(emojiData.mediaApiToken).toEqual(mediaApiToken);
      expect(emojiData.emojis.length).toEqual(1);

      const convertedEmoji = emojiData.emojis[0];
      expect(convertedEmoji).toEqual(mediaEmoji);
    });
  });

  describe('#denormaliseServiceAltRepresentation', () => {
    it('handles missing altRepresentations field', () => {
      const emoji: EmojiServiceDescription = {
        id: '13d29267-ff9e-4892-a484-1a1eef3b5ca3',
        name: 'standup.png',
        shortName: 'standup.png',
        type: 'SITE',
        category: customCategory,
        order: -1,
        representation: {
          imagePath: 'https://something/something.png',
          height: 64,
          width: 64,
        },
        searchable: true,
      };
      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
        meta: {},
      });

      const convertedEmoji = emojiResponse.emojis[0];
      expect(convertedEmoji.altRepresentation).toEqual(undefined);
    });

    it('handles an empty altRepresentations map', () => {
      const emoji: EmojiServiceDescription = {
        id: '13d29267-ff9e-4892-a484-1a1eef3b5ca3',
        name: 'standup.png',
        shortName: 'standup.png',
        type: 'SITE',
        category: customCategory,
        order: -1,
        representation: {
          imagePath: 'https://something/something.png',
          height: 64,
          width: 64,
        },
        altRepresentations: {},
        searchable: true,
      };
      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
        meta: {},
      });

      const convertedEmoji = emojiResponse.emojis[0];
      expect(convertedEmoji.altRepresentation).toEqual(undefined);
    });

    it('uses the DPI returned by the altRepresentations map', () => {
      const emoji: EmojiServiceDescription = {
        id: '13d29267-ff9e-4892-a484-1a1eef3b5ca3',
        name: 'standup.png',
        shortName: 'standup.png',
        type: 'SITE',
        category: customCategory,
        order: -1,
        representation: {
          imagePath: 'https://something/something.png',
          height: 64,
          width: 64,
        },
        altRepresentations: {
          XHDPI: {
            imagePath: 'https://something/something3.png',
            height: 128,
            width: 128,
          },
        },
        searchable: true,
      };
      const emojiResponse = denormaliseEmojiServiceResponse({
        emojis: [emoji],
        meta: {},
      });

      const convertedEmoji = emojiResponse.emojis[0];
      expect(convertedEmoji.altRepresentation).toEqual({
        imagePath: 'https://something/something3.png',
        height: 128,
        width: 128,
      });
    });
  });

  describe('#shouldUseAltRepresentation', () => {
    const emoji: EmojiDescription = {
      id: '13d29267-ff9e-4892-a484-1a1eef3b5ca3',
      name: 'standup.png',
      shortName: 'standup.png',
      type: 'SITE',
      category: customCategory,
      order: -1,
      representation: {
        imagePath: 'https://something/something.png',
        height: 64,
        width: 64,
      },
      altRepresentation: {
        imagePath: 'https://something/something3.png',
        height: 128,
        width: 128,
      },
      searchable: true,
    };

    it('is true if fitToHeight is larger than representation.height', () => {
      expect(shouldUseAltRepresentation(emoji, 96)).toEqual(true);
    });

    it('is false if no fitToHeight param', () => {
      expect(shouldUseAltRepresentation(emoji)).toEqual(false);
    });

    it('is false if no altRepresentation', () => {
      const { altRepresentation, ...lowRes } = emoji;
      expect(shouldUseAltRepresentation(lowRes, 96)).toEqual(false);
    });

    it('is false if fitToHeight is less than representation.height', () => {
      expect(shouldUseAltRepresentation(emoji, 48)).toEqual(false);
    });
  });
});
