import type { IntlShape } from 'react-intl-next';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Slice } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ExpandPlugin } from '../../types';
import ExpandNodeView from '../node-views';
import { transformSliceNestedExpandToExpand } from '../utils';

export const pluginKey = new PluginKey('expandPlugin');

export function containsClass(element: Element | null, className: string): boolean {
	return Boolean(element?.classList?.contains(className));
}

export const createPlugin = (
	dispatch: Dispatch,
	getIntl: () => IntlShape,
	appearance: EditorAppearance = 'full-page',
	useLongPressSelection: boolean = false,
	api: ExtractInjectionAPI<ExpandPlugin> | undefined,
	allowInteractiveExpand: boolean = true,
	__livePage: boolean = false,
) => {
	const isMobile = false;

	return new SafePlugin({
		key: pluginKey,
		props: {
			nodeViews: {
				expand: ExpandNodeView({
					getIntl,
					isMobile,
					api,
					allowInteractiveExpand,
					__livePage,
				}),
				nestedExpand: ExpandNodeView({
					getIntl,
					isMobile,
					api,
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
					return handleDraggingOfNestedExpand(view, event, slice);
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
	});
};

/**
 * As the nestedExpand node is not supported outside of the expand node, it must be converted to an expand node when dragged outside of the expand node.
 */
export function handleDraggingOfNestedExpand(
	view: EditorView,
	event: DragEvent,
	slice: Slice,
): boolean {
	const { state, dispatch } = view;
	const tr = state.tr;
	const { selection } = state;
	const { from, to } = selection;
	const supportedDropLocations = [
		state.schema.nodes.doc,
		state.schema.nodes.layoutSection,
		state.schema.nodes.layoutColumn,
	];

	// Check if the contents of the dragged slice contain a nested expand node.
	if (slice.content.firstChild?.type !== state.schema.nodes.nestedExpand) {
		return false;
	}

	const dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY });

	if (!dropPos) {
		return false;
	}

	const resolvedPos = state.doc.resolve(dropPos.pos);

	// If not dropping into the root of the document, check if the parent node type of the drop location is supported.
	if (resolvedPos.depth > 1) {
		const parentNodeType = resolvedPos.node(resolvedPos.depth - 1).type;
		// If you're not dropping into a doc or layoutSection, don't transform the nested expand, return false and allow default behaviour.
		if (!supportedDropLocations.includes(parentNodeType)) {
			return false;
		}
	}

	const updatedSlice = transformSliceNestedExpandToExpand(slice, state.schema);

	if (updatedSlice.eq(slice)) {
		return false;
	}

	// The drop position will be affected when the original slice is deleted from the document.
	const updatedDropPos = dropPos.pos > from ? dropPos.pos - updatedSlice.content.size : dropPos.pos;

	tr.delete(from, to);
	tr.insert(updatedDropPos, updatedSlice.content);

	dispatch(tr);
	return true;
}
