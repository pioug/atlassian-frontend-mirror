import type { SelectionPluginOptions } from '@atlaskit/editor-common/selection';

interface Props {
	options: {
		__livePage: boolean | undefined;
	};
}

export function selectionPluginOptions({ options }: Props): SelectionPluginOptions {
	return {
		useLongPressSelection: false,
		// @ts-ignore Temporary solution to check for Live Page editor.
		__livePage: options.__livePage,
	};
}
