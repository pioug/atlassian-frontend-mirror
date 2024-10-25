import { type JsonLd } from 'json-ld-types';

import {
	TEST_BASE_DATA,
	TEST_NAME,
	TEST_OBJECT,
	TEST_UNDEFINED_LINK,
} from '../../__mocks__/jsonld';
import { extractLozenge } from '../extractLozenge';

describe('extractors.lozenge.lozenge', () => {
	it('returns undefined if type unsupported for lozenge', () => {
		expect(extractLozenge(TEST_BASE_DATA)).toBe(undefined);
	});

	it('returns undefined if type supported but status in omit list - document (current)', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'schema:TextDigitalDocument',
				'atlassian:state': 'current',
			} as JsonLd.Data.Document),
		).toBe(undefined);
	});

	it('returns lozenge if type supported - document (archived)', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'schema:TextDigitalDocument',
				'atlassian:state': 'archived',
			} as JsonLd.Data.Document),
		).toEqual({ text: 'archived', appearance: 'default' });
	});

	it('returns lozenge if type supported - document (draft)', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'schema:TextDigitalDocument',
				'atlassian:state': 'draft',
			} as JsonLd.Data.Document),
		).toEqual({ text: 'draft', appearance: 'inprogress' });
	});

	it('returns lozenge if type supported - goal', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'atlassian:Goal',
				'atlassian:state': {
					'@type': 'Object',
					name: 'On track',
					appearance: 'success',
				},
				'atlassian:subscriberCount': 0,
			} as JsonLd.Data.Goal),
		).toEqual({ text: 'On track', appearance: 'success' });
	});

	it('returns lozenge if type supported - pull request', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'atlassian:SourceCodePullRequest',
				'atlassian:state': 'OPEN',
			} as JsonLd.Data.SourceCodePullRequest),
		).toEqual({ text: 'open', appearance: 'inprogress' });
	});

	it('returns lozenge if type supported - task with tag', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'atlassian:Task',
				tag: { ...TEST_OBJECT, appearance: 'success' },
			} as any),
		).toEqual({ text: TEST_NAME, appearance: 'success' });
	});

	it('returns lozenge if type supported - task with taskStatus', () => {
		expect(
			extractLozenge({
				...TEST_BASE_DATA,
				'@type': 'atlassian:Task',
				'atlassian:taskStatus': TEST_OBJECT,
			} as JsonLd.Data.Task),
		).toEqual({ text: TEST_NAME, appearance: 'success' });
	});

	it('returns lozenge if type supported - undefined link', () => {
		expect(
			extractLozenge({
				...TEST_UNDEFINED_LINK,
			}),
		).toEqual({ text: 'UNDEFINED', appearance: 'inprogress' });
	});
});
