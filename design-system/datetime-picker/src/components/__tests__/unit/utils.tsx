import { convertTokens } from '../../../components/utils';

const validFormats = [
  ['h:mm a', "h':'mm' 'a"],
  ['h:mm A', "h':'mm' 'a"],
  ['DD/MM/YYYY', "dd'/'LL'/'yyyy"],
  ['HH:mm', "HH':'mm"],
  ['MMMM YYYY', "LLLL' 'yyyy"],
  ['MMMMYYYY', 'LLLLyyyy'],
];

const validFormatsWithEscapes = [
  ["h:mm a 'PST'", "h':'mm' 'a' PST'"],
  ["do 'de' MMMM YYYY", "io' de 'LLLL' 'yyyy"],
  ["h'o''clock'", "h'o''clock'"],
  ["''''", "''''"], // This would render as just "''" once executed
];

describe('convertTokens', () => {
  it('should parse an empty string', () => {
    expect(convertTokens('')).toBe('');
  });

  test.each(validFormats)(
    'should separate tokens in valid formats',
    (input, expected) => {
      expect(convertTokens(input)).toBe(expected);
    },
  );

  test.each(validFormatsWithEscapes)(
    'should allow escaped strings in a format',
    (input, expected) => {
      expect(convertTokens(input)).toBe(expected);
    },
  );
});
