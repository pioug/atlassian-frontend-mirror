import {
	TEST_BASE_DATA,
	TEST_LINK,
	TEST_NAME,
	TEST_PERSON,
	TEST_PROJECT,
	TEST_PROJECT_WITHOUT_MEMBERS,
	TEST_URL,
} from '../../../common/__mocks__/jsonld';
import { extractPersonsUpdatedBy, type LinkTypeUpdatedBy } from '../index';

const BASE_DATA = TEST_BASE_DATA as LinkTypeUpdatedBy;

describe('extractors.person.updatedBy', () => {
	it('returns undefined when updatedBy not present', () => {
		expect(extractPersonsUpdatedBy(BASE_DATA)).toBe(undefined);
	});

	it('returns person with name when updatedBy is present - link', () => {
		expect(
			extractPersonsUpdatedBy({
				...BASE_DATA,
				'atlassian:updatedBy': TEST_LINK,
			}),
		).toEqual([{ name: TEST_NAME }]);
	});

	it('returns person with name when updatedBy is present - person', () => {
		expect(
			extractPersonsUpdatedBy({
				...BASE_DATA,
				'atlassian:updatedBy': TEST_PERSON,
			}),
		).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
	});
});

it('returns person with name when members not present but updatedBy is present - link', () => {
	expect(
		extractPersonsUpdatedBy({
			...TEST_PROJECT,
			'atlassian:member': undefined,
			'atlassian:updatedBy': TEST_LINK,
		} as LinkTypeUpdatedBy),
	).toEqual([{ name: TEST_NAME }]);
});

it('returns person with name when members not present but updatedBy is present - person', () => {
	expect(
		extractPersonsUpdatedBy({
			...TEST_PROJECT,
			'atlassian:member': undefined,
			'atlassian:updatedBy': TEST_PERSON,
		} as LinkTypeUpdatedBy),
	).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
});

it('returns undefined when members not present', () => {
	expect(extractPersonsUpdatedBy(TEST_PROJECT_WITHOUT_MEMBERS as any)).toBe(undefined);
});

it('returns person with name when members present - link', () => {
	expect(
		extractPersonsUpdatedBy({
			...TEST_PROJECT,
			'atlassian:member': TEST_LINK,
		}),
	).toEqual([{ name: TEST_NAME }]);
});

it('returns person with name when members present - object', () => {
	expect(
		extractPersonsUpdatedBy({
			...TEST_PROJECT,
			'atlassian:member': TEST_PERSON,
		}),
	).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
});

it('returns a person when members array is empty and updatedBy is present', () => {
	expect(
		extractPersonsUpdatedBy({
			...TEST_PROJECT,
			'atlassian:member': { totalItems: 0, items: [] },
			'atlassian:updatedBy': TEST_PERSON,
		} as LinkTypeUpdatedBy),
	).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
});

it('returns person with name when members present - collection', () => {
	expect(
		extractPersonsUpdatedBy({
			...TEST_PROJECT,
			'atlassian:member': { totalItems: 1, items: [TEST_PERSON] },
		}),
	).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
});
