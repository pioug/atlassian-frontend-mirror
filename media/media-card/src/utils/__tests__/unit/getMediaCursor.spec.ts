import { MediaCardCursor } from '../../../types';
import { getMediaCardCursor } from '../../getMediaCardCursor';

describe('getPointerState', () => {
	it.each`
		useInlinePlayer | useMediaViewer | isErrorStatus | hasCardPreview | mediaType    | expectedMediaCardCursor
		${false}        | ${false}       | ${true}       | ${false}       | ${undefined} | ${undefined}
		${false}        | ${false}       | ${false}      | ${false}       | ${undefined} | ${undefined}
		${true}         | ${false}       | ${false}      | ${true}        | ${undefined} | ${MediaCardCursor.NotReady}
		${true}         | ${true}        | ${false}      | ${true}        | ${undefined} | ${MediaCardCursor.NotReady}
		${true}         | ${false}       | ${false}      | ${true}        | ${'video'}   | ${MediaCardCursor.Action}
		${true}         | ${false}       | ${false}      | ${false}       | ${'video'}   | ${undefined}
		${false}        | ${true}        | ${false}      | ${false}       | ${undefined} | ${MediaCardCursor.Action}
		${false}        | ${false}       | ${false}      | ${false}       | ${undefined} | ${undefined}
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
