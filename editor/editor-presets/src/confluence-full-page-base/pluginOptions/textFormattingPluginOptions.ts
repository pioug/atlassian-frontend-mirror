import type { TextFormattingPluginOptions } from '@atlaskit/editor-plugin-text-formatting/text-formatting-plugin-type';

interface Params {
	options: never;
}

export function textFormattingPluginOptions({}: Params): TextFormattingPluginOptions {
	return {
		responsiveToolbarMenu: true,
	};
}
