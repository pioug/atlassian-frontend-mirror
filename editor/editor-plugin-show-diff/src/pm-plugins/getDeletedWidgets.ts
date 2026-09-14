import type { EditorState } from 'prosemirror-state';
import type { Decoration } from 'prosemirror-view';

import type { DeletedDiffWidget } from '../showDiffPluginType';

import { isDiffDecorationSpec } from './decorations/decorationKeys';
import { showDiffPluginKey } from './main';

// prosemirror-view does not type `Decoration.type`; a widget's `type.toDOM` is the node passed to
// `Decoration.widget()` (an element or a factory — the `WidgetConstructor` union).
type WidgetDecoration = { type?: { toDOM?: HTMLElement | ((...args: never[]) => Node) } };

// The element a deleted-content widget renders, or undefined if it renders via a factory.
const getWidgetElement = (decoration: Decoration): HTMLElement | undefined => {
	const { toDOM } = (decoration as Decoration & WidgetDecoration).type ?? {};
	return toDOM instanceof HTMLElement ? toDOM : undefined;
};

/**
 * The rendered deleted-content widgets in `editorState`, optionally restricted to `[from, to]`,
 * ordered by position. Deleted content is rendered as widget decorations rather than document
 * nodes, so this is how the element and the position it is anchored at are recovered.
 *
 * Kept internal and surfaced only through the `getDeletedWidgets` plugin action, so consumers never
 * receive the plugin key or the decoration set (which would let them mutate plugin behaviour).
 */
export const getDeletedWidgets = (
	editorState: EditorState,
	range?: { from: number; to: number },
): DeletedDiffWidget[] => {
	const decorations = showDiffPluginKey.getState(editorState)?.decorations;
	if (!decorations) {
		return [];
	}

	return decorations
		.find(
			range?.from,
			range?.to,
			(spec) => isDiffDecorationSpec(spec) && spec.decorationType === 'widget',
		)
		.reduce<DeletedDiffWidget[]>((widgets, decoration) => {
			const element = getWidgetElement(decoration);
			if (element) {
				widgets.push({ element, position: decoration.from });
			}
			return widgets;
		}, [])
		.sort((a, b) => a.position - b.position);
};
