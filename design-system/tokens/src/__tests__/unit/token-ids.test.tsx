import { CSS_PREFIX } from '../../constants';
import {
  getCSSCustomProperty,
  getFullyQualifiedTokenId,
  getTokenId,
} from '../../utils/token-ids';

describe('getCSSCustomProperty', () => {
  it('should parse path as a string', () => {
    const actual = getCSSCustomProperty('color.background.bold.[default]');

    expect(actual).toEqual(`--${CSS_PREFIX}-background-bold`);
  });

  it('should parse path as an array', () => {
    const actual = getCSSCustomProperty([
      'color',
      'background',
      'bold',
      '[default]',
    ]);

    expect(actual).toEqual(`--${CSS_PREFIX}-background-bold`);
  });

  it('should parse to a shortened value with camel case parts', () => {
    const actual = getCSSCustomProperty([
      'color',
      'backgroundSubtleBorderedNeutral',
      'resting',
    ]);

    expect(actual).toEqual(
      `--${CSS_PREFIX}-backgroundSubtleBorderedNeutral-resting`,
    );
  });

  it('should parse to a shortened value without camel case parts', () => {
    const actual = getCSSCustomProperty(['color', 'border', 'focus']);

    expect(actual).toEqual(`--${CSS_PREFIX}-border-focus`);
  });

  it('should omit the [default] keyword', () => {
    const actual = getCSSCustomProperty([
      'color',
      '[default]',
      'border',
      'focus',
    ]);

    expect(actual).toEqual(`--${CSS_PREFIX}-border-focus`);
  });
});

describe('getTokenId', () => {
  it('should parse path as a string', () => {
    const actual = getTokenId('color.background.bold.[default]');

    expect(actual).toEqual('color.background.bold');
  });

  it('should parse path as an array', () => {
    const actual = getTokenId(['color', 'background', 'bold', '[default]']);

    expect(actual).toEqual('color.background.bold');
  });

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
