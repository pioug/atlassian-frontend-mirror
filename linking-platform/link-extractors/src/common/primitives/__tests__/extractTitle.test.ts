import { type JsonLd } from '@atlaskit/json-ld-types';

import {
	TEST_BASE_DATA,
	TEST_BASE_DATA_WITH_HIGHLIGHTING,
	TEST_NAME,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractTitle } from '../extractTitle';

describe('extractors.primitives.title', () => {
	it('returns raw string if present', () => {
		expect(extractTitle(TEST_BASE_DATA)).toBe(TEST_NAME);
	});

	it('removes line breaks from name in string', () => {
		expect(
			extractTitle({
				...TEST_BASE_DATA,
				name: 'my\n\r name',
			}),
		).toBe(TEST_NAME);
	});

	it('does not remove characters similar to line breaks from name in string', () => {
		expect(
			extractTitle({
				...TEST_BASE_DATA,
				name: 'my \\name',
			}),
		).toBe(`my \\name`);
	});

	it('returns formatted title for commit', () => {
		expect(
			extractTitle({
				...TEST_BASE_DATA,
				'@type': 'atlassian:SourceCodeCommit',
				'@id': '1234:567898765',
				context: { '@type': 'atlassian:SourceCodeRepository', name: 'my-repo' },
			}),
		).toBe(`my-repo: 56789876 ${TEST_NAME}`);
	});

	it('returns formatted title for pull request', () => {
		expect(
			extractTitle({
				...(TEST_BASE_DATA as any),
				'@type': 'atlassian:SourceCodePullRequest',
				context: { '@type': 'atlassian:SourceCodeRepository', name: 'my-repo' },
				'atlassian:internalId': '43',
			} as JsonLd.Data.SourceCodePullRequest),
		).toBe(`my-repo: #43 ${TEST_NAME}`);
	});

	it('returns formatted title for branch', () => {
		expect(
			extractTitle({
				...(TEST_BASE_DATA as any),
				'@type': 'atlassian:SourceCodeReference',
				context: { '@type': 'atlassian:SourceCodeRepository', name: 'my-repo' },
			} as JsonLd.Data.SourceCodeReference),
		).toBe(`my-repo: ${TEST_NAME}`);
	});

	it('returns correctly formatted title for file', () => {
		const fileMockData = {
			...(TEST_BASE_DATA as any),
			'@type': ['schema:DigitalDocument', 'Document'],
			name: TEST_NAME,
			context: {
				'@type': 'atlassian:SourceCodeRepository',
				name: 'my-repo',
			},
		} as JsonLd.Data.SourceCodeReference;

		expect(extractTitle(fileMockData)).toBe(`my-repo: ${TEST_NAME}`);
	});

	it("removes text highlighting if 'removeTextHighlightingFromTitle' is true", () => {
		expect(extractTitle(TEST_BASE_DATA_WITH_HIGHLIGHTING, true)).toBe(TEST_NAME);
	});

	it('should return undefined if data is not available', () => {
		// @ts-ignore For testing purpose
		expect(extractTitle()).toBeUndefined();
	});
});
