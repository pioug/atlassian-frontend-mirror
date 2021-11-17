import { CSS_PREFIX } from '../../../../constants';
import { customPropertyKey, customPropertyValue } from '../../custom-property';

describe('custom property value', () => {
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

  it('should omit the [default] keyword', () => {
    const actual = customPropertyValue([
      'color',
      '[default]',
      'border',
      'focus',
    ]);

    expect(actual).toEqual(`${CSS_PREFIX}-border-focus`);
  });
});

describe('custom property key', () => {
  it('should parse to a shortened value with camel case parts', () => {
    const actual = customPropertyKey([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual(`color.backgroundSubtleBorderedNeutral.resting`);
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = customPropertyKey(['color', 'border', 'focus']);

    expect(actual).toEqual(`color.border.focus`);
  });

  it('should omit the [default] keyword', () => {
    const actual = customPropertyKey(['color', '[default]', 'border', 'focus']);

    expect(actual).toEqual(`color.border.focus`);
  });
});
