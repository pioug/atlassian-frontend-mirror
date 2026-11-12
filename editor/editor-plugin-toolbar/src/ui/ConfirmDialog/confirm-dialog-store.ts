import type { ConfirmDialogOptions } from '@atlaskit/editor-common/types/floating-toolbar';

export type ConfirmDialogStore = {
	getOptions: () => ConfirmDialogOptions | undefined;
	hide: () => void;
	show: (options: ConfirmDialogOptions) => void;
	subscribe: (listener: () => void) => () => void;
};

/**
 * Holds the open confirm dialog for a toolbar action. Create one per editor, call `show` from the
 * action, and render `ConfirmDialog` with the same store.
 */
export const createConfirmDialogStore = (): ConfirmDialogStore => {
	let options: ConfirmDialogOptions | undefined;
	const listeners = new Set<() => void>();
	const set = (next?: ConfirmDialogOptions) => {
		options = next;
		listeners.forEach((listener) => listener());
	};

	return {
		getOptions: () => options,
		show: (next) => set(next),
		hide: () => set(),
		subscribe: (listener) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
	};
};
