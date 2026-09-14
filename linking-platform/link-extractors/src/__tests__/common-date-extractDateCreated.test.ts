import { TEST_BASE_DATA } from '../__mocks__/linkingPlatformJsonldMocks';
import { extractDateCreated } from '../extract-date-created';
import type { LinkTypeCreated } from '../types';

describe('extractors.date.created', () => {
	it('returns undefined if not present', () => {
		expect(extractDateCreated(TEST_BASE_DATA as LinkTypeCreated)).toBe(undefined);
	});

	it('returns date if present', () => {
		expect(
			extractDateCreated({
				...(TEST_BASE_DATA as LinkTypeCreated),
				'schema:dateCreated': 'now',
			}),
		).toBe('now');
	});
});
