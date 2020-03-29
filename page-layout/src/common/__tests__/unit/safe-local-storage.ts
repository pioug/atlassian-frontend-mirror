import safeLocalStorage from '../../safe-local-storage';
declare var window: { __localStorageFallback?: Storage };

describe('safeLocalStorage', () => {
  it('should return localStorage when available', () => {
    safeLocalStorage().setItem('someKey', 'someValue');

    expect(safeLocalStorage().getItem('someKey')).toBe('someValue');
    expect(window.__localStorageFallback).toBeUndefined();
  });

  describe('when localStorage is unavaiable', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: void 0,
      });
    });

    it('setItem should store value in __localStorageFallback', () => {
      safeLocalStorage().setItem('someKey', 'someValue');

      expect(window.__localStorageFallback).toStrictEqual({
        someKey: 'someValue',
      });
    });

    it('getItem should return value from __localStorageFallback', () => {
      safeLocalStorage().setItem('someKey', 'someValue');

      expect(safeLocalStorage().getItem('someKey')).toBe('someValue');
      expect(window.__localStorageFallback).toStrictEqual({
        someKey: 'someValue',
      });
    });

    it('removeItem should remove value from __localStorageFallback', () => {
      safeLocalStorage().setItem('someKey', 'someValue');
      safeLocalStorage().setItem('someOtherKey', 'someOtherValue');
      safeLocalStorage().removeItem('someKey');

      expect(window.__localStorageFallback).toStrictEqual({
        someOtherKey: 'someOtherValue',
      });
    });

    it('clearItem should clear __localStorageFallback', () => {
      safeLocalStorage().setItem('someKey', 'someValue');
      safeLocalStorage().setItem('someOtherKey', 'someOtherValue');
      safeLocalStorage().clear();

      expect(window.__localStorageFallback).toStrictEqual({});
    });

    it('length should return number of items in __localStorageFallback', () => {
      safeLocalStorage().setItem('someKey', 'someValue');
      safeLocalStorage().setItem('someOtherKey', 'someOtherValue');

      expect(safeLocalStorage().length).toBe(2);

      safeLocalStorage().removeItem('someKey');

      expect(safeLocalStorage().length).toBe(1);
    });
  });
});
