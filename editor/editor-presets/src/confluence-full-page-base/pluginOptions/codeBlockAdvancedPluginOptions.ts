import type { CodeBlockAdvancedPluginOptions } from '@atlaskit/editor-plugin-code-block-advanced/codeBlockAdvancedPluginType';

interface Props {
	options: never;
}

export function codeBlockAdvancedPluginOptions({}: Props): CodeBlockAdvancedPluginOptions {
	return {
		allowCodeFolding: true,
	};
}
