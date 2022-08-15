import { mockWindowStorage, STORAGE_MOCK } from './main';

describe('local-storage', () => {
  const originalLocalStorage = global.localStorage;
  const originalSessionStorage = global.sessionStorage;

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
    });
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    global.sessionStorage = originalSessionStorage;
  });

  it('mockWindowStorage mocks no storage engines on the window', () => {
    expect(window.localStorage).toEqual(originalLocalStorage);
    expect(window.sessionStorage).toEqual(originalSessionStorage);

    mockWindowStorage([]);

    expect(window.localStorage).toEqual(originalLocalStorage);
    expect(window.sessionStorage).toEqual(originalSessionStorage);
  });

  it('mockWindowStorage mocks localStorage on the window', () => {
    expect(window.localStorage).toEqual(originalLocalStorage);

    mockWindowStorage(['localStorage']);

    expect(window.localStorage).toEqual<Storage>(STORAGE_MOCK);
    expect(window.localStorage).not.toBe<Storage>(STORAGE_MOCK); // this should be a new reference
    expect(window.localStorage).not.toBe(window.sessionStorage);
  });

  it('mockWindowStorage mocks sessionStorage on the window', () => {
    expect(window.sessionStorage).toEqual(originalSessionStorage);

    mockWindowStorage(['sessionStorage']);

    expect(window.sessionStorage).toEqual<Storage>(STORAGE_MOCK);
    expect(window.sessionStorage).not.toBe<Storage>(STORAGE_MOCK); // this should be a new reference
    expect(window.localStorage).not.toBe(window.sessionStorage);
  });

  it('mockWindowStorage mocks both storage engines on the window', () => {
    expect(window.localStorage).toEqual(originalLocalStorage);
    expect(window.sessionStorage).toEqual(originalSessionStorage);

    mockWindowStorage();

    expect(window.localStorage).toEqual<Storage>(STORAGE_MOCK);
    expect(window.localStorage).not.toBe<Storage>(STORAGE_MOCK); // this should be a new reference
    expect(window.sessionStorage).toEqual<Storage>(STORAGE_MOCK);
    expect(window.sessionStorage).not.toBe<Storage>(STORAGE_MOCK); // this should be a new reference
    expect(window.localStorage).not.toBe(window.sessionStorage);
  });
});
