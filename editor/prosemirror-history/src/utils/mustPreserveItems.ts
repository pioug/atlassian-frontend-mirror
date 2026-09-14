import type { EditorState, Plugin } from '@atlaskit/editor-prosemirror/state';

let cachedPreserveItems = false,
	cachedPreserveItemsPlugins: readonly Plugin[] | null = null;
// Check whether any plugin in the given state has a
// `historyPreserveItems` property in its spec, in which case we must
// preserve steps exactly as they came in, so that they can be
// rebased.
export function mustPreserveItems(state: EditorState): boolean {
	const plugins = state.plugins;
	// To match existing behaviour of prosemirror-history
	// eslint-disable-next-line eqeqeq
	if (cachedPreserveItemsPlugins != plugins) {
		cachedPreserveItems = false;
		cachedPreserveItemsPlugins = plugins;
		for (let i = 0; i < plugins.length; i++) {
			// To match existing behaviour of prosemirror-history
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((plugins[i].spec as any).historyPreserveItems) {
				cachedPreserveItems = true;
				break;
			}
		}
	}
	return cachedPreserveItems;
}
