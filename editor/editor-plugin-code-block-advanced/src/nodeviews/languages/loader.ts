/**
 * Commented out for hot-114295
 */
export const noop = () => {};
// import { LanguageSupport } from '@codemirror/language';

// import { mapLanguageToCodeMirror } from './languageMap';

// /**
//  * Manages loading the languages (for syntax highlighting, etc.)
//  * from CodeMirror and updating the language in the CodeMirror view
//  */
// export class LanguageLoader {
// 	private languageName: string = '';

// 	constructor(private updateLanguageCompartment: (value: LanguageSupport | []) => void) {}

// 	updateLanguage(languageName: string) {
// 		if (languageName === this.languageName) {
// 			return;
// 		}
// 		const language = mapLanguageToCodeMirror(languageName);

// 		const configureEmpty = () => {
// 			this.updateLanguageCompartment([]);
// 			this.languageName = '';
// 		};

// 		if (!language) {
// 			configureEmpty();
// 			return;
// 		}

// 		language
// 			.load()
// 			.then((lang) => {
// 				if (lang) {
// 					this.updateLanguageCompartment(lang);
// 					this.languageName = languageName;
// 				} else {
// 					configureEmpty();
// 				}
// 			})
// 			.catch(() => {
// 				configureEmpty();
// 			});
// 	}
// }
