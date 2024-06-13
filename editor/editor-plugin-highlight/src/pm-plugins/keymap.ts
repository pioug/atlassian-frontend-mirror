import {
	bindKeymapWithCommand,
	keymap,
	toggleHighlightPalette,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { togglePalette } from '../commands';
import type { HighlightPlugin } from '../plugin';

export function keymapPlugin({ api }: { api: ExtractInjectionAPI<HighlightPlugin> | undefined }) {
	const list = {};

	bindKeymapWithCommand(toggleHighlightPalette.common!, togglePalette(api!), list);

	return keymap(list) as SafePlugin;
}
