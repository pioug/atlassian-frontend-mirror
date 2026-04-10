import type { TextColorPluginOptions } from '@atlaskit/editor-plugin-text-color';

interface Props {
	options: never;
}

export function textColorPluginOptions({}: Props): TextColorPluginOptions {
	return true;
}
