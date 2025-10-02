import {
	bindKeymapWithEditorCommand,
	keymap,
	toggleHighlightPalette,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { togglePalette } from '../editor-commands/palette';
import type { TextColorPlugin } from '../textColorPluginType';

export function keymapPlugin({ api }: { api: ExtractInjectionAPI<TextColorPlugin> | undefined }) {
	const list = {};

	if (toggleHighlightPalette.common) {
		bindKeymapWithEditorCommand(toggleHighlightPalette.common, togglePalette(api), list);
	}

	return keymap(list) as SafePlugin;
}
