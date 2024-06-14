import {
	alignCenter,
	alignLeft,
	alignRight,
	bindKeymapWithCommand,
	keymap,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { changeAlignment } from '../commands';

export function keymapPlugin(): SafePlugin {
	const list = {};

	bindKeymapWithCommand(alignLeft.common!, changeAlignment('start'), list);
	if (getBooleanFF('platform.editor.text-alignment-keyboard-shortcuts')) {
		bindKeymapWithCommand(alignCenter.common!, changeAlignment('center'), list);
		bindKeymapWithCommand(alignRight.common!, changeAlignment('end'), list);
	}

	return keymap(list) as SafePlugin;
}
