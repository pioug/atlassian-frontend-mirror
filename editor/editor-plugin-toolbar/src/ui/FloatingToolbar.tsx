import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ToolbarPlugin } from '../toolbarPluginType';
import { ElementToolbar } from './ElementToolbar';
import { SelectionToolbarWithErrorBoundary } from './SelectionToolbar';

/**
 * The selection toolbar owns non-empty text and all selections, and plain cell selections. A cell
 * selection made by clicking a drag handle has its own user intent, so the element toolbar stays.
 */
export const getActiveFloatingToolbar = (
	selection: Selection,
	userIntent?: string,
): 'selection' | 'element' => {
	if (selection.empty) {
		return 'element';
	}
	const isCellSelection = '$anchorCell' in selection;
	if (
		selection instanceof TextSelection ||
		selection instanceof AllSelection ||
		(isCellSelection && userIntent === 'default')
	) {
		return 'selection';
	}
	return 'element';
};

type FloatingToolbarProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	boundariesElement?: HTMLElement;
	disableSelectionToolbar?: boolean;
	disableSelectionToolbarWhenPinned: boolean;
	editorView: EditorView;
	mountPoint?: HTMLElement;
	onToolbarMouseUp?: (event: React.MouseEvent<HTMLDivElement>) => void;
	scrollableElement?: HTMLElement;
};

/**
 * Renders either the selection toolbar or the element toolbar, never both.
 */
export const FloatingToolbar = ({
	api,
	boundariesElement,
	disableSelectionToolbar,
	disableSelectionToolbarWhenPinned,
	editorView,
	mountPoint,
	onToolbarMouseUp,
	scrollableElement,
}: FloatingToolbarProps): React.JSX.Element | null => {
	const { activeToolbar } = useSharedPluginStateWithSelector(
		api,
		['selection', 'userIntent'],
		(states) => ({
			activeToolbar: getActiveFloatingToolbar(
				states.selectionState?.selection ?? editorView.state.selection,
				states.userIntentState?.currentUserIntent,
			),
		}),
	);

	if (activeToolbar === 'selection') {
		return disableSelectionToolbar ? null : (
			<SelectionToolbarWithErrorBoundary
				api={api}
				editorView={editorView}
				mountPoint={mountPoint}
				disableSelectionToolbarWhenPinned={disableSelectionToolbarWhenPinned}
				onToolbarMouseUp={onToolbarMouseUp}
			/>
		);
	}

	return (
		<ElementToolbar
			api={api}
			editorView={editorView}
			mountPoint={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
		/>
	);
};
