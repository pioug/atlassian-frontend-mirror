import type { TextColorPluginOptions } from '@atlaskit/editor-plugin-text-color/text-color-plugin-type';

interface Props {
	options: never;
}

export function textColorPluginOptions({}: Props): TextColorPluginOptions {
	return true;
}
