import type { CellDomAttrs } from '@atlaskit/adf-schema';
import { getCellAttrs, getCellDomAttrs } from '@atlaskit/adf-schema';
import {
	ACTION_SUBJECT,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
	TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

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

const cssVariablePattern = /^VAR\(--.*\)$/;

export default class TableCell extends TableNodeView<HTMLElement> implements NodeView {
	private delayHandle: number | undefined;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: () => number | undefined,
		eventDispatcher: EventDispatcher,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	) {
		super(node, view, getPos, eventDispatcher);

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
		if (
			cssVariablePattern.test(node.attrs.background) &&
			fg('platform_editor_dark_mode_cell_header_color_fix')
		) {
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

	destroy = () => {
		if (this.delayHandle && typeof window !== 'undefined') {
			// eslint-disable-next-line compat/compat
			window?.cancelIdleCallback?.(this.delayHandle);
			window?.cancelAnimationFrame?.(this.delayHandle);
		}
	};

	update(node: PMNode) {
		const didUpdate = this.updateNodeView(node);
		if (didUpdate) {
			this.node = node;
		}
		return didUpdate;
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
			return true;
		}

		// Return true to not re-render this node view
		if (this.node.sameMarkup(node)) {
			return true;
		}

		return false;
	}
}
