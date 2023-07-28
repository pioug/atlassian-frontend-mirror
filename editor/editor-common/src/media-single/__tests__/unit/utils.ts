import { getMediaSinglePixelWidth } from '../../utils';

interface GetMediaSinglePixelWidthTest {
  width: number;
  editorWidth: number;
  widthType?: 'percentage' | 'pixel';
  gutterOffset?: number;
}

describe('getMediaSinglePixelWidth', () => {
  // Param Description in order of appearance. [
  // string                         - test description
  // GetMediaSinglePixelWidthTest   - args for getMediaSinglePixelWidth
  // number                         - expected result
  // ]
  test.each<[string, GetMediaSinglePixelWidthTest, number]>([
    [
      'when width is 100, no widthType, with gutterOffset',
      {
        width: 100,
        editorWidth: 760,
        widthType: undefined,
        gutterOffset: 24,
      },
      760,
    ],
    [
      'when width is 100, no widthType, no gutterOffset',
      {
        width: 100,
        editorWidth: 760,
        widthType: undefined,
        gutterOffset: undefined,
      },
      760,
    ],
    [
      'when width is 50, no widthType, with gutterOffset',
      { width: 50, editorWidth: 760, widthType: undefined, gutterOffset: 24 },
      368,
    ],
    [
      'when width is 50, no widthType, no gutterOffset',
      {
        width: 50,
        editorWidth: 760,
        widthType: undefined,
        gutterOffset: undefined,
      },
      380,
    ],
    [
      'when width is 100 percent, with gutterOffset',
      {
        width: 100,
        editorWidth: 760,
        widthType: 'percentage',
        gutterOffset: 24,
      },
      760,
    ],
    [
      'when width is 100 percent, no gutterOffset',
      {
        width: 100,
        editorWidth: 760,
        widthType: 'percentage',
        gutterOffset: undefined,
      },
      760,
    ],
    [
      'when width is 50 percent, with gutterOffset',
      {
        width: 50,
        editorWidth: 760,
        widthType: 'percentage',
        gutterOffset: 24,
      },
      368,
    ],
    [
      'when width is 50 percent, no gutterOffset',
      {
        width: 50,
        editorWidth: 760,
        widthType: 'percentage',
        gutterOffset: undefined,
      },
      380,
    ],
    [
      'when width is 100 pixel, width gutterOffset',
      { width: 100, editorWidth: 760, widthType: 'pixel', gutterOffset: 24 },
      100,
    ],
    [
      'when width is 345 pixel, with gutterOffset',
      { width: 345, editorWidth: 760, widthType: 'pixel', gutterOffset: 24 },
      345,
    ],
    [
      'when width is 100 pixel, no gutterOffset',
      {
        width: 100,
        editorWidth: 760,
        widthType: 'pixel',
        gutterOffset: undefined,
      },
      100,
    ],
    [
      'when width is 345 pixel, no gutterOffset',
      {
        width: 345,
        editorWidth: 760,
        widthType: 'pixel',
        gutterOffset: undefined,
      },
      345,
    ],
  ])(
    `should return correct pixel for media single %s`,
    (_description, args, result) => {
      expect(
        getMediaSinglePixelWidth(
          args.width,
          args.editorWidth,
          args.widthType,
          args.gutterOffset,
        ),
      ).toEqual(result);
    },
  );
});
