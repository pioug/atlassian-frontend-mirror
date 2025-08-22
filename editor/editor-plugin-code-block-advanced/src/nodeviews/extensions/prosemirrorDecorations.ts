import { type Facet } from '@codemirror/state';
import {
	ViewPlugin,
	WidgetType,
	Decoration as CodeMirrorDecoration,
	type EditorView as CodeMirror,
	type DecorationSet,
	type ViewUpdate,
} from '@codemirror/view';

import type { EditorView, Decoration, DecorationSource } from '@atlaskit/editor-prosemirror/view';

class PMWidget extends WidgetType {
	constructor(readonly toDOMElement: HTMLElement) {
		super();
	}
	toDOM() {
		return this.toDOMElement;
	}
	ignoreEvent() {
		return false;
	}
}

// This type is not exposed publically by ProseMirror but we need it to map to CodeMirror
// See: https://github.com/ProseMirror/prosemirror-view/blob/master/src/decoration.ts
type WidgetConstructor = ((view: EditorView, getPos: () => number | undefined) => Node) | Node;

// This type is not exposed publically by ProseMirror but we need it to map to CodeMirror
// See: https://github.com/ProseMirror/prosemirror-view/blob/master/src/decoration.ts
interface ExtendedProseMirrorDecoration extends Decoration {
	inline: boolean;
	type: {
		attrs?: Record<string, string>;
		side?: number;
		toDOM?: WidgetConstructor;
	};
	widget: boolean;
}

// This type is not exposed publically by ProseMirror but we need it to map to CodeMirror
// See: https://github.com/ProseMirror/prosemirror-view/blob/master/src/decoration.ts
function isExtendedDecoration(decoration: Decoration): decoration is ExtendedProseMirrorDecoration {
	return (
		(decoration as ExtendedProseMirrorDecoration).inline !== undefined &&
		(decoration as ExtendedProseMirrorDecoration).widget !== undefined &&
		(decoration as ExtendedProseMirrorDecoration).type !== undefined
	);
}

const getHTMLElement = (
	toDOM: WidgetConstructor | undefined,
	view: EditorView,
	getPos: () => number | undefined,
): HTMLElement | undefined => {
	if (toDOM instanceof Function) {
		const element = toDOM(view, getPos);
		return element instanceof HTMLElement ? element : undefined;
	} else if (toDOM instanceof HTMLElement) {
		return toDOM;
	}
};

const mapPMDecorationToCMDecoration = (
	decoration: Decoration,
	view: EditorView,
	getPos: () => number | undefined,
) => {
	if (!isExtendedDecoration(decoration)) {
		return undefined;
	}
	if (decoration.inline) {
		const markDecoration = CodeMirrorDecoration.mark({
			attributes: decoration.type.attrs,
		});
		return markDecoration.range(decoration.from, decoration.to);
	} else if (decoration.widget) {
		const toDOM = getHTMLElement(decoration?.type?.toDOM, view, getPos);
		if (!toDOM) {
			return undefined;
		}

		const widgetDecoration = CodeMirrorDecoration.widget({
			widget: new PMWidget(toDOM),
			side: decoration.type.side,
		});
		return widgetDecoration.range(decoration.from, decoration.to);
	}
};

function isDefined<TValue>(value: TValue | undefined): value is TValue {
	return value !== undefined;
}

/**
 * Creates CodeMirror versions of the decorations provided by ProseMirror.
 *
 * Inline ProseMirror decorations -> Mark CodeMirror decorations
 * Widget ProseMirror decorations -> Widget CodeMirror decorations
 *
 * This way any decorations applied in ProseMirror land should automatically be supported
 * by the CodeMirror editor
 *
 * @param updateDecorationsEffect Facet for the prosemirror decorations
 * @returns CodeMirror extension
 */
export const prosemirrorDecorationPlugin = (
	updateDecorationsEffect: Facet<DecorationSource>,
	editorView: EditorView,
	getPos: () => number | undefined,
) =>
	ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: CodeMirror) {
				this.decorations = this.updateDecorations(view);
			}
			updateDecorations(view: CodeMirror) {
				const { from, to } = view.viewport;

				const innnerDecorations = view.state.facet(updateDecorationsEffect);
				const allDecorations: Decoration[] = [];
				innnerDecorations?.map((source) => {
					source?.forEachSet((set) => {
						const decorations = set
							.find(from, to)
							// Do not render the code block line decorations
							.filter((dec) => dec.spec.type !== 'decorationWidgetType');
						allDecorations.push(...decorations);
					});
				});

				const cmDecorations = allDecorations
					.sort((a, b) => (a.from < b.from ? -1 : 1))
					.map((decoration) => mapPMDecorationToCMDecoration(decoration, editorView, getPos))
					.filter(isDefined);

				return CodeMirrorDecoration.set(cmDecorations);
			}
			update(update: ViewUpdate) {
				this.decorations = this.updateDecorations(update.view);
			}
		},
		{
			decorations: (v) => v.decorations,
		},
	);
