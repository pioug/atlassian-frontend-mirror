import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';

export type FormatResult =
	| {
			content: string;
			language: string;
			status: 'formatted' | 'unchanged';
	  }
	| {
			errorType: 'formatter-execution-failed' | 'formatter-load-failed';
			language: string;
			status: 'failed';
	  };

export type CodeBlockFormatProvider = {
	formatCode: (args: { content: string; language: string }) => Promise<FormatResult>;
	isSupportedLanguage: (language: string | null | undefined) => boolean;
	preload?: (language: string) => Promise<void>;
};

export interface CodeBlockPluginOptions extends LongPressSelectionPluginOptions {
	allowCompositionInputOverride?: boolean;
	allowCopyToClipboard?: boolean;
	formatCodeProvider?: CodeBlockFormatProvider;
	overrideLanguageName?: (name: string) => string;
}

/**
 * @private
 * @deprecated Use {@link CodeBlockPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type CodeBlockOptions = CodeBlockPluginOptions;

export type CodeBlockLineAttributes = { lineNumber: number; lineStart: number };
