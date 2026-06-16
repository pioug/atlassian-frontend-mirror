import type { CodeBlockPluginOptions } from '@atlaskit/editor-plugin-code-block';
import type { CodeBlockFormatProvider } from '@atlaskit/editor-plugin-code-block/types';

interface Props {
	providers: {
		formatCodeProvider?: CodeBlockFormatProvider;
	};
}

export function codeBlockPluginOptions({ providers }: Props): CodeBlockPluginOptions {
	return {
		allowCopyToClipboard: true,
		useLongPressSelection: false,
		allowCompositionInputOverride: false,
		formatCodeProvider: providers.formatCodeProvider,
	};
}
