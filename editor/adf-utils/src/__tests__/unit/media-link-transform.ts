import { transformMediaLinkMarks } from '../../transforms/media-link-transform';

import mediaAdf from './__fixtures__/mediaSingle-adf.json';
import mediaExpectedAdf from './__fixtures__/mediaSingle-expected-adf.json';

describe('Media-link-transform', () => {
	it('should move the link mark from mediaSingle to media', () => {
		expect(transformMediaLinkMarks(mediaAdf)).toEqual(mediaExpectedAdf);
	});
});
