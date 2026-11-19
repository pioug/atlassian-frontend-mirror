import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { addAltText, bindKeymapWithCommand, escape } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types/command';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { closeMediaAltTextMenu, openMediaAltTextMenu } from './commands';
import { getPluginState } from './index';

/**
 * On the top-layer path, Escape is taken only to close an open alt text menu. A handled key makes
 * ProseMirror call `preventDefault()`, which claims the Escape, so no layer around the editor (for
 * example a modal) would close on it.
 */
const closeOpenMediaAltTextMenu: Command = (state, dispatch, view) =>
	getPluginState(state)?.isAltTextEditorOpen ? closeMediaAltTextMenu(state, dispatch, view) : false;

export default function keymapPlugin(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
	const list = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(addAltText.common!, openMediaAltTextMenu(editorAnalyticsAPI), list);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		escape.common!,
		fg('platform-dst-top-layer') ? closeOpenMediaAltTextMenu : closeMediaAltTextMenu,
		list,
	);

	return keymap(list) as SafePlugin;
}
