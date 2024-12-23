import {
	alignCenter,
	alignLeft,
	alignRight,
	bindKeymapWithCommand,
	keymap,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { changeAlignment } from '../editor-commands';

export function keymapPlugin(): SafePlugin {
	const list = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(alignLeft.common!, changeAlignment('start'), list);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(alignCenter.common!, changeAlignment('center'), list);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(alignRight.common!, changeAlignment('end'), list);

	return keymap(list) as SafePlugin;
}
