import type { IntlShape } from 'react-intl-next';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import {
	findExpand,
	transformSliceExpandToNestedExpand,
	transformSliceNestedExpandToExpand,
} from '@atlaskit/editor-common/transforms';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Slice } from '@atlaskit/editor-prosemirror/model';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ExpandPlugin } from '../../types';
import { setExpandRef } from '../commands';
import ExpandNodeView from '../nodeviews';

import { createPluginState, getPluginState, pluginKey } from './plugin-factory';

export function containsClass(element: Element | null, className: string): boolean {
	return Boolean(element?.classList?.contains(className));
}

export const createPlugin = (
	dispatch: Dispatch,
	getIntl: () => IntlShape,
	appearance: EditorAppearance = 'full-page',
	useLongPressSelection: boolean = false,
	api: ExtractInjectionAPI<ExpandPlugin> | undefined,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	allowInteractiveExpand: boolean = true,
	__livePage: boolean = false,
) => {
	const state = createPluginState(dispatch, {});
	const isMobile = false;

	return new SafePlugin({
		state: state,
		key: pluginKey,
		props: {
			nodeViews: {
				expand: ExpandNodeView({
					getIntl,
					isMobile,
					api,
					nodeViewPortalProviderAPI,
					allowInteractiveExpand,
					__livePage,
				}),
				nestedExpand: ExpandNodeView({
					getIntl,
					isMobile,
					api,
					nodeViewPortalProviderAPI,
					allowInteractiveExpand,
					__livePage,
				}),
			},
			handleKeyDown(_view, event) {
				return containsClass(event.target as Element, expandClassNames.titleContainer);
			},
			handleKeyPress(_view, event) {
				return containsClass(event.target as Element, expandClassNames.titleContainer);
			},
			handleScrollToSelection() {
				return containsClass(document.activeElement, expandClassNames.titleInput);
			},
			handleClickOn: createSelectionClickHandler(
				['expand', 'nestedExpand'],
				(target) => target.classList.contains(expandClassNames.prefix),
				{ useLongPressSelection },
			),
			handleDrop(view, event, slice, moved) {
				if (fg('platform_editor_nest_nested_expand_drag_fix')) {
					return handleExpandDrag(view, event, slice);
				}
				return false;
			},
		},
		// @see ED-8027 to follow up on this work-around
		filterTransaction(tr) {
			if (
				containsClass(document.activeElement, expandClassNames.titleInput) &&
				tr.selectionSet &&
				(!tr.steps.length || tr.isGeneric)
			) {
				return false;
			}
			return true;
		},

		view: (editorView: EditorView) => {
			const domAtPos = editorView.domAtPos.bind(editorView);

			return {
				update: (view: EditorView) => {
					const { state, dispatch } = view;
					const node = findExpand(state);
					if (node) {
						const expandRef = findDomRefAtPos(node.pos, domAtPos) as HTMLDivElement;
						if (getPluginState(state).expandRef !== expandRef) {
							setExpandRef(expandRef)(state, dispatch);
						}
					}
				},
			};
		},
	});
};

/**
 * Convert a nested expand to an expand when dropped outside an expand or table. Convert an expand to a nested expand when dropped inside an expand or table.
 */
export function handleExpandDrag(view: EditorView, event: DragEvent, slice: Slice): boolean {
	const { state, dispatch } = view;
	const tr = state.tr;
	const { selection } = state;
	const { from, to } = selection;
	let sliceContainsExpand = false;
	let sliceContainsNestedExpand = false;

	slice.content.forEach((node) => {
		if (node.type === state.schema.nodes.expand) {
			sliceContainsExpand = true;
		} else if (node.type === state.schema.nodes.nestedExpand) {
			sliceContainsNestedExpand = true;
		}
	});

	// Check if the contents of the dragged slice contain a nested expand node or expand node.
	// Also not handling expands with nested expands for now.
	if (
		(!sliceContainsExpand && !sliceContainsNestedExpand) ||
		(sliceContainsExpand && sliceContainsNestedExpand)
	) {
		return false;
	}

	let dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY });

	if (!dropPos) {
		return false;
	}

	const resolvedPos = state.doc.resolve(dropPos.pos);
	const dropLocationNodeType = resolvedPos.node().type;
	const dropLocationParentNodeType =
		resolvedPos.depth > 0 ? resolvedPos.node(resolvedPos.depth - 1).type : dropLocationNodeType;

	const nodesWithNestedExpandSupport = [
		state.schema.nodes.expand,
		state.schema.nodes.tableHeader,
		state.schema.nodes.tableCell,
	];

	const isNodeAtDropPosInsideNodesWithNestedExpandSupport =
		nodesWithNestedExpandSupport.includes(dropLocationNodeType) ||
		nodesWithNestedExpandSupport.includes(dropLocationParentNodeType);
	const isNodeBeingDroppedInsideNestedExpand =
		dropLocationNodeType === state.schema.nodes.nestedExpand ||
		dropLocationParentNodeType === state.schema.nodes.nestedExpand;

	if (editorExperiment('nested-expand-in-expand', false)) {
		if (
			(sliceContainsExpand || sliceContainsNestedExpand) &&
			(dropLocationNodeType === state.schema.nodes.expand ||
				dropLocationParentNodeType === state.schema.nodes.expand)
		) {
			event.preventDefault();
			return true;
		}
	}

	let updatedSlice: Slice | null = slice;

	if (sliceContainsExpand && isNodeAtDropPosInsideNodesWithNestedExpandSupport) {
		updatedSlice = transformSliceExpandToNestedExpand(slice);
	} else if (
		sliceContainsNestedExpand &&
		!isNodeAtDropPosInsideNodesWithNestedExpandSupport &&
		!isNodeBeingDroppedInsideNestedExpand
	) {
		updatedSlice = transformSliceNestedExpandToExpand(slice, state.schema);
	}

	if (!updatedSlice || updatedSlice.eq(slice)) {
		return false;
	}

	// The drop position will be affected when the original slice is deleted from the document.
	let updatedDropPos = dropPos.pos > from ? dropPos.pos - updatedSlice.content.size : dropPos.pos;

	// Adjust the drop position to place the slice before the node at the position the cursor is pointing at, except when the drop location is the document node.
	// Otherwise causes weird behaviour with tables & quotes, splits them apart. Only do this for nested expand slice transformed to expand.
	if (dropLocationNodeType !== state.schema.nodes.doc && !sliceContainsExpand) {
		updatedDropPos = updatedDropPos - 1;
	}

	tr.delete(from, to);
	tr.insert(updatedDropPos, updatedSlice.content);

	dispatch(tr);
	return true;
}
