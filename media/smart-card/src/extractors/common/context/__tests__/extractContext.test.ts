import { extractContext } from '../extractContext';
import {
  TEST_BASE_DATA,
  TEST_URL,
  TEST_LINK,
  TEST_NAME,
  TEST_OBJECT,
} from '../../__mocks__/jsonld';

describe('extractors.context.context', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns undefined if no context', () => {
    expect(extractContext(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns name as string', () => {
    const data = { ...TEST_BASE_DATA };
    data.context = TEST_URL;
    expect(extractContext(data)).toEqual({ name: TEST_URL });
  });

  it('returns undefined if link has no name', () => {
    const data = { ...TEST_BASE_DATA };
    data.context = { ...(TEST_LINK as any), name: undefined };
    expect(extractContext(data)).toEqual(undefined);
  });

  it('returns context with name if link has name', () => {
    const data = { ...TEST_BASE_DATA };
    data.context = TEST_LINK;
    expect(extractContext(data)).toEqual({ name: TEST_NAME });
  });

  it('returns undefined if object has no name', () => {
    const data = { ...TEST_BASE_DATA };
    data.context = { ...TEST_OBJECT, name: undefined };
    expect(extractContext(data)).toEqual(undefined);
  });

  it('returns context with name if object has name', () => {
    const data = { ...TEST_BASE_DATA };
    data.context = { ...TEST_OBJECT, icon: undefined };
    expect(extractContext(data)).toEqual({ name: TEST_NAME, type: ['Object'] });
  });

  it('returns context with name, icon if object has name, icon', () => {
    const data = { ...TEST_BASE_DATA };
    data.context = TEST_OBJECT;
    expect(extractContext(data)).toEqual({
      name: TEST_NAME,
      type: ['Object'],
      icon: TEST_URL,
    });
  });
});
