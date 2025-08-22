import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';

export interface CodeBlockPluginOptions extends LongPressSelectionPluginOptions {
	allowCompositionInputOverride?: boolean;
	allowCopyToClipboard?: boolean;
	overrideLanguageName?: (name: string) => string;
}

/**
 * @private
 * @deprecated Use {@link CodeBlockPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type CodeBlockOptions = CodeBlockPluginOptions;

export type CodeBlockLineAttributes = { lineNumber: number; lineStart: number; };
