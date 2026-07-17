import { transformInvalidMediaContent } from '../../../transforms';

import mediaSingleWithDuplicateCaptions1 from './__fixtures__/mediasingle-with-duplicate-captions-1.json';
import mediaSingleWithDuplicateCaptions1Expected from './__fixtures__/mediasingle-with-duplicate-captions-1-expected.json';
import mediaSingleWithDuplicateCaptions2 from './__fixtures__/mediasingle-with-duplicate-captions-2.json';
import mediaSingleWithDuplicateCaptions2Expected from './__fixtures__/mediasingle-with-duplicate-captions-2-expected.json';
import mediaSingleWithDuplicateCaptions3 from './__fixtures__/mediasingle-with-duplicate-captions-3.json';
import mediaSingleWithDuplicateCaptions3Expected from './__fixtures__/mediasingle-with-duplicate-captions-3-expected.json';
import mediaSingleWithDuplicateMedia from './__fixtures__/mediasingle-with-duplicate-media.json';
import mediaSingleWithDuplicateMediaExpected from './__fixtures__/mediasingle-with-duplicate-media-expected.json';
import mediaSingleWithDuplicateMediaAndCaptions from './__fixtures__/mediasingle-with-duplicate-media-and-captions.json';
import mediaSingleWithDuplicateMediaAndCaptionsExpected from './__fixtures__/mediasingle-with-duplicate-media-and-captions-expected.json';

describe('transformInvalidMediaContent', () => {
	describe('mediaSingle', () => {
		it.each([
			[
				'with duplicated captions and one empty',
				mediaSingleWithDuplicateCaptions1,
				mediaSingleWithDuplicateCaptions1Expected,
			],
			[
				'with duplicated nonempty captions',
				mediaSingleWithDuplicateCaptions2,
				mediaSingleWithDuplicateCaptions2Expected,
			],
			[
				'with duplicated media',
				mediaSingleWithDuplicateMedia,
				mediaSingleWithDuplicateMediaExpected,
			],
			[
				'with duplicated media and captions',
				mediaSingleWithDuplicateMediaAndCaptions,
				mediaSingleWithDuplicateMediaAndCaptionsExpected,
			],
			[
				'with multiple empty and one non-empty caption',
				mediaSingleWithDuplicateCaptions3,
				mediaSingleWithDuplicateCaptions3Expected,
			],
		])('%s', (_, adf, expected) => {
			const { isTransformed, transformedAdf } = transformInvalidMediaContent(adf);
			expect(isTransformed).toEqual(true);
			expect(transformedAdf).toEqual(expected);
		});
	});
});
