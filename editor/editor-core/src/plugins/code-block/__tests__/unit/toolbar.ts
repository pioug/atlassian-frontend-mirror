import { languageListFilter } from './../../toolbar';

describe('toolbar', () => {
  describe('language list filter', () => {
    const option = {
      data: {
        alias: ['typescript', 'ts'],
        label: 'TypeScript',
        value: 'typescript',
      },
      label: 'TypeScript',
      value: 'typescript',
    };

    it('should filter when searching by language name', () => {
      expect(languageListFilter(option, 'type')).toBeTruthy();
      expect(languageListFilter(option, 'script')).toBeTruthy();
      expect(languageListFilter(option, 'typescript')).toBeTruthy();
      expect(languageListFilter(option, 'xyz')).toBeFalsy();
    });

    it('should filter when searching by language alias', () => {
      expect(languageListFilter(option, 'ts')).toBeTruthy();
      expect(languageListFilter(option, 'xyz')).toBeFalsy();
    });
  });
});
