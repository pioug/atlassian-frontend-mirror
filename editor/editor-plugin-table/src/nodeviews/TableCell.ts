import type { CellDomAttrs } from '@atlaskit/adf-schema';
import { getCellAttrs, getCellDomAttrs } from '@atlaskit/adf-schema';
import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import TableNodeView from './TableNodeViewBase';

const DEFAULT_COL_SPAN = 1;
const DEFAULT_ROW_SPAN = 1;

/**
 * For performance reasons we do this in the background - it shouldn't block the main thread
 */
function delayUntilIdle(cb: Function) {
	if (typeof window === 'undefined') {
		return;
	}
	// eslint-disable-next-line compat/compat
	if (window.requestIdleCallback !== undefined) {
		// eslint-disable-next-line compat/compat
		return window.requestIdleCallback(() => cb(), { timeout: 500 });
	}
	return window.requestAnimationFrame(() => cb());
}

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const cssVariablePattern = /^VAR\(--.*\)$/;

export default class TableCell extends TableNodeView<HTMLElement> implements NodeView {
	private delayHandle: number | undefined;

	/** Cached edge state to avoid redundant DOM writes. */
	private prevReachesTop = false;
	private prevReachesBottom = false;
	private prevReachesLeft = false;
	private prevReachesRight = false;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: () => number | undefined,
		eventDispatcher: EventDispatcher,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	) {
		super(node, view, getPos, eventDispatcher);

		if (expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)) {
			this.updateTableEdgeAttrs(node);
		}

		// CONFCLOUD-78239: Previously we had a bug which tried to invert the heading colour of a table
		// Obviously design tokens can't be inverted and so it would result in `VAR(--DS-BACKGROUND-ACCENT-GRAY-SUBTLEST, #F4F5F7)`
		// which is not a valid CSS variable.
		//
		// We should follow-up and remove this in TODO-xx in 6 months once we're confident
		// that this has fixed most of the cases in the wild.
		//
		// This is a workaround to fix those cases on the fly. Note it is super specific on purpose
		// so that it just fixes the heading token (other tokens should be unaffected)
		// At some point in the future
		if (cssVariablePattern.test(node.attrs.background)) {
			this.delayHandle = delayUntilIdle(() => {
				const pos = getPos();
				if (pos) {
					const tr = view.state.tr;
					tr.setNodeAttribute(pos, 'background', node.attrs.background.toLowerCase())
						// Ensures dispatch does not contribute to undo history (otherwise user requires multiple undo's to revert table)
						.setMeta('addToHistory', false);
					editorAnalyticsAPI?.attachAnalyticsEvent({
						action: TABLE_ACTION.TABLE_CELL_BACKGROUND_FIXED,
						actionSubject: ACTION_SUBJECT.TABLE,
						actionSubjectId: null,
						eventType: EVENT_TYPE.TRACK,
					})(tr);
					view.dispatch(tr);
				}
			});
		}
	}

	destroy = (): void => {
		if (this.delayHandle && typeof window !== 'undefined') {
			// eslint-disable-next-line compat/compat
			window?.cancelIdleCallback?.(this.delayHandle);
			window?.cancelAnimationFrame?.(this.delayHandle);
		}
	};

	update(node: PMNode): boolean {
		const didUpdate = this.updateNodeView(node);
		if (didUpdate) {
			this.node = node;
		}
		return didUpdate;
	}

	/**
	 * Detects whether this cell visually reaches the bottom or right edge of the table
	 * (accounting for rowspan/colspan) and sets data attributes so CSS can apply
	 * rounded corners and transparent borders to merged cells that span to the table edges.
	 */
	private updateTableEdgeAttrs(node: PMNode): void {
		const pos = this.getPos();
		if (pos === undefined) {
			return;
		}

		try {
			const resolvedPos = this.view.state.doc.resolve(pos);

			// Cell → row → table: depth-1 is the table, depth is the row
			const tableDepth = resolvedPos.depth - 1;
			const rowDepth = resolvedPos.depth;

			if (tableDepth < 0 || rowDepth < 0) {
				return;
			}

			const tableNode = resolvedPos.node(tableDepth);
			if (tableNode.type.name !== 'table') {
				return;
			}

			const tableMap = TableMap.get(tableNode);
			const cellStartInTable = pos - resolvedPos.start(tableDepth);
			const cellRect = tableMap.findCell(cellStartInTable);

			const reachesTop = cellRect.top === 0;
			const reachesBottom = cellRect.bottom >= tableMap.height;
			const reachesLeft = cellRect.left === 0;
			const reachesRight = cellRect.right >= tableMap.width;

			// Only touch DOM attributes that actually changed
			if (reachesTop !== this.prevReachesTop) {
				this.prevReachesTop = reachesTop;
				this.setDataAttr('data-reaches-top', reachesTop);
			}
			if (reachesBottom !== this.prevReachesBottom) {
				this.prevReachesBottom = reachesBottom;
				this.setDataAttr('data-reaches-bottom', reachesBottom);
			}
			if (reachesLeft !== this.prevReachesLeft) {
				this.prevReachesLeft = reachesLeft;
				this.setDataAttr('data-reaches-left', reachesLeft);
			}
			if (reachesRight !== this.prevReachesRight) {
				this.prevReachesRight = reachesRight;
				this.setDataAttr('data-reaches-right', reachesRight);
			}
		} catch {
			// Position may be stale during document mutations; silently ignore.
		}
	}

	private setDataAttr(attr: string, value: boolean): void {
		if (value) {
			this.dom.setAttribute(attr, 'true');
		} else {
			this.dom.removeAttribute(attr);
		}
	}

	private updateNodeView(node: PMNode) {
		if (this.node.type !== node.type) {
			return false;
		}

		const attrs = getCellDomAttrs(this.node);
		const nextAttrs = getCellDomAttrs(node);

		const { colspan, rowspan } = getCellAttrs(this.dom);

		// need to rerender when colspan/rowspan in dom are different from the node attrs
		// this can happen when undoing merge cells
		if (
			colspan !== (node.attrs.colspan || DEFAULT_COL_SPAN) ||
			rowspan !== (node.attrs.rowspan || DEFAULT_ROW_SPAN)
		) {
			return false;
		}

		// added + changed attributes
		const addedAttrs = Object.entries(nextAttrs).filter(
			([key, value]) => attrs[key as keyof CellDomAttrs] !== value,
		);

		const removedAttrs = Object.keys(attrs).filter((key) => !nextAttrs.hasOwnProperty(key));

		if (addedAttrs.length || removedAttrs.length) {
			addedAttrs.forEach(([key, value]) => this.dom.setAttribute(key, value || ''));
			removedAttrs.forEach((key) => this.dom.removeAttribute(key));

			if (expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)) {
				this.updateTableEdgeAttrs(node);
			}

			return true;
		}

		// Return true to not re-render this node view
		if (this.node.sameMarkup(node)) {
			return true;
		}

		return false;
	}
}
