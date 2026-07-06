/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { transformTextLinkCodeMarks } from '../../../transforms/text-link-code-transform';

import textLinkCodeAdf from './__fixtures__/text-link-code-adf.json';
import textValidMarksAdf from './__fixtures__/text-valid-marks-adf.json';

describe('transformTextLinkCodeMarks', () => {
	it('should remove code marks and preserve link marks on text node', () => {
		const { isTransformed, transformedAdf } = transformTextLinkCodeMarks(textLinkCodeAdf);
		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should not change text nodes with valid mark combinations', () => {
		const { isTransformed, transformedAdf } = transformTextLinkCodeMarks(textValidMarksAdf);
		expect(isTransformed).toEqual(false);
		expect(transformedAdf).toMatchSnapshot();
	});
});
