import { extractLozengeText } from '../extractLozengeText';
import {
  TEST_BASE_DATA,
  TEST_OBJECT,
  TEST_NAME,
  TEST_UNDEFINED_LINK,
} from '../../__mocks__/jsonld';
import { JsonLd } from 'json-ld-types';

describe('extractLozengeText', () => {
  const mockJsonLdResponse = (data: JsonLd.Data.BaseData): JsonLd.Response => ({
    data,
    meta: {} as JsonLd.Meta.BaseMeta,
  });

  it('returns undefined if type unsupported for lozenge', () => {
    const response = mockJsonLdResponse(TEST_BASE_DATA);

    expect(extractLozengeText(response)).toBe(undefined);
  });

  it('returns undefined if type supported but status in omit list - document (current)', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'schema:TextDigitalDocument',
      'atlassian:state': 'current',
    } as JsonLd.Data.Document);

    expect(extractLozengeText(response)).toBe(undefined);
  });

  it('returns lozenge if type supported - document (archived)', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'schema:TextDigitalDocument',
      'atlassian:state': 'archived',
    } as JsonLd.Data.Document);

    expect(extractLozengeText(response)).toEqual('archived');
  });

  it('returns lozenge if type supported - document (draft)', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'schema:TextDigitalDocument',
      'atlassian:state': 'draft',
    } as JsonLd.Data.Document);

    expect(extractLozengeText(response)).toEqual('draft');
  });

  it('returns lozenge if type supported - goal', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:Goal',
      'atlassian:state': {
        '@type': 'Object',
        name: 'On track',
        appearance: 'success',
      },
      'atlassian:subscriberCount': 0,
    } as JsonLd.Data.Goal);

    expect(extractLozengeText(response)).toEqual('On track');
  });

  it('returns lozenge if type supported - pull request', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:SourceCodePullRequest',
      'atlassian:state': 'OPEN',
    } as JsonLd.Data.SourceCodePullRequest);

    expect(extractLozengeText(response)).toEqual('open');
  });

  it('returns lozenge if type supported - task with tag', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:Task',
      tag: { ...TEST_OBJECT, appearance: 'success' },
    } as any);

    expect(extractLozengeText(response)).toEqual(TEST_NAME);
  });

  it('returns lozenge if type supported - task with taskStatus', () => {
    const response = mockJsonLdResponse({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:Task',
      'atlassian:taskStatus': TEST_OBJECT,
    } as JsonLd.Data.Task);

    expect(extractLozengeText(response)).toEqual(TEST_NAME);
  });

  it('returns lozenge if type supported - undefined link', () => {
    const response = mockJsonLdResponse(TEST_UNDEFINED_LINK);

    expect(extractLozengeText(response)).toEqual('UNDEFINED');
  });
});
