import { extractLozenge } from '../extractLozenge';
import { TEST_BASE_DATA, TEST_OBJECT, TEST_NAME } from '../../__mocks__/jsonld';
import { JsonLd } from 'json-ld-types';

describe('extractors.lozenge.lozenge', () => {
  it('returns undefined if type unsupported for lozenge', () => {
    expect(extractLozenge(TEST_BASE_DATA)).toBe(undefined);
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
});
