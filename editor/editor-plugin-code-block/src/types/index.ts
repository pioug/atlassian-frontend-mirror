import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';

export interface CodeBlockPluginOptions extends LongPressSelectionPluginOptions {
	allowCopyToClipboard?: boolean;
	allowCompositionInputOverride?: boolean;
}

/**
 * @private
 * @deprecated Use {@link CodeBlockPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type CodeBlockOptions = CodeBlockPluginOptions;

export type CodeBlockLineAttributes = { lineStart: number; lineNumber: number };
