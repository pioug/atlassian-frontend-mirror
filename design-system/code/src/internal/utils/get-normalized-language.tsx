import memoizeOne from 'memoize-one';

import { fg } from '@atlaskit/platform-feature-flags';

import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_ABAP_FIX } from '../../constants';
import { type LanguageAlias, type SupportedLanguages } from '../types';

export const normalizeLanguage = memoizeOne((language?: SupportedLanguages): string => {
	if (!language) {
		return '';
	}

	const supportLanguagesList = fg('platform_dst_code_abap_syntax')
		? SUPPORTED_LANGUAGES_ABAP_FIX
		: SUPPORTED_LANGUAGES;

	const match = supportLanguagesList.find((val) => {
		return (
			val.name === language ||
			(val.alias as readonly LanguageAlias[]).includes(language as LanguageAlias)
		);
	});
	// Fallback to plain monospaced text if language passed but not supported
	return match ? match.value : 'text';
});
