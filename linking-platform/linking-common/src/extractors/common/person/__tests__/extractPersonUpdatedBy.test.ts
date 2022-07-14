import {
  extractPersonUpdatedBy,
  LinkTypeUpdatedBy,
} from '../extractPersonUpdatedBy';
import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_NAME,
  TEST_PERSON,
  TEST_URL,
} from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkTypeUpdatedBy;

describe('extractors.person.updatedBy', () => {
  it('returns undefined when updatedBy not present', () => {
    expect(extractPersonUpdatedBy(BASE_DATA)).toBe(undefined);
  });

  it('returns person with name when updatedBy is present - link', () => {
    expect(
      extractPersonUpdatedBy({
        ...BASE_DATA,
        'atlassian:updatedBy': TEST_LINK,
      }),
    ).toEqual({ name: TEST_NAME });
  });

  it('returns person with name when updatedBy is present - person', () => {
    expect(
      extractPersonUpdatedBy({
        ...BASE_DATA,
        'atlassian:updatedBy': TEST_PERSON,
      }),
    ).toEqual({ name: TEST_NAME, src: TEST_URL });
  });
});
