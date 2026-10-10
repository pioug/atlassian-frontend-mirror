import type { BasePluginOptions } from '@atlaskit/editor-plugin-base/basePluginType';
import type { ScrollGutterPluginOptions } from '@atlaskit/editor-plugin-base/plugin';

export function basePluginOptions(): BasePluginOptions {
	return {
		allowInlineCursorTarget: true,
		allowScrollGutter: {
			getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent'),
		} as ScrollGutterPluginOptions,
	};
}
