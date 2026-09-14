import { useCallback } from 'react';

// Usually either a DOM node or editorView
type Focusable = {
	focus: () => unknown;
};

export const useFocus = ({ target }: { target: Focusable }): (() => void) => {
	const focus = useCallback(() => {
		// Use setTimeout to run this async after any DOM updates in same callback
		setTimeout(() => target.focus(), 0);
	}, [target]);

	return focus;
};
