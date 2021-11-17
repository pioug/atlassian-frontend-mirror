import type { AttributeSchema, ValueSchema } from '../../types';

describe('schema types', () => {
  it('should error when using the removed attributes property', () => {
    const obj: ValueSchema<{ value: true; attributes: true }> = {
      // @ts-expect-error
      attributes: true,
      value: true,
    };

    expect(obj).toBeDefined();
  });

  it('should error when using the removed value property', () => {
    const obj: AttributeSchema<{ foo: true; attributes: true }> = {
      attributes: true,
      // @ts-expect-error
      value: true,
    };

    expect(obj).toBeDefined();
  });
});
