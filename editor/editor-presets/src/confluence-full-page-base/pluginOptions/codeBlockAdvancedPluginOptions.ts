import type { CodeBlockAdvancedPluginOptions } from '@atlaskit/editor-plugin-code-block-advanced';

interface Props {
	options: never;
}

export function codeBlockAdvancedPluginOptions({}: Props): CodeBlockAdvancedPluginOptions {
	return {
		allowCodeFolding: true,
	};
}
