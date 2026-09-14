import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { TEST_BASE_DATA } from '../__mocks__/linkingPlatformJsonldMocks';
import { extractDateViewed } from '../extract-date-viewed';

describe('extractors.date.viewed', () => {
	it('returns undefined if not present', () => {
		expect(extractDateViewed(TEST_BASE_DATA as JsonLd.Data.Document)).toBe(undefined);
	});

	it('returns date if present', () => {
		expect(
			extractDateViewed({
				...(TEST_BASE_DATA as JsonLd.Data.Document),
				'atlassian:dateViewed': 'now',
			}),
		).toBe('now');
	});
});
