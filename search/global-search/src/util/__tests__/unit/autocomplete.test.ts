import { getAutocompleteText } from '../../autocomplete';

describe('Autocomplete-util', () => {
  it('should not provide autocomplete if not typed anything', () => {
    expect(getAutocompleteText('', ['auto', 'car'])).toBeUndefined();
  });

  const testData: [string[] | undefined, string | string[] | undefined][] = [
    // autocomplete array, expected autocomplete text
    [undefined, undefined],
    [[], 'au'],
    [['auto', 'automatic'], 'auto'],
    [['AuTo', 'automatic'], 'auTo'],
  ];

  test.each(testData)(
    'should autocomplete "au" based on %j to %s',
    (autocompleteArray, expected) => {
      expect(getAutocompleteText('au', autocompleteArray)).toBe(expected);
    },
  );
});
