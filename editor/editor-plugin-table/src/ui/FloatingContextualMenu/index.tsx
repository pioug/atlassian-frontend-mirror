/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getPluginState } from '../../pm-plugins/plugin-factory';
import type { PluginConfig, PluginInjectionAPI, TableSharedStateInternal } from '../../types';
import {
	contextualMenuDropdownWidthDnD,
	contextualMenuTriggerSize,
	tablePopupMenuFitHeight,
} from '../consts';

import { CellMenuPopup } from './CellMenuPopup';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ContextualMenu from './ContextualMenu';
import { tablePopupStyles } from './styles';

interface Props {
	api: PluginInjectionAPI | undefined | null;
	boundariesElement?: HTMLElement;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView | undefined;
	getEditorContainerWidth: GetEditorContainerWidth;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isCellMenuOpenByKeyboard?: boolean;
	isCommentEditor?: boolean;
	isDragMenuOpen?: boolean;
	isOpen: boolean;
	mountPoint?: HTMLElement;
	pluginConfig?: PluginConfig;
	scrollableElement?: HTMLElement;
}

const FloatingContextualMenu: {
	({
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
		isDragMenuOpen,
	}: Props): JSX.Element | null;
	displayName: string;
} = ({
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
	isDragMenuOpen,
}: Props): JSX.Element | null => {
	const { activeTableMenu } = useSharedPluginStateWithSelector(api, ['table'], (states) => ({
		activeTableMenu: (states.tableState as TableSharedStateInternal | undefined)?.activeTableMenu,
	}));
	const isCellMenuOpen = expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)
		? activeTableMenu?.type === 'cell'
		: isOpen;

	if (!editorView) {
		return null;
	}

	// TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
	const { targetCellPosition } = getPluginState(editorView.state);
	if (
		!isCellMenuOpen ||
		!targetCellPosition ||
		editorView.state.doc.nodeSize <= targetCellPosition
	) {
		return null;
	}

	const { selection } = editorView.state;
	const selectionRect = isSelectionType(selection, 'cell')
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			getSelectionRect(selection)!
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

	if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
		if (!(targetCellRef instanceof HTMLElement)) {
			return null;
		}

		return (
			<CellMenuPopup
				api={api}
				boundariesElement={boundariesElement}
				editorView={editorView}
				mountPoint={mountPoint}
				scrollableElement={scrollableElement}
				target={targetCellRef}
				zIndex={parentSticky ? akEditorFloatingDialogZIndex : akEditorFloatingOverlapPanelZIndex}
			/>
		);
	}

	return (
		<Popup
			alignX="right"
			alignY="top"
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			target={targetCellRef as HTMLElement}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitHeight={tablePopupMenuFitHeight}
			fitWidth={contextualMenuDropdownWidthDnD}
			// z-index value below is to ensure that this menu is above other floating menu
			// in table, but below floating dialogs like typeaheads, pickers, etc.
			zIndex={parentSticky ? akEditorFloatingDialogZIndex : akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			offset={[-7, 0]}
			stick={true}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={tablePopupStyles()}>
				<ContextualMenu
					editorView={editorView}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					offset={[contextualMenuTriggerSize / 2, -contextualMenuTriggerSize]}
					isOpen={isOpen}
					targetCellPosition={targetCellPosition}
					allowColumnSorting={pluginConfig && pluginConfig.allowColumnSorting}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					allowMergeCells={pluginConfig!.allowMergeCells}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					allowBackgroundColor={pluginConfig!.allowBackgroundColor}
					selectionRect={selectionRect}
					mountPoint={mountPoint}
					boundariesElement={boundariesElement}
					editorAnalyticsAPI={editorAnalyticsAPI}
					getEditorContainerWidth={getEditorContainerWidth}
					getEditorFeatureFlags={getEditorFeatureFlags}
					isCellMenuOpenByKeyboard={isCellMenuOpenByKeyboard}
					isCommentEditor={isCommentEditor}
					api={api}
					isDragMenuOpen={isDragMenuOpen}
				/>
			</div>
		</Popup>
	);
};

FloatingContextualMenu.displayName = 'FloatingContextualMenu';

export default FloatingContextualMenu;
