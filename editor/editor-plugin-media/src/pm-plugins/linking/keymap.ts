import { addLink, bindKeymapWithCommand } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

import { showLinkingToolbarWithMediaTypeCheck } from '../commands/linking';

export default function keymapPlugin(schema: Schema): SafePlugin {
	const list = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(addLink.common!, showLinkingToolbarWithMediaTypeCheck, list);

	return keymap(list) as SafePlugin;
}
