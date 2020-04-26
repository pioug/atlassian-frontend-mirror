import { JsonLd } from 'json-ld-types';

import { extractTitle } from '../extractTitle';
import { TEST_BASE_DATA, TEST_NAME } from '../../__mocks__/jsonld';

describe('extractors.primitives.title', () => {
  it('returns raw string if present', () => {
    expect(extractTitle(TEST_BASE_DATA)).toBe(TEST_NAME);
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
});
