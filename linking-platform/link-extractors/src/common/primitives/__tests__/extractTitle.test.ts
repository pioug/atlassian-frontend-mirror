import { type JsonLd } from 'json-ld-types';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { TEST_BASE_DATA, TEST_NAME } from '../../__mocks__/linkingPlatformJsonldMocks';
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

	describe('returns correctly formatted title for file', () => {
		const fileMockData = {
			...(TEST_BASE_DATA as any),
			'@type': ['schema:DigitalDocument', 'Document'],
			name: TEST_NAME,
			context: {
				'@type': 'atlassian:SourceCodeRepository',
				name: 'my-repo',
			},
		} as JsonLd.Data.SourceCodeReference;

		ffTest(
			'platform.linking-platform.extractor.improve-bitbucket-file-links',
			() => {
				expect(extractTitle(fileMockData)).toBe(`my-repo: ${TEST_NAME}`);
			},
			() => {
				expect(extractTitle(fileMockData)).toBe(`${TEST_NAME}`);
			},
		);
	});
});
