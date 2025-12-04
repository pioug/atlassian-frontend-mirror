import { expandedState, getNextNodeExpandPos } from '@atlaskit/editor-common/expand';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

/*
 * The way expand was built, no browser recognize selection on it.
 * For instance, when a selection going to a "collapsed" expand
 * the browser will try to send the cursor to inside the expand content (wrong),
 * this behavior is caused because the expand content is never true hidden
 * we just set the height to 1px.
 *
 * So, we need to capture a possible selection event
 * when a collapsed expand is the next node in the common depth.
 * If that is true, we create a new TextSelection and stop the event bubble
 */
const isCollapsedExpand = (
	node: PMNode | null | undefined,
	{ __livePage }: { __livePage: boolean },
): boolean => {
	let currentExpandedState;
	if (__livePage && fg('platform-editor-single-player-expand')) {
		currentExpandedState = node ? !expandedState.get(node) : undefined;
	} else if (__livePage) {
		currentExpandedState = node?.attrs.__expanded;
	} else {
		currentExpandedState = !node?.attrs.__expanded;
	}

	return Boolean(
		node && ['expand', 'nestedExpand'].includes(node.type.name) && currentExpandedState,
	);
};

/**
 * ED-18072 - Cannot shift + arrow past bodied extension if it is not empty
 */
const isBodiedExtension = (node: PMNode | null | undefined): boolean => {
	return Boolean(node && ['bodiedExtension'].includes(node.type.name));
};

/**
 * ED-19861 - [Regression] keyboard selections within action items are unpredicatable
 * Table was added to the list of problematic nodes because the desired behaviour when Shift+Up from outside the
 * table is to select the table node itself, rather than the table cell content. Previously this behaviour was handled
 * in `packages/editor/editor-core/src/plugins/selection/pm-plugins/events/create-selection-between.ts` but there was
 * a bug in `create-selection-between` which after fixing the bug that code was no longer handling table selection
 * correctly, so to fix that table was added here.
 */
const isTable = (node: PMNode | null | undefined): boolean => {
	return Boolean(node && ['table'].includes(node.type.name));
};

const isProblematicNode = (
	node: PMNode | null | undefined,
	{ __livePage }: { __livePage: boolean },
): boolean => {
	return isCollapsedExpand(node, { __livePage }) || isBodiedExtension(node) || isTable(node);
};

const findFixedProblematicNodePosition = (
	doc: PMNode,
	$head: ResolvedPos,
	direction: 'down' | 'up',
	{ __livePage }: { __livePage: boolean },
): ResolvedPos | null => {
	if ($head.pos === 0 || $head.depth === 0) {
		return null;
	}

	if (direction === 'up') {
		const pos = $head.before();
		const $posResolved = $head.doc.resolve(pos);
		const maybeProblematicNode = $posResolved.nodeBefore;

		if (maybeProblematicNode && isProblematicNode(maybeProblematicNode, { __livePage })) {
			const nodeSize = maybeProblematicNode.nodeSize;
			const nodeStartPosition = pos - nodeSize;

			// ($head.pos - 1) will correspond to (nodeStartPosition + nodeSize) when we are at the start of the text node
			const isAtEndOfProblematicNode = $head.pos - 1 === nodeStartPosition + nodeSize;
			if (isAtEndOfProblematicNode) {
				const startPosNode = Math.max(nodeStartPosition, 0);
				const $startPosNode = $head.doc.resolve(Math.min(startPosNode, $head.doc.content.size));
				return $startPosNode;
			}
		}
	}

	if (direction === 'down') {
		const pos = $head.after();
		const maybeProblematicNode = doc.nodeAt(pos);

		if (
			maybeProblematicNode &&
			isProblematicNode(maybeProblematicNode, { __livePage }) &&
			$head.pos + 1 === pos
		) {
			const nodeSize = maybeProblematicNode.nodeSize;
			const nodePosition = pos + nodeSize;
			const startPosNode = Math.max(nodePosition, 0);
			const $startPosNode = $head.doc.resolve(Math.min(startPosNode, $head.doc.content.size));
			return $startPosNode;
		}
	}

	return null;
};

