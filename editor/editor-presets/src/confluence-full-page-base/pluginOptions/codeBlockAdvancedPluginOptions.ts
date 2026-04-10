import type { CodeBlockAdvancedPluginOptions } from '@atlaskit/editor-plugin-code-block-advanced';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Props {
	options: never;
}

export function codeBlockAdvancedPluginOptions({}: Props): CodeBlockAdvancedPluginOptions {
	return {
		allowCodeFolding: expValEquals('platform_editor_code_block_fold_gutter', 'isEnabled', true),
	};
}
