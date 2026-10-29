/**
 * `true` for an Escape keydown that a layer should act on.
 */
export function isEscapeToHandle({ event }: { event: KeyboardEvent }): boolean {
	if (event.key !== 'Escape') {
		return false;
	}

	// Something else already handled this Escape.
	if (event.defaultPrevented) {
		return false;
	}

	/**
	 * The user is typing with an IME (input method editor), such as for Japanese or Chinese text.
	 * While a composition is open, Escape cancels the composition, so it must not also close a layer.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
	 */
	if (event.isComposing) {
		return false;
	}

	return true;
}
