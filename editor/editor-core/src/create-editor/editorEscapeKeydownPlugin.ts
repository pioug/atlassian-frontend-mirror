import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

const key = new PluginKey('editorEscapeKeydownPlugin');

/**
 * ProseMirror calls `preventDefault()` on every Escape keydown, even one that no keymap uses
 * (`captureKeyDown` in prosemirror-view). On the top-layer path a cancelled Escape is taken, so a
 * modal or popup around the editor would not close on it.
 *
 * This plugin must run after every other plugin. It runs the `handleKeyDown` props itself, cancels
 * the Escape only when one of them took it, and skips ProseMirror's own keydown handling.
 */
export const createEditorEscapeKeydownPlugin = (): SafePlugin =>
	new SafePlugin({
		key,
		props: {
			handleDOMEvents: {
				keydown(view, event) {
					// ProseMirror leaves a composition or a read-only editor alone. So do we.
					if (event.key !== 'Escape' || event.isComposing || view.composing || !view.editable) {
						return false;
					}
					if (view.someProp('handleKeyDown', (handleKeyDown) => handleKeyDown(view, event))) {
						event.preventDefault();
					}
					return true;
				},
			},
		},
	});
