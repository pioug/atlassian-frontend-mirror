import { type JsonLd } from '@atlaskit/json-ld-types';

import {
	TEST_BASE_DATA,
	TEST_LINK,
	TEST_NAME,
	TEST_PERSON,
	TEST_URL,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractMembers } from '../extractMembers';

const BASE_DATA = TEST_BASE_DATA as JsonLd.Data.Project;

describe('extractors.person.members', () => {
	it('returns undefined when members not present', () => {
		expect(extractMembers(BASE_DATA)).toBe(undefined);
	});

	it('returns person with name when members present - link', () => {
		expect(
			extractMembers({
				...BASE_DATA,
				'atlassian:member': TEST_LINK,
			}),
		).toEqual([{ name: TEST_NAME }]);
	});

	it('returns person with name when members present - object', () => {
		expect(
			extractMembers({
				...BASE_DATA,
				'atlassian:member': TEST_PERSON,
			}),
		).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
	});

	it('returns empty array when members not present - empty collection', () => {
		expect(
			extractMembers({
				...BASE_DATA,
				'atlassian:member': { totalItems: 0, items: [] },
			}),
		).toEqual([]);
	});

	it('returns person with name when members present - collection', () => {
		expect(
			extractMembers({
				...BASE_DATA,
				'atlassian:member': { totalItems: 1, items: [TEST_PERSON] },
			}),
		).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
	});
});
