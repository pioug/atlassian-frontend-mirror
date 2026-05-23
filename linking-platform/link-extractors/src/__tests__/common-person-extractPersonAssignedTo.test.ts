import { type JsonLd } from '@atlaskit/json-ld-types';

import {
	TEST_BASE_DATA,
	TEST_LINK,
	TEST_NAME,
	TEST_PERSON,
	TEST_URL,
} from '../__mocks__/linkingPlatformJsonldMocks';
import { extractPersonAssignedTo } from '../index';

const BASE_DATA = TEST_BASE_DATA as JsonLd.Data.Task | JsonLd.Data.TaskType;

describe('extractors.person.assigned', () => {
	it('returns undefined when assignedTo not present', () => {
		expect(extractPersonAssignedTo(BASE_DATA)).toBe(undefined);
	});

	it('returns person with name when assignedTo present - link', () => {
		expect(
			extractPersonAssignedTo({
				...BASE_DATA,
				'atlassian:assignedTo': TEST_LINK,
			}),
		).toEqual({ name: TEST_NAME });
	});

	it('returns person with name when assignedTo present - object', () => {
		expect(
			extractPersonAssignedTo({
				...BASE_DATA,
				'atlassian:assignedTo': TEST_PERSON,
			}),
		).toEqual({ name: TEST_NAME, src: TEST_URL });
	});
});
