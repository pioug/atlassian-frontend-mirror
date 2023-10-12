import type { MediaAttributes } from '@atlaskit/adf-schema';

import { hasPrivateAttrsChanged } from '../../nodeviews/helpers';

describe('hasPrivateAttrsChanged', () => {
  test('should return true if any private attribute has changed', () => {
    const currentAttrs: MediaAttributes = {
      id: '1',
      collection: 'image',
      __fileName: 'default.png',
      __fileMimeType: 'image/png',
      __fileSize: 8000,
      __contextId: '78hhj',
      type: 'file',
    };

    const newAttrs: Partial<MediaAttributes> = {
      __fileName: 'new.png',
    };

    expect(hasPrivateAttrsChanged(currentAttrs, newAttrs)).toBe(true);
  });

  test('should return false if no private attribute has changed', () => {
    const currentAttrs: MediaAttributes = {
      id: '1',
      collection: 'image',
      __fileName: 'default.png',
      __fileMimeType: 'image/png',
      __fileSize: 8000,
      __contextId: '78hhj',
      type: 'file',
    };

    const newAttrs: Partial<MediaAttributes> = {
      __fileName: 'default.png',
      __fileMimeType: 'image/png',
      __fileSize: 8000,
      __contextId: '78hhj',
    };

    expect(hasPrivateAttrsChanged(currentAttrs, newAttrs)).toBe(false);
  });

  test('should return true if private attribute becomes defined where it was undefined', () => {
    const currentAttrs: MediaAttributes = {
      id: '1',
      collection: 'image',
      type: 'file',
    };

    const newAttrs: Partial<MediaAttributes> = {
      __fileName: 'new.png',
    };

    expect(hasPrivateAttrsChanged(currentAttrs, newAttrs)).toBe(true);
  });

  test('should return true if private attribute becomes undefined where it was defined', () => {
    const currentAttrs: MediaAttributes = {
      id: '1',
      collection: 'image',
      __fileName: 'old.png',
      type: 'file',
    };

    const newAttrs: Partial<MediaAttributes> = {
      __fileName: undefined,
    };

    expect(hasPrivateAttrsChanged(currentAttrs, newAttrs)).toBe(true);
  });

  test('should return false if both existing and new attribute are undefined', () => {
    const currentAttrs: MediaAttributes = {
      id: '1',
      collection: 'image',
      type: 'file',
    };

    const newAttrs: Partial<MediaAttributes> = {};

    expect(hasPrivateAttrsChanged(currentAttrs, newAttrs)).toBe(false);
  });
});
