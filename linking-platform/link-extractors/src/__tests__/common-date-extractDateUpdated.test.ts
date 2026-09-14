import { TEST_BASE_DATA } from '../__mocks__/linkingPlatformJsonldMocks';
import { extractDateUpdated } from '../extract-date-updated';
import { type LinkTypeCreated } from '../types';

describe('extractors.date.updated', () => {
	it('returns undefined if not present', () => {
		expect(extractDateUpdated(TEST_BASE_DATA as LinkTypeCreated)).toBe(undefined);
	});

	it('returns date if present', () => {
		expect(
			extractDateUpdated({
				...(TEST_BASE_DATA as LinkTypeCreated),
				updated: 'now',
			}),
		).toBe('now');
	});
});
