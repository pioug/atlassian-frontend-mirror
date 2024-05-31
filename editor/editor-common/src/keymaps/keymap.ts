import { base, keyName } from 'w3c-keyname';

import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';

import { SafePlugin } from '../safe-plugin';

/**
 * A workaround for mostly Cyrillic but should have a positive affect
 * on other languages / layouts. Attempts a similar approach to OS X.
 * @see ED-7310
 * @see https://github.com/ProseMirror/prosemirror/issues/957
 * @param bindings
 */
export function keymap(bindings: { [key: string]: any }) {
	return new SafePlugin({
		props: {
			handleKeyDown(view, event) {
				const name = keyName(event);
				let keyboardEvent = event;
				if (
					event.ctrlKey &&
					name.length === 1 &&
					// Check the unicode of the character to
					// assert that its not an ASCII character.
					// These are characters outside Latin's range.
					/[^\u0000-\u007f]/.test(name)
				) {
					keyboardEvent = new KeyboardEvent('keydown', {
						key: base[event.keyCode],
						code: event.code,
						ctrlKey: true,
					});
				}
				return keydownHandler(bindings)(view, keyboardEvent);
			},
		},
	});
}
