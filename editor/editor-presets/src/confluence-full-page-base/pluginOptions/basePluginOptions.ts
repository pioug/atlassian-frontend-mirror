import type { BasePluginOptions, ScrollGutterPluginOptions } from '@atlaskit/editor-plugin-base';
import { fg } from '@atlaskit/platform-feature-flags';

interface Props {
	options: {
		__livePage?: boolean;
	};
}

export function basePluginOptions({ options }: Props): BasePluginOptions {
	const removeScrollGutter = !fg('confluence_frontend_content_wrapper') && options.__livePage;

	return {
		allowInlineCursorTarget: true,
		allowScrollGutter: removeScrollGutter
			? undefined
			: ({
					getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent'),
				} as ScrollGutterPluginOptions),
	};
}
