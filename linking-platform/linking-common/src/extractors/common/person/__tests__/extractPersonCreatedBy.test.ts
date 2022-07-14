import { extractPersonCreatedBy } from '../extractPersonCreatedBy';
import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_NAME,
  TEST_URL,
  TEST_OBJECT,
} from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA;

describe('extractors.person.createdBy', () => {
  it('returns undefined when createdBy not present', () => {
    expect(extractPersonCreatedBy(BASE_DATA)).toBe(undefined);
  });

  it('returns empty array when createdBy not present - empty array', () => {
    expect(
      extractPersonCreatedBy({
        ...BASE_DATA,
        attributedTo: [],
      }),
    ).toEqual([]);
  });

  it('returns person with name when createdBy is present - link', () => {
    expect(
      extractPersonCreatedBy({
        ...BASE_DATA,
        attributedTo: TEST_LINK,
      }),
    ).toEqual([{ name: TEST_NAME }]);
  });

  it('returns person with name when createdBy is present - link array', () => {
    expect(
      extractPersonCreatedBy({
        ...BASE_DATA,
        attributedTo: [TEST_LINK],
      }),
    ).toEqual([{ name: TEST_NAME }]);
  });

  it('returns person with name when createdBy is present - object', () => {
    expect(
      extractPersonCreatedBy({
        ...BASE_DATA,
        attributedTo: TEST_OBJECT,
      }),
    ).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
  });

  it('returns person with name when createdBy is present - object array', () => {
    expect(
      extractPersonCreatedBy({
        ...BASE_DATA,
        attributedTo: [TEST_OBJECT],
      }),
    ).toEqual([{ name: TEST_NAME, src: TEST_URL }]);
  });
});
