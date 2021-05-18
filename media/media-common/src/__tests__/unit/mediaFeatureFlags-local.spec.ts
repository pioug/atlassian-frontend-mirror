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
    window.localStorage.setItem('newCardExperience', 'true');
    expect(getLocalMediaFeatureFlag('newCardExperience')).toEqual('true');
    window.localStorage.removeItem('newCardExperience');
  });

  it('should return null if localStorage is accessible and key does not exist', () => {
    expect(getLocalMediaFeatureFlag('newCardExperience')).toBeNull();
  });

  it('should return null if localStorage is inaccessible', () => {
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

    expect(getLocalMediaFeatureFlag('newCardExperience')).toBeNull();
  });
});
