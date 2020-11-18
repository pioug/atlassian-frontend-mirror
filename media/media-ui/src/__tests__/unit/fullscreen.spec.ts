import { findVendorSpecificProp } from '../../customMediaPlayer/fullscreen';

describe('Fullscreen', () => {
  describe('findVendorSpecificProp', () => {
    it('should return prop as it is if it exists', () => {
      const object: any = {
        'some-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('some-special-prop');
    });

    it('should return `moz` prefixed prop if it exists', () => {
      const object: any = {
        'mozsome-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('mozsome-special-prop');
    });

    it('should return `moz` prefixed and capitalized prop if it exists', () => {
      const object: any = {
        'mozSome-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('mozSome-special-prop');
    });

    it('should return `webkit` prefixed prop if it exists', () => {
      const object: any = {
        'webkitsome-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('webkitsome-special-prop');
    });

    it('should return `webkit` prefixed and capitalized prop if it exists', () => {
      const object: any = {
        'webkitSome-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('webkitSome-special-prop');
    });

    it('should return `ms` prefixed prop if it exists', () => {
      const object: any = {
        'mssome-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('mssome-special-prop');
    });

    it('should return `ms` prefixed and capitalized prop if it exists', () => {
      const object: any = {
        'msSome-special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, 'some-special-prop');
      expect(value).toEqual('msSome-special-prop');
    });

    it('should accept list of props and return value of a first match', () => {
      const object: any = {
        'mozSome-Special-prop': 'some-special-value',
      };
      const value = findVendorSpecificProp(object, [
        'some-special-prop',
        'some-Special-prop',
      ]);
      expect(value).toEqual('mozSome-Special-prop');
    });
  });
});
