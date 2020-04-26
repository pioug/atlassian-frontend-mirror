import { JsonLd } from 'json-ld-types';

import { extractTaskStatus } from '../extractTaskStatus';
import { TEST_BASE_DATA, TEST_OBJECT, TEST_NAME } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as JsonLd.Data.Task;

describe('extractors.lozenge.taskStatus', () => {
  it('returns undefined when taskStatus not present', () => {
    expect(extractTaskStatus(BASE_DATA)).toBe(undefined);
  });

  it('returns taskStatus as lozenge when present', () => {
    expect(
      extractTaskStatus({ ...BASE_DATA, 'atlassian:taskStatus': TEST_OBJECT }),
    ).toEqual({ text: TEST_NAME, appearance: 'success' });
  });
});
