import type { CodeBlockPluginOptions } from '@atlaskit/editor-plugin-code-block';

interface Props {
	options: never;
}

export function codeBlockPluginOptions({}: Props): CodeBlockPluginOptions {
	return {
		allowCopyToClipboard: true,
		useLongPressSelection: false,
		allowCompositionInputOverride: false,
	};
}
