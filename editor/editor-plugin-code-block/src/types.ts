import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';

export interface CodeBlockOptions extends LongPressSelectionPluginOptions {
	allowCopyToClipboard?: boolean;
	allowCompositionInputOverride?: boolean;
}