const isSelectionLineShortcutWhenCursorIsInsideInlineNode = (
	view: EditorView,
	event: KeyboardEvent,
): boolean => {
	if (!event.shiftKey || !event.metaKey) {
		return false;
	}

	const selection = view.state.selection;
	if (!(selection instanceof TextSelection)) {
		return false;
	}

	if (!selection.$cursor) {
		return false;
	}

	const isSelectingInlineNodeForward =
		event.key === 'ArrowRight' && Boolean(selection.$cursor.nodeAfter?.isInline);
	const isSelectingInlineNodeBackward =
		event.key === 'ArrowLeft' && Boolean(selection.$cursor.nodeBefore?.isInline);

	return isSelectingInlineNodeForward || isSelectingInlineNodeBackward;
};

const isNavigatingVerticallyWhenCursorIsInsideInlineNode = (
	view: EditorView,
	event: KeyboardEvent,
): boolean => {
	if (event.shiftKey || event.metaKey) {
		return false;
	}
	const selection = view.state?.selection;
	if (!(selection instanceof TextSelection)) {
		return false;
	}

	if (!selection.$cursor) {
		return false;
	}

	const isNavigatingInlineNodeDownward =
		event.key === 'ArrowDown' &&
		Boolean(selection.$cursor.nodeBefore?.isInline) &&
		Boolean(selection.$cursor.nodeAfter?.isInline);

	if (
		isNavigatingInlineNodeDownward &&
		getNextNodeExpandPos(view, selection) !== undefined &&
		expValEqualsNoExposure('platform_editor_lovability_navigation_fixes', 'isEnabled', true)
	) {
		return false;
	}
	return isNavigatingInlineNodeDownward;
};

export function createOnKeydown({ __livePage = false }: { __livePage?: boolean }) {
	function onKeydown(view: EditorView, event: Event): boolean {
		/*
		 * This workaround is needed for some specific situations.
		 * - expand collapse
		 * - bodied extension
		 */
		if (!(event instanceof KeyboardEvent)) {
			return false;
		}

		// Override the default behaviour to make sure that the selection always extends to
		// the start of the document and not just the first inline position.
		if (event.shiftKey && event.metaKey && event.key === 'ArrowUp') {
			const selection = TextSelection.create(view.state.doc, view.state.selection.$anchor.pos, 0);
			view.dispatch(view.state.tr.setSelection(selection));

			event.preventDefault();
			return true;
		}

		if (isSelectionLineShortcutWhenCursorIsInsideInlineNode(view, event)) {
			return true;
		}

		if (isNavigatingVerticallyWhenCursorIsInsideInlineNode(view, event)) {
			return true;
		}

		if (!event.shiftKey || event.ctrlKey || event.metaKey) {
			return false;
		}

		if (!['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
			return false;
		}

		const {
			doc,
			selection: { $head, $anchor },
		} = view.state;

		if (
			(event.key === 'ArrowRight' && $head.nodeAfter) ||
			(event.key === 'ArrowLeft' && $head.nodeBefore)
		) {
			return false;
		}

		const direction = ['ArrowLeft', 'ArrowUp', 'Home'].includes(event.key) ? 'up' : 'down';
		const $fixedProblematicNodePosition = findFixedProblematicNodePosition(doc, $head, direction, {
			__livePage,
		});

		if ($fixedProblematicNodePosition) {
			// an offset is used here so that left arrow selects the first character before the node (consistent with arrow right)
			const headOffset = event.key === 'ArrowLeft' ? -1 : 0;
			const head = $fixedProblematicNodePosition.pos + headOffset;

			const forcedTextSelection = TextSelection.create(view.state.doc, $anchor.pos, head);

			const tr = view.state.tr;

			tr.setSelection(forcedTextSelection);

			view.dispatch(tr);

			event.preventDefault();

			return true;
		}

		return false;
	}

	return onKeydown;
}
