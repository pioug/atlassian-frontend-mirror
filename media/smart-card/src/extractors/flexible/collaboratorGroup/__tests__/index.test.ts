import { extractPersonsUpdatedBy, LinkTypeUpdatedBy } from '../index';
import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_NAME,
  TEST_PERSON,
  TEST_URL,
} from '../../../common/__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkTypeUpdatedBy;

describe('extractors.person.updatedBy', () => {
  it('returns undefined when updatedBy not present', () => {
    expect(extractPersonsUpdatedBy(BASE_DATA)).toBe(undefined);
  });

  it('returns person with name when updatedBy is present - link', () => {
    expect(
      extractPersonsUpdatedBy({
        ...BASE_DATA,
        'atlassian:updatedBy': TEST_LINK,
      }),
    ).toEqual([{ name: TEST_NAME }]);
  });

  it('returns person with name when updatedBy is present - person', () => {
    expect(
      extractPersonsUpdatedBy({
        ...BASE_DATA,
        'atlassian:updatedBy': TEST_PERSON,
      }),
    ).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
  });
});
