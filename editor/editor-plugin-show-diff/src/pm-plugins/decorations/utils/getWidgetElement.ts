import type { Decoration } from '@atlaskit/editor-prosemirror/view';

// prosemirror-view does not type `Decoration.type`; a widget's `type.toDOM` is the node passed to
// `Decoration.widget()` (an element or a factory — the `WidgetConstructor` union).
type WidgetDecoration = { type?: { toDOM?: HTMLElement | ((...args: never[]) => Node) } };

// The element a widget renders, or undefined if it renders via a factory.
export const getWidgetElement = (decoration: Decoration): HTMLElement | undefined => {
	const { toDOM } = (decoration as Decoration & WidgetDecoration).type ?? {};
	return toDOM instanceof HTMLElement ? toDOM : undefined;
};
