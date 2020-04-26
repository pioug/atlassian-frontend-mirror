import { extractProvider } from '../extractProvider';
import {
  TEST_BASE_DATA,
  TEST_URL,
  TEST_LINK,
  TEST_NAME,
  TEST_OBJECT,
} from '../../__mocks__/jsonld';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../../constants';
import { mount } from 'enzyme';
import { render } from '../../__mocks__/render';

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
    ).toEqual({ text: TEST_NAME });
  });

  it('returns generator with name, icon if object has name, icon', () => {
    expect(
      extractProvider({
        ...TEST_BASE_DATA,
        generator: TEST_OBJECT,
      }),
    ).toEqual({ text: TEST_NAME, icon: TEST_URL });
  });

  it('returns generator icon for Confluence', () => {
    const provider = extractProvider({
      ...TEST_BASE_DATA,
      generator: { ...TEST_OBJECT, '@id': CONFLUENCE_GENERATOR_ID },
    });
    expect(provider).toBeDefined();
    expect(mount(render(provider!.icon)).find('ConfluenceIcon')).toHaveLength(
      1,
    );
  });

  it('returns generator icon for Jira', () => {
    const provider = extractProvider({
      ...TEST_BASE_DATA,
      generator: { ...TEST_OBJECT, '@id': JIRA_GENERATOR_ID },
    });
    expect(provider).toBeDefined();
    expect(mount(render(provider!.icon)).find('JiraIcon')).toHaveLength(1);
  });
});
