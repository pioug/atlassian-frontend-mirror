import { validateAttrs } from '../../../validator';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { AttributesSpec } from '@atlaskit/adf-utils/validatorTypes';

jest.mock('../../rules', () => ({
  validatorFnMap: {
    someCustomFunction: () => true,
    anotherCustomFunction: () => false,
  },
}));

describe('validateAttrs', () => {
  describe('boolean', () => {
    const spec = { type: 'boolean' } as any;

    it('should pass for boolean', () => {
      expect(validateAttrs(spec, true)).toBeTruthy();
      expect(validateAttrs(spec, false)).toBeTruthy();
    });

    it('should fail for non-boolean', () => {
      expect(validateAttrs(spec, null)).toBeFalsy();
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(validateAttrs(spec, '7')).toBeFalsy();
      expect(validateAttrs(spec, 1)).toBeFalsy();
      expect(validateAttrs(spec, 0)).toBeFalsy();
      expect(validateAttrs(spec, [5])).toBeFalsy();
      expect(validateAttrs(spec, () => {})).toBeFalsy();
    });
  });

  describe('number', () => {
    const spec = { type: 'number' } as any;

    it('should pass for integer', () => {
      expect(validateAttrs(spec, 7)).toBeTruthy();
    });

    it('should pass for floats', () => {
      expect(validateAttrs(spec, 7.3)).toBeTruthy();
    });

    it('should check optional', () => {
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(
        validateAttrs({ ...spec, optional: true }, undefined),
      ).toBeTruthy();
    });

    it('should check minimum', () => {
      expect(validateAttrs({ ...spec, minimum: 10 }, 7)).toBeFalsy();
      expect(validateAttrs({ ...spec, minimum: 7 }, 7)).toBeTruthy();
      expect(validateAttrs({ ...spec, minimum: 5 }, 7)).toBeTruthy();
    });

    it('should check maximum', () => {
      expect(validateAttrs({ ...spec, maximum: 5 }, 7)).toBeFalsy();
      expect(validateAttrs({ ...spec, maximum: 7 }, 7)).toBeTruthy();
      expect(validateAttrs({ ...spec, maximum: 10 }, 7)).toBeTruthy();
    });

    it('should fail for non-number', () => {
      expect(validateAttrs(spec, null)).toBeFalsy();
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(validateAttrs(spec, '7')).toBeFalsy();
      expect(validateAttrs(spec, true)).toBeFalsy();
      expect(validateAttrs(spec, false)).toBeFalsy();
      expect(validateAttrs(spec, [5])).toBeFalsy();
      expect(validateAttrs(spec, () => {})).toBeFalsy();
    });
  });

  describe('integer', () => {
    const spec = { type: 'integer' } as any;

    it('should pass for integer', () => {
      expect(validateAttrs(spec, 7)).toBeTruthy();
    });

    it('should not pass for floats', () => {
      expect(validateAttrs(spec, 7.3)).toBeFalsy();
    });

    it('should check optional', () => {
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(
        validateAttrs({ ...spec, optional: true }, undefined),
      ).toBeTruthy();
    });

    it('should check minimum', () => {
      expect(validateAttrs({ ...spec, minimum: 10 }, 7)).toBeFalsy();
      expect(validateAttrs({ ...spec, minimum: 7 }, 7)).toBeTruthy();
      expect(validateAttrs({ ...spec, minimum: 5 }, 7)).toBeTruthy();
    });

    it('should check maximum', () => {
      expect(validateAttrs({ ...spec, maximum: 5 }, 7)).toBeFalsy();
      expect(validateAttrs({ ...spec, maximum: 7 }, 7)).toBeTruthy();
      expect(validateAttrs({ ...spec, maximum: 10 }, 7)).toBeTruthy();
    });

    it('should fail for non-number', () => {
      expect(validateAttrs(spec, null)).toBeFalsy();
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(validateAttrs(spec, '7')).toBeFalsy();
      expect(validateAttrs(spec, true)).toBeFalsy();
      expect(validateAttrs(spec, false)).toBeFalsy();
      expect(validateAttrs(spec, [5])).toBeFalsy();
      expect(validateAttrs(spec, () => {})).toBeFalsy();
    });
  });

  describe('string', () => {
    const spec = { type: 'string' } as any;

    it('should pass for string', () => {
      expect(validateAttrs(spec, '')).toBeTruthy();
      expect(validateAttrs(spec, 'hello')).toBeTruthy();
    });

    it('should check optional', () => {
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(
        validateAttrs({ ...spec, optional: true }, undefined),
      ).toBeTruthy();
    });

    it('should check minLength', () => {
      expect(validateAttrs({ ...spec, minLength: 0 }, '')).toBeTruthy();
      expect(validateAttrs({ ...spec, minLength: 5 }, 'hello')).toBeTruthy();
      expect(validateAttrs({ ...spec, minLength: 6 }, 'hello')).toBeFalsy();
    });

    it('should check validatorFn', () => {
      expect(
        validateAttrs(
          { ...spec, validatorFn: 'someCustomFunction' },
          'this should pass',
        ),
      ).toBeTruthy();
      expect(
        validateAttrs(
          { ...spec, validatorFn: 'anotherCustomFunction' },
          'this should fail',
        ),
      ).toBeFalsy();
    });

    it('should check pattern', () => {
      expect(
        validateAttrs({ ...spec, pattern: /^[a-z]+$/ }, 'abc'),
      ).toBeTruthy();
      expect(
        validateAttrs({ ...spec, pattern: /^[a-z]+$/ }, 'aBc'),
      ).toBeFalsy();
      expect(
        validateAttrs({ ...spec, pattern: /^[\d]+$/ }, '017'),
      ).toBeTruthy();
      expect(validateAttrs({ ...spec, pattern: /^[\d]+$/ }, '0_0')).toBeFalsy();
    });

    it('should fail for non-string', () => {
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(validateAttrs(spec, null)).toBeFalsy();
      expect(validateAttrs(spec, 7)).toBeFalsy();
      expect(validateAttrs(spec, true)).toBeFalsy();
      expect(validateAttrs(spec, false)).toBeFalsy();
      expect(validateAttrs(spec, [5])).toBeFalsy();
      expect(validateAttrs(spec, () => {})).toBeFalsy();
    });
  });

  describe('array', () => {
    const spec: AttributesSpec = {
      type: 'array',
      items: [{ type: 'number', maximum: 100, minimum: 0 }],
    };
    const tupleSpec: AttributesSpec = {
      type: 'array',
      items: [{ type: 'number', maximum: 100, minimum: 0 }, { type: 'string' }],
      isTupleLike: true,
    };
    const nonTupleSpec: AttributesSpec = {
      type: 'array',
      items: [{ type: 'number', maximum: 100, minimum: 0 }, { type: 'string' }],
    };
    const nestedSpec: AttributesSpec = {
      type: 'array',
      items: [
        {
          type: 'array',
          items: [{ type: 'number', maximum: 100, minimum: 0 }],
        },
      ],
    };
    const complexSpec: AttributesSpec = {
      type: 'array',
      items: [
        { type: 'string' },
        {
          props: {
            valueA: { type: 'string' },
            valueB: { type: 'number', maximum: 100, minimum: 0 },
          },
        },
        { type: 'number', maximum: 100, minimum: 0 },
        {
          props: {
            valueC: { type: 'string' },
          },
          optional: true,
        },
        {
          type: 'array',
          items: [{ type: 'string' }],
          optional: true,
        },
      ],
    };
    const minMaxSpec: AttributesSpec = {
      type: 'array',
      items: [{ type: 'number', minimum: 0, maximum: 10 }],
      minItems: 1,
      maxItems: 2,
    };

    it('should pass for simple array', () => {
      expect(validateAttrs(spec, [])).toBeTruthy();
      expect(validateAttrs(spec, [1, 2, 3])).toBeTruthy();
    });

    it('should pass for tuple', () => {
      expect(validateAttrs(tupleSpec, [1, '2'])).toBeTruthy();
      expect(validateAttrs(tupleSpec, [1])).toBeTruthy();
      expect(validateAttrs(tupleSpec, [1, '2', 3])).toBeTruthy();
    });

    it('should pass for non tuple', () => {
      expect(validateAttrs(nonTupleSpec, [1, '2'])).toBeTruthy();
      expect(validateAttrs(nonTupleSpec, ['2', 1])).toBeTruthy();
      expect(validateAttrs(nonTupleSpec, [1])).toBeTruthy();
      expect(validateAttrs(nonTupleSpec, [1, '2', '2', 3])).toBeTruthy();
    });

    it('should pass for nested array', () => {
      expect(validateAttrs(nestedSpec, [[1, 2, 3]])).toBeTruthy();
    });

    it('should pass for minMax array', () => {
      expect(validateAttrs(minMaxSpec, [1, 2])).toBeTruthy();
      expect(validateAttrs(minMaxSpec, [1])).toBeTruthy();
    });

    it('should pass for valid complex spec', () => {
      expect(
        validateAttrs(complexSpec, [
          'some-string',
          {
            valueA: 'some-string',
            valueB: 15,
          },
          25,
        ]),
      ).toBeTruthy();
      expect(
        validateAttrs(complexSpec, [
          'some-string',
          {
            valueA: 'some-string',
            valueB: 15,
          },
          25,
          {
            valueC: 'some-string',
          },
          ['a', 'b'],
        ]),
      ).toBeTruthy();
    });

    it('should fail for invalid array', () => {
      expect(validateAttrs(spec, ['1'])).toBeFalsy();
      expect(validateAttrs(spec, [1, '2'])).toBeFalsy();
    });

    it('should fail for invalid tuple', () => {
      expect(validateAttrs(tupleSpec, ['1'])).toBeFalsy();
      expect(validateAttrs(tupleSpec, [1, 2])).toBeFalsy();
      expect(validateAttrs(tupleSpec, ['1', 2])).toBeFalsy();
    });

    it('should fail for invalid non-tuple', () => {
      expect(validateAttrs(nonTupleSpec, [true])).toBeFalsy();
      expect(validateAttrs(nonTupleSpec, [1, true])).toBeFalsy();
      expect(validateAttrs(nonTupleSpec, ['1', 2, true])).toBeFalsy();
    });

    it('should fail for minMax array', () => {
      expect(validateAttrs(minMaxSpec, [])).toBeFalsy();
      expect(validateAttrs(minMaxSpec, [1, 2, 3])).toBeFalsy();
    });

    it('should fail for invalid nested array', () => {
      expect(validateAttrs(nestedSpec, [['1', 2, 3]])).toBeFalsy();
    });

    it('should fail for non-array', () => {
      expect(validateAttrs(spec, undefined)).toBeFalsy();
      expect(validateAttrs(spec, null)).toBeFalsy();
      expect(validateAttrs(spec, 7)).toBeFalsy();
      expect(validateAttrs(spec, '7')).toBeFalsy();
      expect(validateAttrs(spec, true)).toBeFalsy();
      expect(validateAttrs(spec, false)).toBeFalsy();
      expect(validateAttrs(spec, () => {})).toBeFalsy();
    });

    it('should fail for complex spec', () => {
      expect(
        validateAttrs(complexSpec, [
          'some-string',
          {
            valueA: 'some-string',
            valueB: 'some-string',
          },
          25,
        ]),
      ).toBeFalsy();
      expect(
        validateAttrs(complexSpec, [
          'some-string',
          {
            valueA: 'some-string',
            valueB: 'some-string',
          },
        ]),
      ).toBeFalsy();
      expect(
        validateAttrs(complexSpec, [
          'some-string',
          {
            valueA: 'some-string',
            valueB: 15,
          },
          25,
          {
            valueC: 'some-string',
          },
          ['a', 1],
        ]),
      ).toBeFalsy();
    });
  });

  describe('object', () => {
    let complexObjectSpec: AttributesSpec;
    beforeEach(() => {
      complexObjectSpec = {
        props: {
          optionalProp: {
            props: {
              someString: { type: 'string' },
            },
            optional: true,
          },
          datasource: {
            props: {
              id: { type: 'string' },
              views: {
                type: 'array',
                items: [
                  {
                    props: {
                      name: { type: 'string' },
                    },
                  },
                ],
              },
            },
          },
        },
      };
    });

    it('should pass for valid complex spec', () => {
      expect(
        validateAttrs(complexObjectSpec, {
          datasource: {
            id: 'some-string',
            views: [{ name: 'some-string' }, { name: 'some-other-string' }],
          },
        }),
      ).toBeTruthy();

      expect(
        validateAttrs(complexObjectSpec, {
          optionalProp: {
            someString: 'some-string',
          },
          datasource: {
            id: 'some-string',
            views: [],
          },
        }),
      ).toBeTruthy();
    });

    it('should fail for invalid complex spec', () => {
      expect(
        validateAttrs(complexObjectSpec, {
          optionalProp: {
            someString: 'some-string',
          },
        }),
      ).toBeFalsy();

      expect(
        validateAttrs(complexObjectSpec, {
          datasource: {
            id: 10,
            views: [],
          },
        }),
      ).toBeFalsy();

      expect(
        validateAttrs(complexObjectSpec, {
          datasource: {
            id: 'some-string',
            views: ['blah'],
          },
        }),
      ).toBeFalsy();
    });
  });
});
