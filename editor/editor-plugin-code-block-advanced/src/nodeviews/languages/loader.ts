import { LanguageSupport, syntaxHighlighting } from '@codemirror/language';
import type { Extension } from '@codemirror/state';

import { languageStyling } from '../../ui/syntaxHighlightingTheme';

import { mapLanguageToCodeMirror } from './languageMap';

/**
 * Manages loading the languages (for syntax highlighting, etc.)
 * from CodeMirror and updating the language in the CodeMirror view
 */
export class LanguageLoader {
	private languageName: string = '';

	constructor(
		private updateLanguageCompartment: (
			value: LanguageSupport | [LanguageSupport, Extension] | [],
		) => void,
	) {}

	updateLanguage(languageName: string) {
		if (languageName === this.languageName) {
			return;
		}
		const language = mapLanguageToCodeMirror(languageName);

		const configureEmpty = () => {
			this.updateLanguageCompartment([]);
			this.languageName = '';
		};

		if (!language) {
			configureEmpty();
			return;
		}

		language
			.load()
			.then((lang) => {
				if (lang) {
					const styling = languageStyling(lang.language);
					if (styling) {
						this.updateLanguageCompartment([lang, syntaxHighlighting(styling)]);
					} else {
						this.updateLanguageCompartment(lang);
					}
					this.languageName = languageName;
				} else {
					configureEmpty();
				}
			})
			.catch(() => {
				configureEmpty();
			});
	}
}
