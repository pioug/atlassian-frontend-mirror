/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapLocaleToPrsLocale } from './index';

describe('getFormattedLocaleFromDimensions', () => {
  it.each`
    locale
    ${'en-US'}
    ${'en-GB'}
    ${'pt-BR'}
    ${'zn-CN'}
    ${'zn-TW'}
  `(
    'should return locale with country code where applicable: $locale',
    ({ locale }: any) => {
      expect(mapLocaleToPrsLocale(locale)).toBe(locale);
    },
  );

  it.each`
    input      | expected
    ${'en-UK'} | ${'en-GB'}
    ${'en_UK'} | ${'en-GB'}
    ${'en'}    | ${'en-US'}
  `(
    'should map inconsistent codes: $input -> $expected',
    ({ input, expected }: any) => {
      expect(mapLocaleToPrsLocale(input)).toBe(expected);
    },
  );

  it.each`
    input      | expected
    ${'nb_NO'} | ${'nb'}
    ${'fi_FI'} | ${'fi'}
    ${'fr-FR'} | ${'fr'}
  `(
    'should remove the country code where not explicitly listed: $input -> $expected',
    ({ input, expected }: any) => {
      expect(mapLocaleToPrsLocale(input)).toBe(expected);
    },
  );
});
