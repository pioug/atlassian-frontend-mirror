import type { ExpandPluginOptions } from '@atlaskit/editor-plugin-expand';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		__livePage: boolean | undefined;
		editorAppearance: FullPageEditorAppearance;
	};
}

export function expandPluginOptions({ options }: Props): ExpandPluginOptions {
	return {
		allowInsertion: true,
		useLongPressSelection: false,
		appearance: options.editorAppearance,
		allowInteractiveExpand: true,
		__livePage: options.__livePage,
	};
}
