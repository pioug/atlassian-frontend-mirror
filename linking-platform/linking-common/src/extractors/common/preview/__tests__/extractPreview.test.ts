import { JsonLd } from 'json-ld-types';
import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_OBJECT,
  TEST_STRING,
  TEST_URL,
} from '../../__mocks__/jsonld';
import { expectToEqual } from '@atlaskit/media-test-helpers';
import { extractPreview } from '../extractPreview';

describe('extractPreview()', () => {
  it('returns raw string as src - link', () => {
    const data: JsonLd.Data.BaseData = { ...TEST_BASE_DATA };
    data.preview = {
      ...(TEST_LINK as JsonLd.Primitives.LinkModel),
      'atlassian:aspectRatio': 0.72,
    };
    expectToEqual(extractPreview(data), { src: TEST_URL, aspectRatio: 0.72 });
  });

  it('returns raw url as src - object', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = {
      ...TEST_OBJECT,
      'atlassian:aspectRatio': 0.72,
    };
    expectToEqual(extractPreview(data), { src: TEST_URL, aspectRatio: 0.72 });
  });

  it('returns raw HTML as content - object', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = TEST_OBJECT;
    data.preview.content = TEST_STRING;
    delete data.preview.url;
    expect(extractPreview(data)).toEqual({ content: TEST_STRING });
  });
});
