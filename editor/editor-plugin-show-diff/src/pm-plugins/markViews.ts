import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

type RenderedMark = { contentDOM?: HTMLElement | null; dom: Node };

/**
 * `@atlaskit/editor-prosemirror/view` doesn't re-export prosemirror-view's `MarkViewConstructor`,
 * so it's typed locally, as `EditorSSRRenderer` does.
 */
type LocalMarkViewConstructor = (mark: Mark, view: EditorView, inline: boolean) => RenderedMark;

/** Where to look up a mark's renderer, and the view to render it against. */
export type MarkViewSources = {
	nodeViews?: Record<string, NodeViewConstructor>;
	view?: EditorView;
};

/**
 * Renders a mark as ProseMirror does: `view.nodeViews` also holds mark views, keyed by mark name,
 * so `breakout` resolves whether it's registered under `markViews` or `nodeViews`. Falls back to
 * `toDOM` — they can differ: `breakout` renders `.fabric-editor-breakout-mark-dom`, which the width
 * CSS targets.
 */
const renderMarkView = (
	mark: Mark,
	inline: boolean,
	{ nodeViews, view }: MarkViewSources,
): RenderedMark | null => {
	try {
		const markView = nodeViews?.[mark.type.name] as unknown as LocalMarkViewConstructor | undefined;
		if (markView && view) {
			const rendered = markView(mark, view, inline);
			return { dom: rendered.dom, contentDOM: rendered.contentDOM };
		}

		const toDOM = mark.type.spec.toDOM;
		if (!toDOM) {
			return null;
		}
		return DOMSerializer.renderSpec(document, toDOM(mark, inline));
	} catch {
		return null;
	}
};

/**
 * Wraps rendered DOM in its marks, as ProseMirror does for the live document. Without this a
 * block node loses `breakout`, whose wrapper supplies the width. Marks nest
 * outside-in, so `marks[0]` is outermost.
 */
export const wrapInMarkViews = (
	targetNode: PMNode,
	nodeDom: Node,
	sources: MarkViewSources,
): Node => {
	if (targetNode.marks.length === 0 || !fg('platform_editor_ai_show_diff_patch_2')) {
		return nodeDom;
	}

	let wrapped = nodeDom;
	for (let index = targetNode.marks.length - 1; index >= 0; index--) {
		const mark = targetNode.marks[index];
		const rendered = renderMarkView(mark, targetNode.isInline, sources);
		// No content hole means nowhere to nest the node, so skip the mark, not the node.
		if (!rendered?.contentDOM) {
			continue;
		}
		rendered.contentDOM.appendChild(wrapped);
		wrapped = rendered.dom;
	}

	return wrapped;
};
