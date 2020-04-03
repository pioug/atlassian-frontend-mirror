import { isRotated } from '../../imageMetaData';
import { expectToEqual } from '@atlaskit/media-test-helpers';

describe('Image orientation util', () => {
  describe('isRotated', () => {
    [1, 2, 3, 4].forEach((orientation: number) => {
      it(`should return false when orientation is ${orientation}`, () => {
        expectToEqual(isRotated(orientation), false);
      });
    });
    [5, 6, 7, 8].forEach((orientation: number) => {
      it(`should return false when orientation is ${orientation}`, () => {
        expectToEqual(isRotated(orientation), true);
      });
    });
  });
});
