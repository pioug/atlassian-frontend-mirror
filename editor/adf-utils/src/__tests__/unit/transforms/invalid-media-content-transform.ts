/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { transformInvalidMediaContent } from '../../../transforms';

import mediaSingleWithDuplicateCaptions1 from './__fixtures__/mediasingle-with-duplicate-captions-1.json';
import mediaSingleWithDuplicateCaptions2 from './__fixtures__/mediasingle-with-duplicate-captions-2.json';
import mediaSingleWithDuplicateCaptions3 from './__fixtures__/mediasingle-with-duplicate-captions-3.json';
import mediaSingleWithDuplicateMedia from './__fixtures__/mediasingle-with-duplicate-media.json';
import mediaSingleWithDuplicateMediaAndCaptions from './__fixtures__/mediasingle-with-duplicate-media-and-captions.json';

describe('transformInvalidMediaContent', () => {
	describe('mediaSingle', () => {
		it.each([
			['with duplicated captions and one empty', mediaSingleWithDuplicateCaptions1],
			['with duplicated nonempty captions', mediaSingleWithDuplicateCaptions2],
			['with duplicated media', mediaSingleWithDuplicateMedia],
			['with duplicated media and captions', mediaSingleWithDuplicateMediaAndCaptions],
			['with multiple empty and one non-empty caption', mediaSingleWithDuplicateCaptions3],
		])('%s', (_, adf) => {
			const { isTransformed, transformedAdf } = transformInvalidMediaContent(adf);
			expect(isTransformed).toEqual(true);
			expect(transformedAdf).toMatchSnapshot();
		});
	});
});
