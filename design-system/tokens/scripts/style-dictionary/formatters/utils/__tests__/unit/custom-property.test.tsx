import { customPropertyValue } from '../../custom-property';

describe('custom property', () => {
  it('should parse to a shortened value with camel case parts', () => {
    const actual = customPropertyValue([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual('backgroundSubtleBorderedNeutral-resting');
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = customPropertyValue(['color', 'border', 'focus']);

    expect(actual).toEqual('border-focus');
  });
});
