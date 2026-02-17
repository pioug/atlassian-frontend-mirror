import { type JsonLd } from '@atlaskit/json-ld-types';

import {
	TEST_BASE_DATA,
	TEST_CURRENT_DOCUMENT,
	TEST_LINK,
	TEST_NAME,
	TEST_OBJECT,
} from '../../__mocks__/jsonld';
import { extractState } from '../extractState';

const BASE_DATA = TEST_BASE_DATA as JsonLd.Data.SourceCodePullRequest;
const BASE_DOC_DATA = TEST_CURRENT_DOCUMENT as JsonLd.Data.Document;

describe('extractors.lozenge.state', () => {
	it('returns undefined if state is not present', () => {
		expect(extractState(BASE_DATA)).toBe(undefined);
	});

	it('returns undefined if state is present, but in omit list', () => {
		expect(extractState(BASE_DOC_DATA)).toBe(undefined);
	});

	it('returns lozenge if state is present - link', () => {
		expect(extractState({ ...BASE_DATA, 'atlassian:state': TEST_LINK })).toEqual({
			text: TEST_NAME,
			appearance: 'default',
		});
	});

	it('returns lozenge if state is present - object', () => {
		expect(extractState({ ...BASE_DATA, 'atlassian:state': TEST_OBJECT })).toEqual({
			text: TEST_NAME,
			appearance: 'default',
		});
	});

	it('returns lozenge if state is present - string,', () => {
		expect(extractState({ ...BASE_DATA, 'atlassian:state': 'some-string' })).toEqual({
			text: 'some-string',
			appearance: 'default',
		});
	});

	it('returns lozenge if state is present - string', () => {
		expect(extractState({ ...BASE_DATA, 'atlassian:state': 'OPEN' })).toEqual({
			text: 'open',
			appearance: 'inprogress',
		});
	});

	it('returns lozenge if state is present - queued to merge', () => {
		expect(extractState({ ...BASE_DATA, 'atlassian:state': 'QUEUED TO MERGE' })).toEqual({
			text: 'queued to merge',
			appearance: 'moved',
		});
	});
});
