/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { transformMediaLinkMarks } from '../../transforms/media-link-transform';
import mediaAdf from './__fixtures__/mediaSingle-adf.json';

describe('Media-link-transform', () => {
	it('should move the link mark from mediaSingle to media', () => {
		expect(transformMediaLinkMarks(mediaAdf)).toMatchSnapshot();
	});
});
