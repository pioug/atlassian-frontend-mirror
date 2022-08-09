import { getProduct, getSubProduct } from '../../helpers/utils';

describe('Utility functions unit tests', () => {
  describe('Product Information', () => {
    it('should return the product', () => {
      const productInformation = { product: 'confluence' };

      expect(getProduct(productInformation)).toBe('confluence');
    });

    it('should return the sub-product', () => {
      const productInformation = {
        product: 'embeddedConfluence',
        subProduct: 'JSM',
      };

      expect(getSubProduct(productInformation)).toBe('JSM');
    });

    it("should default to sub-product 'none' if not defined but there is a product", () => {
      const productInformation = {
        product: 'confluence',
      };

      expect(getSubProduct(productInformation)).toBe('none');
    });

    it("should default to 'unknown' if not defined", () => {
      expect(getProduct(undefined)).toBe('unknown');
      expect(getSubProduct(undefined)).toBe('unknown');
    });
  });
});
