import { createCollector } from '../../create-collector';

const identity = (x: any) => x;

describe('utils/create-collector', () => {
  it('should return all values', () => {
    const collect = createCollector();

    expect(collect(identity(1), 0)).toBe(1);
    expect(collect(identity(2), 0)).toBe(2);
  });

  it('should fall back to defaults', () => {
    const collect = createCollector();

    expect(collect(identity(1), 0)).toBe(1);
    expect(collect(identity(2), 0)).toBe(2);

    // for `undefined` and subsequent values fall back to default value
    expect(collect(identity(undefined), -3)).toBe(-3);
    expect(collect(identity(4), -4)).toBe(-4);
    expect(collect(identity(5), -5)).toBe(-5);
  });
});
