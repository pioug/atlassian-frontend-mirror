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

				// We will try to bypass the keycode only if any of mod keys are pressed,
				// to allow users to use non-latin and Dead characters.
				const isModKeyPressed = event.ctrlKey || event.metaKey;

				// Check the unicode of the character to assert that it's not an ASCII character.
				// These are characters outside latin's range.
				const isNonLatinKey = name.length === 1 && /[^\u0000-\u007f]/.test(name);

				// The `Dead` key is a key that combines with a following key to produce a combined character.
				// It will have `even.key === 'Dead'` in some browsers but the `keyCode` will be the same as in a qwerty-keyboard.
				// See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key and https://en.wikipedia.org/wiki/Dead_key
				const isDeadKey = name === 'Dead';

				if (isModKeyPressed && (isNonLatinKey || isDeadKey)) {
					keyboardEvent = new KeyboardEvent(event.type, {
						// FIXME: The event.keyCode is deprecated (see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode),
						//        and could be removed in any time, but the w3c-keyname library doesn't provide a way to get
						//        a key by event.code.
						key: base[event.keyCode],
						code: event.code,
						ctrlKey: event.ctrlKey,
						altKey: event.altKey,
						metaKey: event.metaKey,
						shiftKey: event.shiftKey,
					});
				}

				return keydownHandler(bindings)(view, keyboardEvent);
			},
		},
	});
}
