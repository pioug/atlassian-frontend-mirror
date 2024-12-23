import { bindKeymapWithCommand, moveLeft, moveRight } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { arrowLeft, arrowRight } from './commands';

function keymapPlugin() {
	const list = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveRight.common!, arrowRight, list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveLeft.common!, arrowLeft, list);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
