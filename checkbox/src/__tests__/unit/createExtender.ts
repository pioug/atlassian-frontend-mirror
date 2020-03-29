import { createExtender } from '../../utils';

const defaultCssFn = () => ({ display: 'block' });
const defaultComponent = 'div';
const defaultAttributesFn = () => ({});

const TestComponent = {
  component: defaultComponent,
  cssFn: defaultCssFn,
  attributesFn: defaultAttributesFn,
};
const defaultConfig = {
  TestComponent,
};

const overridesComponent = 'span';
const overridesCssFn = () => ({ display: 'inline-block' });
const overridesAttributesFn = () => ({ 'data-testId': 'test' });

const CustomTestComponent = {
  component: overridesComponent,
  cssFn: overridesCssFn,
  attributesFn: overridesAttributesFn,
};

const overrides = {
  TestComponent: CustomTestComponent,
};

describe('createExtender()', () => {
  describe('if no defaults provided', () => {
    it('should throw', () => {
      const overrides = {};
      // @ts-ignore; testing for intentional type negligence.
      expect(() => createExtender(null, overrides)).toThrow();
    });
  });
  describe('if no overrides are passed in, the returned function', () => {
    it('should return a property on the default config, based on a passed in key', () => {
      const getOverrides = createExtender(defaultConfig);
      expect(getOverrides('TestComponent')).toEqual(TestComponent);
    });
  });

  describe('if overrides are passed in, the returned function', () => {
    it('should return an attributesFn on the overrides object if it exists', () => {
      const getOverrides = createExtender(defaultConfig, overrides);
      expect(getOverrides('TestComponent').attributesFn).toEqual(
        overridesAttributesFn,
      );
    });
    it('should return a component on the overrides object if it exists', () => {
      const getOverrides = createExtender(defaultConfig, overrides);
      expect(getOverrides('TestComponent').component).toEqual(
        overridesComponent,
      );
    });
    it('should return a cssFn that calls both the defaultCssFn and the overridesCssFn, if a cssFn exists in the overrides object', () => {
      const defaultCssFn = jest.fn();
      const customCssFn = jest.fn();
      const defaultConfig = {
        TestComponent: {
          ...TestComponent,
          cssFn: defaultCssFn,
        },
      };
      const overrides = {
        TestComponent: {
          cssFn: customCssFn,
        },
      };
      const getOverrides = createExtender(defaultConfig, overrides);
      const { cssFn } = getOverrides('TestComponent');
      cssFn();
      expect(defaultCssFn).toHaveBeenCalled();
      expect(customCssFn).toHaveBeenCalled();
    });
    it('should return the default attributesFn, if a corresponding property does not exist on the overrides object', () => {
      const overrides = {
        TestComponent: {
          ...TestComponent,
          attributesFn: undefined,
        },
      };
      const getOverrides = createExtender(defaultConfig, overrides);
      expect(getOverrides('TestComponent').attributesFn).toEqual(
        defaultAttributesFn,
      );
    });
    it('should return the default cssFn, if a corresponding property does not exist on the overrides object', () => {
      const overrides = {
        TestComponent: {
          ...TestComponent,
          cssFn: undefined,
        },
      };
      const getOverrides = createExtender(defaultConfig, overrides);
      expect(getOverrides('TestComponent').cssFn).toEqual(defaultCssFn);
    });
    it('should return the default component, if a corresponding property does not exist on the overrides object', () => {
      const overrides = {
        TestComponent: {
          ...TestComponent,
          component: undefined,
        },
      };
      const getOverrides = createExtender(defaultConfig, overrides);
      expect(getOverrides('TestComponent').component).toEqual(defaultComponent);
    });
  });
});
