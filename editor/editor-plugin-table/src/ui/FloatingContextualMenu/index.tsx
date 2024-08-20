/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFloatingDialogZIndex,
	akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-shared-styles';
import {
	findCellRectClosestToPos,
	getSelectionRect,
	isSelectionType,
} from '@atlaskit/editor-tables/utils';

import { getPluginState } from '../../pm-plugins/plugin-factory';
import type { PluginConfig, PluginInjectionAPI } from '../../types';
import {
	contextualMenuDropdownWidth,
	contextualMenuDropdownWidthDnD,
	contextualMenuTriggerSize,
	tablePopupMenuFitHeight,
} from '../consts';

import ContextualMenu from './ContextualMenu';
import { tablePopupStyles } from './styles';

export interface Props {
	editorView: EditorView;
	isOpen: boolean;
	getEditorContainerWidth: GetEditorContainerWidth;
	api: PluginInjectionAPI | undefined | null;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	targetCellPosition?: number;
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	pluginConfig?: PluginConfig;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	isCellMenuOpenByKeyboard?: boolean;
	isCommentEditor?: boolean;
}

const FloatingContextualMenu = ({
	mountPoint,
	boundariesElement,
	scrollableElement,
	editorView,
	isOpen,
	pluginConfig,
	editorAnalyticsAPI,
	getEditorContainerWidth,
	getEditorFeatureFlags,
	isCellMenuOpenByKeyboard,
	isCommentEditor,
	api,
}: Props) => {
	// TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
	const { targetCellPosition, isDragAndDropEnabled } = getPluginState(editorView.state);
	if (!isOpen || !targetCellPosition || editorView.state.doc.nodeSize <= targetCellPosition) {
		return null;
	}

	const { selection } = editorView.state;
	const selectionRect = isSelectionType(selection, 'cell')
		? getSelectionRect(selection)!
		: findCellRectClosestToPos(selection.$from);

	if (!selectionRect) {
		return null;
	}
	const domAtPos = editorView.domAtPos.bind(editorView);
	const targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);
	if (!targetCellRef) {
		return null;
	}

	const parentSticky =
		targetCellRef.parentElement && targetCellRef.parentElement.className.indexOf('sticky') > -1;

	return (
		<Popup
			alignX="right"
			alignY="top"
			target={targetCellRef as HTMLElement}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitHeight={tablePopupMenuFitHeight}
			fitWidth={isDragAndDropEnabled ? contextualMenuDropdownWidthDnD : contextualMenuDropdownWidth}
			// z-index value below is to ensure that this menu is above other floating menu
			// in table, but below floating dialogs like typeaheads, pickers, etc.
			zIndex={parentSticky ? akEditorFloatingDialogZIndex : akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			offset={[-7, 0]}
			stick={true}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={tablePopupStyles(isDragAndDropEnabled)}>
				<ContextualMenu
					editorView={editorView}
					offset={[contextualMenuTriggerSize / 2, -contextualMenuTriggerSize]}
					isOpen={isOpen}
					targetCellPosition={targetCellPosition}
					allowColumnSorting={pluginConfig && pluginConfig.allowColumnSorting}
					allowMergeCells={pluginConfig!.allowMergeCells}
					allowBackgroundColor={pluginConfig!.allowBackgroundColor}
					selectionRect={selectionRect}
					boundariesElement={boundariesElement}
					editorAnalyticsAPI={editorAnalyticsAPI}
					getEditorContainerWidth={getEditorContainerWidth}
					getEditorFeatureFlags={getEditorFeatureFlags}
					isCellMenuOpenByKeyboard={isCellMenuOpenByKeyboard}
					isCommentEditor={isCommentEditor}
					api={api}
				/>
			</div>
		</Popup>
	);
};

FloatingContextualMenu.displayName = 'FloatingContextualMenu';

export default FloatingContextualMenu;
