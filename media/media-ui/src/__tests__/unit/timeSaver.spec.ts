import { TimeSaver } from '../../customMediaPlayer/timeSaver';

const setLocalStorageValue = (value: typeof localStorage | null) => {
  Object.defineProperty(window, '_localStorage', {
    value,
    writable: true,
  });
  Object.defineProperty(window, 'localStorage', {
    value,
    writable: true,
  });
};

describe('TimeSaver', () => {
  // Most of the happy paths are tested as part of bigger whole in `custom-video.spec.tsx` test suit

  describe('when access to localStorage throws an error', () => {
    let oldLocalStorageValue: typeof localStorage;
    beforeEach(() => {
      oldLocalStorageValue = window.localStorage;
      setLocalStorageValue({
        getItem() {
          throw new Error();
        },
        setItem() {
          throw new Error();
        },
        clear() {
          throw new Error();
        },
        key() {
          throw new Error();
        },
        removeItem(key: string) {
          throw new Error();
        },
        length: 0,
      });
    });

    afterEach(() => {
      setLocalStorageValue(oldLocalStorageValue);
    });

    it('should not blow up', () => {
      const timeSaver = new TimeSaver({
        contentId: 'some-content-id',
      });
      timeSaver.defaultTime = 10;
      expect(timeSaver.defaultTime).toEqual(0);
    });
  });

  describe('when localStorage is null', () => {
    let oldLocalStorageValue: typeof localStorage;
    beforeEach(() => {
      oldLocalStorageValue = window.localStorage;
      setLocalStorageValue(null);
    });

    afterEach(() => {
      setLocalStorageValue(oldLocalStorageValue);
    });

    it('should not blow up', () => {
      const timeSaver = new TimeSaver({
        contentId: 'some-content-id',
      });
      timeSaver.defaultTime = 10;
      expect(timeSaver.defaultTime).toEqual(0);
    });
  });
});
