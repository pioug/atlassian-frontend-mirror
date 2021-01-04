import {
  DEFAULT_LANGUAGES,
  Language,
  findMatchedLanguage,
  filterSupportedLanguages,
  getLanguageIdentifier,
  createLanguageList,
} from '../../../utils/languageList';

const mockSupportedLanguages: Language[] = [
  { name: 'JSON', alias: ['json'] },
  { name: 'JavaScript', alias: ['javascript', 'js'] },
  { name: 'Python', alias: ['python', 'py'] },
];

describe('languageList utils', () => {
  it('should find matched language', () => {
    expect(findMatchedLanguage(mockSupportedLanguages, 'JavaScript')).toEqual({
      name: 'JavaScript',
      alias: ['javascript', 'js'],
    });
    expect(findMatchedLanguage(mockSupportedLanguages, 'Python')).toEqual({
      name: 'Python',
      alias: ['python', 'py'],
    });
    expect(
      findMatchedLanguage(mockSupportedLanguages, 'GiBBeRish'),
    ).toBeUndefined();
  });

  it('should filter supported languages', () => {
    const mockSupportedLanguageStrings = mockSupportedLanguages.map(language =>
      language.name.toLowerCase(),
    );
    expect(filterSupportedLanguages([])).toEqual(DEFAULT_LANGUAGES);
    expect(filterSupportedLanguages(mockSupportedLanguageStrings)).toEqual([
      { name: 'JavaScript', alias: ['javascript', 'js'] },
      { name: 'JSON', alias: ['json'] },
      { name: 'Python', alias: ['python', 'py'] },
      // '(None)' is not an actual language and should not be 'supported'
    ]);
  });

  it('should get language identifier', () => {
    expect(
      getLanguageIdentifier({ name: 'MyLanguage', alias: ['myalias'] }),
    ).toEqual('myalias');
  });

  it('should create language list sorted as case insensitive', () => {
    expect(createLanguageList(mockSupportedLanguages)).toEqual([
      { name: 'JavaScript', alias: ['javascript', 'js'] },
      { name: 'JSON', alias: ['json'] },
      { name: 'Python', alias: ['python', 'py'] },
    ]);
  });
});
