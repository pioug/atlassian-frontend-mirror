import { bind } from 'bind-event-listener';

import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { bindKeymapWithCommand, find as findKeymap } from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { FindReplacePlugin } from '../findReplacePluginType';
import { activateWithAnalytics } from './commands-with-analytics';

/**
 * Whether the event came from a field the user is typing into. `Mod-f` belongs to
 * that field, not to us.
 */
const isFromTextEntry = (event: KeyboardEvent): boolean => {
	const target = event.target;
	return (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	);
};

const activateInViewMode =
	(api?: ExtractInjectionAPI<FindReplacePlugin>): Command =>
	(state, dispatch) => {
		// In edit mode `./keymap.ts` already handles `Mod-f`. Handling it here as well
		// would activate the dialog twice from a single keypress.
		if (api?.editorViewMode?.sharedState.currentState()?.mode !== 'view') {
			return false;
		}

		activateWithAnalytics(
			api?.analytics?.actions,
			api?.editorViewMode,
		)({
			triggerMethod: TRIGGER_METHOD.SHORTCUT,
		})(state, dispatch);
		return true;
	};

/**
 * Opens the find dialog on `Mod-f` while the editor is in view mode.
 *
 * The listener is bound on the document so that it still fires in view mode, where
 * ProseMirror delivers the keydown to neither `keymap()` nor `handleDOMEvents`.
 */
export const viewModeShortcutPlugin = (
	api?: ExtractInjectionAPI<FindReplacePlugin>,
): SafePlugin => {
	const bindings = {};
	if (findKeymap.common) {
		bindKeymapWithCommand(findKeymap.common, activateInViewMode(api), bindings);
	}
	const handleKeydown = keydownHandler(bindings);

	return new SafePlugin({
		view: (view: EditorView) => {
			const unbind = bind(view.root, {
				type: 'keydown',
				listener: (event) => {
					// `view.root` is `Document | ShadowRoot`, so the binding widens the event.
					if (!(event instanceof KeyboardEvent) || isFromTextEntry(event)) {
						return;
					}

					if (handleKeydown(view, event)) {
						// Without this the browser find bar opens on top of our dialog.
						event.preventDefault();
					}
				},
			});

			return { destroy: unbind };
		},
	});
};
