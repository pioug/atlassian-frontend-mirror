import memoizeOne, { type MemoizedFn } from 'memoize-one';

import { SUPPORTED_LANGUAGES } from '../../constants';
import { type LanguageAlias, type SupportedLanguages } from '../types';

export const normalizeLanguage: MemoizedFn<(language?: SupportedLanguages) => string> = memoizeOne((language?: SupportedLanguages): string => {
	if (!language) {
		return '';
	}

	const match = SUPPORTED_LANGUAGES.find((val) => {
		return (
			val.name === language ||
			(val.alias as readonly LanguageAlias[]).includes(language as LanguageAlias)
		);
	});
	// Fallback to plain monospaced text if language passed but not supported
	return match ? match.value : 'text';
});
