import type { Command } from '@atlaskit/editor-common/types';

const supportedFormatLanguages = [
	'json',
	'javascript',
	'jsx',
	'typescript',
	'tsx',
	'sql',
] as const;

type FormatCodeLanguage = (typeof supportedFormatLanguages)[number];

export type FormatCodeResult =
	| {
			content: string;
			language: FormatCodeLanguage;
			status: 'formatted' | 'unchanged';
	  }
	| {
			errorType: 'formatter-execution-failed' | 'formatter-load-failed';
			language: FormatCodeLanguage;
			status: 'failed';
	  };

export type LanguageSource = 'auto-detected' | 'selected';

type FormatCode = (args: { content: string; language: FormatCodeLanguage }) => Promise<FormatCodeResult>;

type FormatterModule = {
	formatCode: FormatCode;
};

export const isSupportedFormatLanguage = (
	language: string | null | undefined,
): language is FormatCodeLanguage =>
	supportedFormatLanguages.includes(language as FormatCodeLanguage);

let formatterModulePromise: Promise<FormatterModule> | undefined;

export const preloadFormatterModule = (): Promise<FormatterModule> => {
	if (!formatterModulePromise) {
		formatterModulePromise = import(
			/* webpackChunkName: "@atlaskit-internal_editor-plugin-code-block-formatter" */ './formatter-impl'
		).catch((error) => {
			formatterModulePromise = undefined;
			throw error;
		});
	}

	return formatterModulePromise;
};

export const preloadFormatterOnIntent = (): Command => (_state, dispatch) => {
	if (!dispatch) {
		// Hover/focus handlers are command-shaped; keep dry-runs side-effect free.
		return false;
	}

	void preloadFormatterModule();
	return false;
};

export const formatCode: FormatCode = async ({
	content,
	language,
}) => {
	let formatterModule: FormatterModule;

	try {
		formatterModule = await preloadFormatterModule();
	} catch {
		return {
			errorType: 'formatter-load-failed',
			language,
			status: 'failed',
		};
	}

	try {
		return await formatterModule.formatCode({
			content,
			language,
		});
	} catch {
		return {
			errorType: 'formatter-execution-failed',
			language,
			status: 'failed',
		};
	}
};
