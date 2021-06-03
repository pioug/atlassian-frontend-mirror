import memoizeOne from 'memoize-one';

import { SUPPORTED_LANGUAGES } from '../../constants';
import { LanguageAlias, SupportedLanguages } from '../types';

export const normalizeLanguage = memoizeOne(
  (language?: SupportedLanguages): string => {
    if (!language) {
      return '';
    }
    const match = SUPPORTED_LANGUAGES.find((val) => {
      return (
        val.name === language ||
        (val.alias as readonly LanguageAlias[]).includes(
          language as LanguageAlias,
        )
      );
    });
    // Fallback to plain monospaced text if language passed but not supported
    return match ? match.value : 'text';
  },
);
