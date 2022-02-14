import { JsonLd } from 'json-ld-types';

import {
  TEST_BASE_DATA,
  TEST_NAME,
  TEST_PERSON,
} from '../../common/__mocks__/jsonld';
import {
  extractCommentCount,
  extractCreatedBy,
  extractModifiedBy,
  extractProgrammingLanguage,
  extractSubscriberCount,
} from '../utils';

describe('extractCommentCount', () => {
  it('returns undefined when no comment count present', () => {
    expect(extractCommentCount(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when comment count present', () => {
    const value = extractCommentCount({
      ...TEST_BASE_DATA,
      'schema:commentCount': 40,
    } as JsonLd.Data.BaseData);

    expect(value).toBeDefined();
    expect(value).toBe(40);
  });
});

describe('extractCreatedBy', () => {
  it('returns undefined when there is no data on who created the resource', () => {
    expect(extractCreatedBy(TEST_BASE_DATA)).toBeUndefined();
  });

  it('returns name of the person/entity that created the resource', () => {
    const value = extractCreatedBy({
      ...TEST_BASE_DATA,
      attributedTo: TEST_PERSON,
    });
    expect(value).toEqual(TEST_NAME);
  });
});

describe('extractProgrammingLanguage', () => {
  it('returns undefined when no programming language present', () => {
    expect(extractProgrammingLanguage(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when programming language present', () => {
    const value = extractProgrammingLanguage({
      ...TEST_BASE_DATA,
      'schema:programmingLanguage': 'JavaScript',
    } as JsonLd.Data.BaseData);
    expect(value).toBeDefined();
    expect(value).toBe('JavaScript');
  });
});

describe('extractors.detail.SubscriberCount', () => {
  it('returns undefined when no subscriber count present', () => {
    expect(extractSubscriberCount(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when subscriber count present', () => {
    const value = extractSubscriberCount({
      ...TEST_BASE_DATA,
      'atlassian:subscriberCount': 40,
    } as JsonLd.Data.BaseData);
    expect(value).toBeDefined();
    expect(value).toBe(40);
  });
});

describe('extractModifiedBy', () => {
  it('returns undefined when there is no data on who updated the resource', () => {
    expect(extractModifiedBy(TEST_BASE_DATA)).toBeUndefined();
  });

  it('returns name of the person/entity that updated the resource', () => {
    const value = extractModifiedBy({
      ...TEST_BASE_DATA,
      'atlassian:updatedBy': TEST_PERSON,
    } as JsonLd.Data.BaseData);
    expect(value).toEqual(TEST_NAME);
  });
});
