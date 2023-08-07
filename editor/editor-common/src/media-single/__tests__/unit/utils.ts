import { calcMediaPxWidth } from '../../../ui/MediaSingle/grid';
import {
  calcMediaSinglePixelWidth,
  calcMediaSinglePixelWidthProps,
  calculateOffsetLeft,
  getMediaSinglePixelWidth,
} from '../../utils';

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

describe('calcMediaSinglePixelWidth', () => {
  test.each<[string, calcMediaSinglePixelWidthProps, number]>([
    [
      'when original width is small',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'center',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'center',
        pctWidth: undefined,
      }),
    ],
    [
      'when original width is large and content width is defined',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 800,
        layout: 'center',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 800,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'center',
        pctWidth: undefined,
      }),
    ],
    [
      'when original width is large and only container width is defined',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 2400,
        layout: 'center',
        contentWidth: undefined,
        containerWidth: 1618,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 2400,
        origHeight: 300,
        containerWidth: { lineLength: undefined, width: 1618 },
        layout: 'center',
        pctWidth: undefined,
      }),
    ],
    [
      'when original width is large and content width is undefined and container width is 0',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 2400,
        layout: 'center',
        contentWidth: undefined,
        containerWidth: 0,
        gutterOffset: 24,
      },
      // since legacy experience return 0 in this case,
      // we test it against new experience
      760,
    ],
    [
      'when layout is aligned and wide viewport',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'align-end',
        contentWidth: 760,
        containerWidth: 1362,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: 760, width: 1362 },
        layout: 'align-end',
      }),
    ],
    [
      'when layout is aligned and narrow viewport',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'align-end',
        contentWidth: 500,
        containerWidth: 600,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: 500, width: 600 },
        layout: 'align-end',
      }),
    ],

    [
      'when layout is wide and contentWidth is undefined',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'wide',
        contentWidth: undefined,
        containerWidth: 600,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 600 },
        layout: 'wide',
      }),
    ],
  ])(
    `should return correct pixel value for not resized legacy media single %s`,
    (_description, args, result) => {
      expect(calcMediaSinglePixelWidth({ ...args })).toEqual(result);
    },
  );
  test.each<[string, calcMediaSinglePixelWidthProps, number]>([
    [
      'with center layout',
      {
        width: 66.66,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'center',
        contentWidth: undefined,
        containerWidth: 600,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 600 },
        layout: 'center',
        pctWidth: 66.66,
        resizedPctWidth: 66.66,
      }),
    ],
    [
      'with center layout (not resized)',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'center',
        contentWidth: undefined,
        containerWidth: 800,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 800 },
        layout: 'center',
        pctWidth: undefined,
        resizedPctWidth: undefined,
      }),
    ],
    [
      'with align-start layout',
      {
        width: 66.66,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'align-start',
        contentWidth: undefined,
        containerWidth: 600,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 600 },
        layout: 'align-start',
        pctWidth: 66.66,
        resizedPctWidth: 66.66,
      }),
    ],
    [
      'with align-start layout (not resized)',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'align-start',
        contentWidth: undefined,
        containerWidth: 600,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 600 },
        layout: 'align-start',
        pctWidth: undefined,
        resizedPctWidth: undefined,
      }),
    ],
    [
      'with wrap-right layout',
      {
        width: 46.6,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'wrap-right',
        contentWidth: undefined,
        containerWidth: 1200,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 1200 },
        layout: 'wrap-right',
        pctWidth: 46.6,
        resizedPctWidth: 46.6,
      }),
    ],
    [
      'with wrap-right layout (not resized)',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'wrap-right',
        contentWidth: undefined,
        containerWidth: 1200,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 1200 },
        layout: 'wrap-right',
        pctWidth: undefined,
        resizedPctWidth: undefined,
      }),
    ],
    [
      'with wide layout',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 600,
        layout: 'wide',
        contentWidth: undefined,
        containerWidth: 600,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 600,
        origHeight: 650,
        containerWidth: { lineLength: undefined, width: 600 },
        layout: 'wide',
      }),
    ],
  ])(
    `should return correct pixel value for legacy media single %s when contentWidth is undefined`,
    (_description, args, result) => {
      expect(calcMediaSinglePixelWidth({ ...args })).toEqual(result);
    },
  );

  test.each<[string, calcMediaSinglePixelWidthProps, number]>([
    [
      'with center layout',
      {
        width: 66.6,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'center',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'center',
        pctWidth: 66.6,
        resizedPctWidth: 66.6,
      }),
    ],
    [
      'with align-end layout',
      {
        width: 88.88,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'align-end',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'align-end',
        pctWidth: 88.88,
        resizedPctWidth: 88.88,
      }),
    ],
    [
      'with wrap-left layout',
      {
        width: 77.77,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'wrap-left',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'wrap-left',
        pctWidth: 77.77,
        resizedPctWidth: 77.77,
      }),
    ],
    [
      'with wide layout',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'wide',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'wide',
      }),
    ],
    [
      'with wide layout and narrow viewport',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'wide',
        contentWidth: 760,
        containerWidth: 700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 700 },
        layout: 'wide',
      }),
    ],
    [
      // occasionally wide layout would still have dirty width attribute defined
      'with wide layout and defined width',
      {
        width: 88.88,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'wide',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      calcMediaPxWidth({
        origWidth: 400,
        origHeight: 300,
        containerWidth: { lineLength: 760, width: 1700 },
        layout: 'wide',
        pctWidth: 88.88,
        resizedPctWidth: 88.88,
      }),
    ],
    [
      'with full-width layout',
      {
        width: undefined,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'full-width',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      1636,
    ],
    [
      // occasionally full-width layout would still have dirty width attribute defined
      'with full-width layout',
      {
        width: 88.88,
        widthType: 'percentage',
        origWidth: 400,
        layout: 'full-width',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      1636,
    ],
  ])(
    `should return correct pixel value for resized legacy media single %s`,
    (_description, args, result) => {
      expect(calcMediaSinglePixelWidth({ ...args })).toEqual(result);
    },
  );

  test.each<[string, calcMediaSinglePixelWidthProps, number]>([
    [
      'in wide viewport',
      {
        width: 636,
        widthType: 'pixel',
        origWidth: 400,
        layout: 'center',
        contentWidth: 760,
        containerWidth: 1700,
        gutterOffset: 24,
      },
      636,
    ],
    [
      'in narrow viewport',
      {
        width: 636,
        widthType: 'pixel',
        origWidth: 400,
        layout: 'center',
        contentWidth: 400,
        containerWidth: 510,
        gutterOffset: 24,
      },
      636,
    ],
  ])(
    `should return correct pixel value for new media single %s`,
    (_description, args, result) => {
      expect(calcMediaSinglePixelWidth({ ...args })).toEqual(result);
    },
  );
});

describe('calculateOffsetLeft', () => {
  const testWrapper: HTMLElement = document.createElement('div');
  const testPmViewDom: Element = document.createElement('div');

  beforeEach(() => {
    jest.spyOn(testWrapper, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 200,
      right: 0,
      bottom: 0,
      toJSON: () => {},
    });
    jest.spyOn(testPmViewDom, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 100,
      right: 0,
      bottom: 0,
      toJSON: () => {},
    });
  });

  it('should have an offset left of zero when inside layout', () => {
    const testInsideInlineLike: boolean = true;
    const testInsideLayout: boolean = true;

    const offsetLeft = calculateOffsetLeft(
      testInsideInlineLike,
      testInsideLayout,
      testPmViewDom,
      testWrapper,
    );

    expect(offsetLeft).toEqual(0);
  });

  it('should have a non-zero offset left when outside of layout', () => {
    const testInsideInlineLike: boolean = true;
    const testInsideLayout: boolean = false;

    const offsetLeft = calculateOffsetLeft(
      testInsideInlineLike,
      testInsideLayout,
      testPmViewDom,
      testWrapper,
    );

    expect(offsetLeft).toEqual(100);
  });
});
