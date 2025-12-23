import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const forceFocusStateKey = new PluginKey('forceFocusStatePlugin');
/**
 * Used in cases where a floating toolbar button opens a submenu which destroys
 * the button, but the user has pressed ESC to close the submenu and focus needs
 * to move back to the button. */
export default () =>
	new SafePlugin({
		key: forceFocusStateKey,
		state: {
			init: () => ({
				selector: null,
			}),
			apply: (tr, prevState) => {
				const meta = tr.getMeta(forceFocusStateKey);
				if (meta && 'selector' in meta) {
					return { selector: meta.selector };
				}
				return prevState;
			},
		},
	});

/**
 * The provided selector should be the floating toolbar button that needs focus.
 */
export const forceFocusSelector = (selector: string | null) => (tr: Transaction) => {
	return tr.setMeta(forceFocusStateKey, {
		selector,
	});
};

/**
 * If a selector is set and the element exists, focus it.
 */
export function checkShouldForceFocusAndApply(view?: EditorView): void {
	const state = view?.state;
	if (state) {
		const { selector } = forceFocusStateKey.getState(state);
		if (selector) {
			const focusableElement = document.querySelector(selector);
			if (focusableElement) {
				focusableElement.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'nearest',
				});
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(focusableElement as HTMLElement).focus();

				const {
					state: { tr },
					dispatch,
				} = view;

				dispatch(forceFocusSelector(null)(tr));
			}
		}
	}
}
