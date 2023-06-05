import { getLocalMediaFeatureFlag } from '../../mediaFeatureFlag-local';

const storeWindowProperty = (property: any) => {
  const { [property]: originalProperty } = window;

  afterEach(() => {
    window[property] = originalProperty;
  });
};

describe('Media Feature Flags local', () => {
  storeWindowProperty('localStorage');

  it('should return key value if localStorage is accessible and key exists', () => {
    window.localStorage.setItem('someFlag', 'true');
    expect(getLocalMediaFeatureFlag('someFlag')).toEqual('true');
    window.localStorage.removeItem('someFlag');
  });

  it('should return null if localStorage is accessible and key does not exist', () => {
    expect(getLocalMediaFeatureFlag('someFlag')).toBeNull();
  });

  it('should return null if localStorage is inaccessible', () => {
    window.localStorage.setItem('someFlag', 'true');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      writable: true,
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(() => {
          throw new Error('test error');
        }),
        removeItem: jest.fn(),
      },
    });

    expect(getLocalMediaFeatureFlag('someFlag')).toBeNull();
  });
});
