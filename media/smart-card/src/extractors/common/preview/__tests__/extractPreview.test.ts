import { extractPreview } from '../extractPreview';
import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_URL,
  TEST_OBJECT,
  TEST_STRING,
} from '../../__mocks__/jsonld';

describe('extractors.preview.preview', () => {
  it('returns raw string as src - link', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = TEST_LINK;
    expect(extractPreview(data)).toEqual({ src: TEST_URL });
  });

  it('returns raw url as src - object', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = TEST_OBJECT;
    expect(extractPreview(data)).toEqual({ src: TEST_URL });
  });

  it('returns raw HTML as content - object', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = TEST_OBJECT;
    data.preview.content = TEST_STRING;
    delete data.preview.url;
    expect(extractPreview(data)).toEqual({ content: TEST_STRING });
  });
});
