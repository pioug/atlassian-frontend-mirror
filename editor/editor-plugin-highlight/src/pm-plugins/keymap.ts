import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	bindKeymapWithCommand,
	keymap,
	toggleHighlightPalette,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { togglePalette } from '../editor-commands/palette';
import type { HighlightPlugin } from '../highlightPluginType';

export function keymapPlugin({ api }: { api: ExtractInjectionAPI<HighlightPlugin> | undefined }) {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		toggleHighlightPalette.common!,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		togglePalette(api!)({ inputMethod: INPUT_METHOD.SHORTCUT }),
		list,
	);

	return keymap(list) as SafePlugin;
}
