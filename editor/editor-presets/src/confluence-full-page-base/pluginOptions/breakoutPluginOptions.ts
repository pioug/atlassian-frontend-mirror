import type { BreakoutPluginOptions } from '@atlaskit/editor-plugin-breakout';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		editorAppearance: FullPageEditorAppearance;
	};
}

export function breakoutPluginOptions({ options }: Props): BreakoutPluginOptions {
	return {
		allowBreakoutButton: options.editorAppearance === 'full-page',
		appearance: options.editorAppearance,
	};
}
