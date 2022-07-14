import {
  extractPersonAssignedTo,
  LinkTypeAssignedTo,
} from '../extractPersonAssignedTo';
import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_NAME,
  TEST_URL,
  TEST_PERSON,
} from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkTypeAssignedTo;

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
