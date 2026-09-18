import { defaultMediaFeatureFlags } from '@atlaskit/media-common';

import { exampleMediaFeatureFlags } from '../example-mediaFeatureFlags';

describe('Example MediaFeatureFlags', () => {
	it('should equal defaultMediaFeatureFlags', () => {
		expect(exampleMediaFeatureFlags).toEqual(defaultMediaFeatureFlags);
	});
});
