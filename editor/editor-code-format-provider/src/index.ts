import type {
	CodeBlockFormatProvider,
	FormatResult,
} from '@atlaskit/editor-plugin-code-block/types';

import { isSupportedLanguage, loadFormatter } from './formatters';

const preload = async (language: string): Promise<void> => {
	if (!isSupportedLanguage(language)) {
		return;
	}

	await loadFormatter(language).catch(() => undefined);
};

const formatCode = async ({
	content,
	language,
}: {
	content: string;
	language: string;
}): Promise<FormatResult> => {
	if (!isSupportedLanguage(language)) {
		return {
			errorType: 'formatter-execution-failed',
			language,
			status: 'failed',
		};
	}

	const format = await loadFormatter(language).catch(() => undefined);

	if (!format) {
		return {
			errorType: 'formatter-load-failed',
			language,
			status: 'failed',
		};
	}

	let formattedContent: string;

	try {
		formattedContent = await format(content);
	} catch {
		return {
			errorType: 'formatter-execution-failed',
			language,
			status: 'failed',
		};
	}

	return {
		content: formattedContent,
		language,
		status: formattedContent === content ? 'unchanged' : 'formatted',
	};
};

export const createCodeBlockFormatProvider = (): CodeBlockFormatProvider => ({
	formatCode,
	isSupportedLanguage,
	preload,
});
