import { pickerClickedEvent } from '../../../util/analytics';

const attributesForId = (emojiId: string) =>
  pickerClickedEvent({
    queryLength: 0,
    emojiId,
    category: 'PEOPLE',
    type: 'STANDARD',
    duration: 1,
  }).attributes;

const makeMatcher = (attrs: any) =>
  expect.objectContaining({
    packageName: expect.any(String),
    packageVersion: expect.any(String),
    ...attrs,
    queryLength: 0,
    category: 'PEOPLE',
    type: 'STANDARD',
    duration: 1,
  });

describe('Picker clicked', () => {
  describe('SkinToneModifier', () => {
    it('should detect skin tones', () => {
      expect(attributesForId('1f3c2-1f3fb')).toEqual(
        makeMatcher({
          skinToneModifier: 'light',
          baseEmojiId: '1f3c2',
        }),
      );

      expect(attributesForId('1f9d7-1f3fc')).toEqual(
        makeMatcher({
          skinToneModifier: 'mediumLight',
          baseEmojiId: '1f9d7',
        }),
      );

      expect(attributesForId('1f939-1f3fd')).toEqual(
        makeMatcher({
          skinToneModifier: 'medium',
          baseEmojiId: '1f939',
        }),
      );

      expect(attributesForId('1f3c4-1f3fe')).toEqual(
        makeMatcher({
          skinToneModifier: 'mediumDark',
          baseEmojiId: '1f3c4',
        }),
      );

      expect(attributesForId('1f6c0-1f3ff')).toEqual(
        makeMatcher({
          skinToneModifier: 'dark',
          baseEmojiId: '1f6c0',
        }),
      );
    });
  });
});
