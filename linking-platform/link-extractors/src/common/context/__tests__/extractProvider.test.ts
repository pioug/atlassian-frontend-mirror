import { renderWithIntl as render } from '@atlaskit/link-test-helpers';

import {
  TEST_BASE_DATA,
  TEST_IMAGE,
  TEST_LINK,
  TEST_NAME,
  TEST_OBJECT,
  TEST_URL,
} from '../../__mocks__/jsonld';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';
import { extractProvider } from '../extractProvider';

describe('extractors.context.provider', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns undefined if no generator', () => {
    expect(extractProvider(TEST_BASE_DATA)).toBe(undefined);
  });

  it('throws if generator is a string', () => {
    expect(() =>
      extractProvider({ ...TEST_BASE_DATA, generator: TEST_URL }),
    ).toThrow('Link.generator requires a name and icon.');
  });

  it('returns undefined if link has no name', () => {
    expect(
      extractProvider({
        ...TEST_BASE_DATA,
        generator: { ...(TEST_LINK as any), name: undefined },
      }),
    ).toEqual(undefined);
  });

  it('returns generator with name if link has name', () => {
    expect(
      extractProvider({ ...TEST_BASE_DATA, generator: TEST_LINK }),
    ).toEqual({ text: TEST_NAME });
  });

  it('returns undefined if object has no name', () => {
    expect(
      extractProvider({
        ...TEST_BASE_DATA,
        generator: { ...TEST_OBJECT, name: undefined },
      }),
    ).toEqual(undefined);
  });

  it('returns generator with name if object has name', () => {
    expect(
      extractProvider({
        ...TEST_BASE_DATA,
        generator: { ...TEST_OBJECT, icon: undefined },
      }),
    ).toEqual({ text: TEST_NAME, image: TEST_URL });
  });

  it('returns generator with name, icon if object has name, icon', () => {
    expect(
      extractProvider({
        ...TEST_BASE_DATA,
        generator: TEST_OBJECT,
      }),
    ).toEqual({ text: TEST_NAME, icon: TEST_URL, image: TEST_URL });
  });

  it('returns generator icon for Confluence', () => {
    const provider = extractProvider({
      ...TEST_BASE_DATA,
      generator: { ...TEST_OBJECT, '@id': CONFLUENCE_GENERATOR_ID },
    });
    expect(provider).toBeDefined();
    const { getByLabelText } = render(provider!.icon);
    expect(getByLabelText('Confluence')).toBeDefined();
  });

  it('returns generator icon for Jira', () => {
    const provider = extractProvider({
      ...TEST_BASE_DATA,
      generator: { ...TEST_OBJECT, '@id': JIRA_GENERATOR_ID },
    });
    expect(provider).toBeDefined();
    const { getByLabelText } = render(provider!.icon);
    expect(getByLabelText('Jira')).toBeDefined();
  });

  describe('with image', () => {
    it('returns raw string', () => {
      const provider = extractProvider({
        ...TEST_BASE_DATA,
        generator: { ...TEST_OBJECT, image: TEST_URL },
      });
      expect(provider?.image).toBe(TEST_URL);
    });

    it('returns image url from link', () => {
      const provider = extractProvider({
        ...TEST_BASE_DATA,
        generator: { ...TEST_OBJECT, image: TEST_LINK },
      });
      expect(provider?.image).toBe(TEST_URL);
    });

    it('returns image url from image', () => {
      const provider = extractProvider({
        ...TEST_BASE_DATA,
        generator: { ...TEST_OBJECT, image: TEST_IMAGE },
      });
      expect(provider?.image).toBe(TEST_URL);
    });
  });
});
