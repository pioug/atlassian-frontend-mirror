import {
	bindKeymapWithCommand,
	moveLeft,
	moveRight,
	selectNode,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { arrowLeft, arrowRight, selectNodeWithModA } from './commands';

function keymapPlugin() {
	const list = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveRight.common!, arrowRight, list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveLeft.common!, arrowLeft, list);

	if (
		editorExperiment('platform_editor_cmd_a_progressively_select_nodes', true, { exposure: true })
	) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		bindKeymapWithCommand(selectNode.common!, selectNodeWithModA(), list);
	}

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
