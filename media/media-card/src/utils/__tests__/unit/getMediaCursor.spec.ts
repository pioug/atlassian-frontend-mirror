import { MediaCardCursor } from '../../../types';
import { getMediaCardCursor } from '../../getMediaCardCursor';

describe('getPointerState', () => {
  it.each`
    useInlinePlayer | useMediaViewer | isErrorStatus | hasCardPreview | mediaType    | expectedMediaCardCursor
    ${false}        | ${false}       | ${true}       | ${false}       | ${undefined} | ${MediaCardCursor.NoAction}
    ${false}        | ${false}       | ${false}      | ${false}       | ${undefined} | ${MediaCardCursor.NoAction}
    ${true}         | ${false}       | ${false}      | ${true}        | ${undefined} | ${MediaCardCursor.NotReady}
    ${true}         | ${true}        | ${false}      | ${true}        | ${undefined} | ${MediaCardCursor.NotReady}
    ${true}         | ${false}       | ${false}      | ${true}        | ${'video'}   | ${MediaCardCursor.Action}
    ${true}         | ${false}       | ${false}      | ${false}       | ${'video'}   | ${MediaCardCursor.NoAction}
    ${false}        | ${true}        | ${false}      | ${false}       | ${undefined} | ${MediaCardCursor.Action}
    ${false}        | ${false}       | ${false}      | ${false}       | ${undefined} | ${MediaCardCursor.NoAction}
  `(
    'expectedMediaCardCursor is $expectedMediaCardCursor when useInlinePlayer is $useInlinePlayer, useMediaViewer is $useMediaViewer, isErrorStatus is $isErrorStatus, hasCardPreview is $hasCardPreview, and mediaType is $mediaType',
    ({
      useInlinePlayer,
      useMediaViewer,
      isErrorStatus,
      hasCardPreview,
      mediaType,
      expectedMediaCardCursor,
    }) => {
      expect(
        getMediaCardCursor(
          useInlinePlayer,
          useMediaViewer,
          isErrorStatus,
          hasCardPreview,
          mediaType,
        ),
      ).toBe(expectedMediaCardCursor);
    },
  );
});
