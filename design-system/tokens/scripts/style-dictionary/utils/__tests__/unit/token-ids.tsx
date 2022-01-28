import { CSS_PREFIX } from '../../../constants';
import {
  getCSSCustomPropertyId,
  getFullyQualifiedTokenId,
  getTokenId,
} from '../../token-ids';

describe('getCSSCustomPropertyId', () => {
  it('should parse to a shortened value with camel case parts', () => {
    const actual = getCSSCustomPropertyId([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual(
      `${CSS_PREFIX}-backgroundSubtleBorderedNeutral-resting`,
    );
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = getCSSCustomPropertyId(['color', 'border', 'focus']);

    expect(actual).toEqual(`${CSS_PREFIX}-border-focus`);
  });

  it('should omit the [default] keyword', () => {
    const actual = getCSSCustomPropertyId([
      'color',
      '[default]',
      'border',
      'focus',
    ]);

    expect(actual).toEqual(`${CSS_PREFIX}-border-focus`);
  });
});

describe('getTokenId', () => {
  it('should parse to a shortened value with camel case parts', () => {
    const actual = getTokenId([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual(`color.backgroundSubtleBorderedNeutral.resting`);
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = getTokenId(['color', 'border', 'focus']);

    expect(actual).toEqual(`color.border.focus`);
  });

  it('should omit the [default] keyword', () => {
    const actual = getTokenId(['color', '[default]', 'border', 'focus']);

    expect(actual).toEqual(`color.border.focus`);
  });
});

describe('getFullyQualifiedTokenId', () => {
  it('should parse to a shortened value with camel case parts', () => {
    const actual = getFullyQualifiedTokenId([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual(`color.backgroundSubtleBorderedNeutral.resting`);
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = getFullyQualifiedTokenId(['color', 'border', 'focus']);

    expect(actual).toEqual(`color.border.focus`);
  });

  it('should not omit the [default] keyword', () => {
    const actual = getFullyQualifiedTokenId([
      'color',
      '[default]',
      'border',
      'focus',
    ]);

    expect(actual).toEqual(`color.[default].border.focus`);
  });
});
