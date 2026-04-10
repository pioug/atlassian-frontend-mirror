import type { LayoutPluginOptions } from '@atlaskit/editor-plugin-layout';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		editorAppearance: FullPageEditorAppearance;
	};
}

export function layoutPluginOptions({ options }: Props): LayoutPluginOptions {
	return {
		allowBreakout: true,
		UNSAFE_addSidebarLayouts: true,
		useLongPressSelection: false,
		UNSAFE_allowSingleColumnLayout: undefined,
		editorAppearance: options.editorAppearance,
	};
}
