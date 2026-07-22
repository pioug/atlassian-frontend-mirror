import type { BasePluginOptions, ScrollGutterPluginOptions } from '@atlaskit/editor-plugin-base';

export function basePluginOptions(): BasePluginOptions {
	return {
		allowInlineCursorTarget: true,
		allowScrollGutter: {
			getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent'),
		} as ScrollGutterPluginOptions,
	};
}
