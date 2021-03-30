import { JsonLd } from 'json-ld-types';

import { extractBlockUsers } from '../index';
import {
  TEST_BASE_DATA,
  TEST_DOCUMENT,
  TEST_PERSON,
  TEST_PROJECT,
  TEST_TASK,
} from '../../common/__mocks__/jsonld';
import { LinkPerson } from '../../common/person/types';

const getExpectedLinkPersonList = (name = 'my name'): LinkPerson[] => {
  return [
    {
      src: 'https://my.url.com',
      name,
    },
  ];
};
describe('extractors.block.extractBlockUsers', () => {
  it('should return undefined if users cannot be extracted', () => {
    expect(extractBlockUsers(TEST_BASE_DATA)).toBe(undefined);
  });

  it('should extract members from project if present', () => {
    const linkPerson = extractBlockUsers(TEST_PROJECT);
    expect(linkPerson).toEqual(getExpectedLinkPersonList());
  });

  it('should extract assigned members from task if present', () => {
    const modifiedTask: JsonLd.Data.Task = {
      ...TEST_TASK,
      'atlassian:assignedTo': TEST_PERSON,
    };
    const linkPerson = extractBlockUsers(modifiedTask);
    expect(linkPerson).toEqual(getExpectedLinkPersonList());
  });

  it('should extract the person it was updated by for generic data', () => {
    const modifiedDocument: JsonLd.Data.Document = {
      ...TEST_DOCUMENT,
      'atlassian:updatedBy': TEST_PERSON,
    };
    const linkPerson = extractBlockUsers(modifiedDocument);
    expect(linkPerson).toEqual(getExpectedLinkPersonList());
  });

  it('should extract the person it was created by for generic data when update is not present', () => {
    const modifiedBaseData: JsonLd.Data.BaseData = {
      ...TEST_BASE_DATA,
      attributedTo: TEST_PERSON,
    };
    const linkPerson = extractBlockUsers(modifiedBaseData);
    expect(linkPerson).toEqual(getExpectedLinkPersonList());
  });

  it('should favour users from updatedBy over attributedTo', () => {
    const modifiedPerson: JsonLd.Primitives.Person = {
      ...TEST_PERSON,
      name: 'Manjit',
    };
    const modifiedDocument: JsonLd.Data.Document = {
      ...TEST_DOCUMENT,
      'atlassian:updatedBy': modifiedPerson,
      attributedTo: TEST_PERSON,
    };
    const linkPerson = extractBlockUsers(modifiedDocument);
    expect(linkPerson).toEqual(getExpectedLinkPersonList('Manjit'));
  });
});
