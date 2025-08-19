import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { styleTags, tags } from '@lezer/highlight';

import { parser } from './parser';

/**
 * Returns a LanguageSupport instance for ActionScript.
 *
 * @returns {LanguageSupport} The language support for ActionScript.
 * @example
 * import { actionscriptLanguageSupport } from './languageSupport';
 * const support = actionscriptLanguageSupport();
 */
export function actionscriptLanguageSupport() {
	// --- Syntax highlighting rules for ActionScript ---
	const actionScriptHighlight = styleTags({
		'var function': tags.controlKeyword,
		Comment: tags.comment,
		Number: tags.number,
		Identifier: tags.variableName,
		String: tags.string
	});
	const actionscriptLanguage = LRLanguage.define({
		parser: parser.configure({ props: [actionScriptHighlight] }),
	});
	return new LanguageSupport(actionscriptLanguage);
}
