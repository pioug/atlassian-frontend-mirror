import type { ScrollGutterPluginOptions } from '@atlaskit/editor-plugins/base';

import type { EditorProps } from '../types/editor-props';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';

export function getScrollGutterOptions(props: EditorProps): ScrollGutterPluginOptions | undefined {
	const { appearance } = props;

	if (fullPageCheck(appearance)) {
		// Full Page appearance uses a scrollable div wrapper.
		return {
			getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent'),
		};
	}
	return undefined;
}
