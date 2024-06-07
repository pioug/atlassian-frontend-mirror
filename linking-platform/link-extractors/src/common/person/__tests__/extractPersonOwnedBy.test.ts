import {
	TEST_BASE_DATA,
	TEST_NAME,
	TEST_PERSON,
	TEST_URL,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractPersonOwnedBy } from '../extractPersonOwnedBy';

describe('extractors.person.ownedBy', () => {
	it('returns undefined when ownedBy not present', () => {
		expect(extractPersonOwnedBy(TEST_BASE_DATA)).toBe(undefined);
	});

	it('returns person with name when ownedBy is present - person', () => {
		expect(
			extractPersonOwnedBy({
				...TEST_BASE_DATA,
				'atlassian:ownedBy': TEST_PERSON,
			}),
		).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
	});
});
