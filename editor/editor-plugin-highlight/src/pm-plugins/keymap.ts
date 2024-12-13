import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	bindKeymapWithCommand,
	keymap,
	toggleHighlightPalette,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { togglePalette } from '../editor-commands';
import type { HighlightPlugin } from '../highlightPluginType';

export function keymapPlugin({ api }: { api: ExtractInjectionAPI<HighlightPlugin> | undefined }) {
	const list = {};

	bindKeymapWithCommand(
		toggleHighlightPalette.common!,
		togglePalette(api!)({ inputMethod: INPUT_METHOD.SHORTCUT }),
		list,
	);

	return keymap(list) as SafePlugin;
}
