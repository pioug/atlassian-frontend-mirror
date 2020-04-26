import { JsonLd } from 'json-ld-types';

import { extractTaskType } from '../extractTaskType';
import {
  TEST_BASE_DATA,
  TEST_URL,
  TEST_LINK,
  TEST_OBJECT,
  TEST_NAME,
} from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as JsonLd.Data.Task;

describe('extractors.lozenge.taskType', () => {
  it('returns undefined if taskType not present', () => {
    expect(extractTaskType(BASE_DATA)).toBe(undefined);
  });

  it('returns taskType with id as string if taskType present - string', () => {
    expect(
      extractTaskType({ ...BASE_DATA, 'atlassian:taskType': TEST_URL }),
    ).toEqual({ id: TEST_URL });
  });

  it('returns taskType with id as href if taskType present - link', () => {
    expect(
      extractTaskType({ ...BASE_DATA, 'atlassian:taskType': TEST_LINK }),
    ).toEqual({ id: TEST_URL });
  });

  it('returns taskType with id, icon if taskType present - link', () => {
    expect(
      extractTaskType({
        ...BASE_DATA,
        'atlassian:taskType': { ...TEST_OBJECT, '@id': 'task-type-id' },
      }),
    ).toEqual({ id: 'task-type-id', icon: TEST_URL, name: TEST_NAME });
  });
});
