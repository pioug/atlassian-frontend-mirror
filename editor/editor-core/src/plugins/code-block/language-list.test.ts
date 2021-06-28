import {
  DEFAULT_LANGUAGES,
  Language,
  findMatchedLanguage,
  filterSupportedLanguages,
  getLanguageIdentifier,
  createLanguageList,
} from './language-list';

const mockSupportedLanguages: Language[] = [
  { name: 'JSON', alias: ['json'], value: 'json' },
  { name: 'JavaScript', alias: ['javascript', 'js'], value: 'javascript' },
  { name: 'Python', alias: ['python', 'py'], value: 'python' },
];

describe('languageList utils', () => {
  it('should find matched language', () => {
    expect(findMatchedLanguage(mockSupportedLanguages, 'JavaScript')).toEqual({
      name: 'JavaScript',
      alias: ['javascript', 'js'],
      value: 'javascript',
    });
    expect(findMatchedLanguage(mockSupportedLanguages, 'Python')).toEqual({
      name: 'Python',
      alias: ['python', 'py'],
      value: 'python',
    });
    expect(
      findMatchedLanguage(mockSupportedLanguages, 'GiBBeRish'),
    ).toBeUndefined();
  });

  it('should filter supported languages', () => {
    const mockSupportedLanguageStrings = mockSupportedLanguages.map(
      (language) => language.name.toLowerCase(),
    );
    expect(filterSupportedLanguages([])).toEqual(DEFAULT_LANGUAGES);
    expect(filterSupportedLanguages(mockSupportedLanguageStrings)).toEqual([
      { name: 'Python', alias: ['python', 'py'], value: 'python' },
      { name: 'JavaScript', alias: ['javascript', 'js'], value: 'javascript' },
      { name: 'JSON', alias: ['json'], value: 'json' },
      // '(None)' is not an actual language and should not be 'supported'
    ]);
  });

  it('should get language identifier', () => {
    expect(
      getLanguageIdentifier({
        name: 'MyLanguage',
        alias: ['myalias'],
        value: 'myalias',
      }),
    ).toEqual('myalias');
  });

  it('should create language list sorted as case insensitive', () => {
    expect(createLanguageList(mockSupportedLanguages)).toEqual([
      { name: 'JavaScript', alias: ['javascript', 'js'], value: 'javascript' },
      { name: 'JSON', alias: ['json'], value: 'json' },
      { name: 'Python', alias: ['python', 'py'], value: 'python' },
    ]);
  });
});
