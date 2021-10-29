import { CSS_PREFIX } from '../../../../constants';
import { customPropertyValue } from '../../custom-property';

describe('custom property', () => {
  it('should parse to a shortened value with camel case parts', () => {
    const actual = customPropertyValue([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual(
      `${CSS_PREFIX}-backgroundSubtleBorderedNeutral-resting`,
    );
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = customPropertyValue(['color', 'border', 'focus']);

    expect(actual).toEqual(`${CSS_PREFIX}-border-focus`);
  });
});
