import { LanguageDescription, LanguageSupport } from '@codemirror/language';
import { languages } from '@codemirror/language-data';

import type { LanguageAlias } from '@atlaskit/code';
import { fg } from '@atlaskit/platform-feature-flags';

type LanguageAliasValue = LanguageAlias[0];

// getLanguageIdentifier defines `language.alias[0]`
export const mapLanguageToCodeMirror = (language: LanguageAliasValue) => {
	if (!language || language === 'none') {
		return undefined;
	}
	switch (language) {
		case 'coldfusion':
			return languages.find((l) => {
				return l.name.toLowerCase() === 'xml';
			});
		case 'matlab':
			return languages.find((l) => {
				return l.name.toLowerCase() === 'octave';
			});
		case 'javafx':
			return languages.find((l) => {
				return l.name.toLowerCase() === 'java';
			});
		case 'vbnet':
			return languages.find((l) => {
				return l.name === 'VB.NET';
			});
		case 'pas':
			return languages.find((l) => {
				return l.name.toLowerCase() === 'pascal';
			});
		case 'cuda':
			return languages.find((l) => {
				return l.name.toLowerCase() === 'c++';
			});
		case 'racket':
			return languages.find((l) => {
				return l.name === 'Common Lisp';
			});
		case 'abap':
			return languages.find((l) => {
				return l.name === 'SQL';
			});
		case 'standardmL':
			return languages.find((l) => {
				return l.name === 'SML';
			});
		case 'objective-j':
			return languages.find((l) => {
				return l.name === 'Objective-C';
			});
		case 'docker':
			return languages.find((l) => {
				return l.name === 'Dockerfile';
			});
		case 'arduino':
			return languages.find((l) => {
				return l.name === 'C++';
			});
		case 'visualbasic':
			return languages.find((l) => {
				return l.name === 'VB.NET';
			});
		case 'gherkin':
			return languages.find((l) => {
				return l.name === 'Gherkin';
			});
		case 'toml':
			return languages.find((l) => {
				return l.name === 'TOML';
			});
		case 'handlebars':
			return LanguageDescription.of({
				name: 'Handlebars',
				load() {
					return import(
						/* webpackChunkName: "@atlaskit-internal_@atlaskit/editor-plugin-code-block-advanced-lang-handlebars" */
						'@xiechao/codemirror-lang-handlebars'
					).then((m) => new LanguageSupport(m.handlebarsLanguage));
				},
			});
		case 'elixir':
			return LanguageDescription.of({
				name: 'Elixir',
				load() {
					return import(
						/* webpackChunkName: "@atlaskit-internal_@atlaskit/editor-plugin-code-block-advanced-lang-elixir" */
						'codemirror-lang-elixir'
					).then((m) => m.elixir());
				},
			});
		case 'graphql':
			return LanguageDescription.of({
				name: 'GraphQL',
				load() {
					return import(
						/* webpackChunkName: "@atlaskit-internal_@atlaskit/editor-plugin-code-block-advanced-lang-graphql" */
						'cm6-graphql'
					).then((m) => m.graphqlLanguageSupport());
				},
			});
		case 'actionscript':
			if (fg('platform_editor_code_syntax_highlight_actionscript')) {
				return LanguageDescription.of({
					name: 'ActionScript',
					load() {
						return import(
							/* webpackChunkName: "@atlaskit-internal_@atlaskit/editor-plugin-code-block-advanced-lang-actionscript" */
							'./actionscript/languageSupport'
						).then((m) => {
							return m.actionscriptLanguageSupport();
						});
					},
				});
			} else {
				return undefined;
			}
		default:
			return languages.find((l) => {
				return l.alias.includes(language) || l.name.toLowerCase() === language?.toLowerCase();
			});
	}
};
