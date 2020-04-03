import { validateAttrs } from '../../../validator';

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
    const spec = { type: 'array', items: [{ type: 'number' }] } as any;
    const tupleSpec = {
      ...spec,
      items: [{ type: 'number' }, { type: 'string' }],
    };
    const nestedSpec = {
      type: 'array',
      items: [{ type: 'array', items: [{ type: 'number' }] }],
    } as any;

    it('should pass for simple array', () => {
      expect(validateAttrs(spec, [])).toBeTruthy();
      expect(validateAttrs(spec, [1, 2, 3])).toBeTruthy();
    });

    it('should pass for tuple', () => {
      expect(validateAttrs(tupleSpec, [1, '2'])).toBeTruthy();
      expect(validateAttrs(tupleSpec, [1])).toBeTruthy();
    });

    it('should pass for nested array', () => {
      expect(validateAttrs(nestedSpec, [[1, 2, 3]])).toBeTruthy();
    });

    it('should fail for invalid array', () => {
      expect(validateAttrs(spec, ['1'])).toBeFalsy();
      expect(validateAttrs(spec, [1, '2'])).toBeFalsy();
    });

    it('should fail for invalid tuple', () => {
      expect(validateAttrs(tupleSpec, ['1'])).toBeFalsy();
      expect(validateAttrs(tupleSpec, ['1', '2'])).toBeFalsy();
      expect(validateAttrs(tupleSpec, ['1', 2])).toBeFalsy();
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
  });
});
