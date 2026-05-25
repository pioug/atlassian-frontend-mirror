import React from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { UserIntentPopupWrapper } from '@atlaskit/editor-common/user-intent';
import type { AriaLiveElementAttributes } from '@atlaskit/editor-plugin-accessibility-utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFloatingDialogZIndex,
	akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { RowStickyState } from '../../pm-plugins/sticky-headers/types';
import type { PluginConfig, PluginInjectionAPI, TableDirection, TableSharedStateInternal } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import {
	dragMenuDropdownWidth,
	dragTableInsertColumnButtonSize,
	tablePopupMenuFitHeight,
} from '../consts';
import { COLUMN_MENU } from '../TableMenu/column/keys';
import { ROW_MENU } from '../TableMenu/row/keys';
import { TABLE_MENU_WIDTH } from '../TableMenu/shared/consts';
import { TableMenu } from '../TableMenu/shared/TableMenu';

import DragMenu from './DragMenu';

interface Props {
	api: PluginInjectionAPI | undefined | null;
	ariaNotifyPlugin?: (
		message: string,
		ariaLiveElementAttributes?: AriaLiveElementAttributes,
	) => void;
	boundariesElement?: HTMLElement;
	direction?: TableDirection;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
	getEditorContainerWidth: GetEditorContainerWidth;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	index?: number;
	isCommentEditor?: boolean;
	isOpen: boolean;
	isTableScalingEnabled?: boolean;
	mountPoint?: HTMLElement;
	pluginConfig?: PluginConfig;
	scrollableElement?: HTMLElement;
	stickyHeaders?: RowStickyState;
	tableNode?: PmNode;
	tableRef?: HTMLTableElement;
	tableWrapper?: HTMLElement;
	targetCellPosition?: number;
}

interface FloatingDragMenuFunction {
	(props: Props): React.JSX.Element | null;
	displayName: string;
}

const TABLE_MENU_OFFSET = dragTableInsertColumnButtonSize + 4;

const FloatingDragMenu: FloatingDragMenuFunction = ({
	mountPoint,
	boundariesElement,
	scrollableElement,
	editorView,
	isOpen,
	tableNode,
	direction,
	index,
	targetCellPosition,
	getEditorContainerWidth,
	editorAnalyticsAPI,
	stickyHeaders,
	pluginConfig,
	isTableScalingEnabled,
	getEditorFeatureFlags,
	ariaNotifyPlugin,
	api,
	isCommentEditor,
	tableWrapper,
}) => {
	const { activeTableMenu } = useSharedPluginStateWithSelector(api, ['table'], (states) => ({
		activeTableMenu: (states.tableState as TableSharedStateInternal | undefined)?.activeTableMenu,
	}));
	const isActiveTableMenuDragMenu =
		activeTableMenu?.type === 'row' || activeTableMenu?.type === 'column';
	const hasActiveTableMenuState = activeTableMenu !== undefined;
	const isDragMenuOpen =
		expValEquals('platform_editor_table_menu_updates', 'isEnabled', true) && hasActiveTableMenuState
			? isActiveTableMenuDragMenu
			: isOpen;
	const dragMenuDirection =
		expValEquals('platform_editor_table_menu_updates', 'isEnabled', true) && hasActiveTableMenuState
			? isActiveTableMenuDragMenu
				? activeTableMenu.type
				: undefined
			: direction;
	const dragMenuIndex =
		expValEquals('platform_editor_table_menu_updates', 'isEnabled', true) && hasActiveTableMenuState
			? isActiveTableMenuDragMenu
				? activeTableMenu.index
				: undefined
			: index;

	if (!isDragMenuOpen || !targetCellPosition || editorView.state.doc.nodeSize <= targetCellPosition) {
		return null;
	}
	const inStickyMode =
		stickyHeaders?.sticky ||
		(tableWrapper?.classList.contains(ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW) &&
			fg('platform_editor_table_sticky_header_patch_7'));

	const targetHandleRef =
		dragMenuDirection === 'row'
			? document.querySelector('#drag-handle-button-row')
			: document.querySelector('#drag-handle-button-column');

	if (!targetHandleRef || !(editorView.state.selection instanceof CellSelection)) {
		return null;
	}

	const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags?.() ?? {};

	const shouldUseIncreasedScalingPercent =
		isTableScalingEnabled && (tableWithFixedColumnWidthsOption || isCommentEditor);

	return (
		<Popup
			alignX={dragMenuDirection === 'row' ? 'right' : undefined}
			alignY={dragMenuDirection === 'row' ? 'start' : undefined}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			target={targetHandleRef as HTMLElement}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitWidth={
				expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)
					? TABLE_MENU_WIDTH
					: dragMenuDropdownWidth
			}
			fitHeight={tablePopupMenuFitHeight}
			// z-index value below is to ensure that this menu is above other floating menu
			// in table, but below floating dialogs like typeaheads, pickers, etc.
			// In sticky mode, we want to show the menu above the sticky header
			zIndex={inStickyMode ? akEditorFloatingDialogZIndex : akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			offset={
				expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)
					? [TABLE_MENU_OFFSET, 0]
					: direction === 'row'
						? [-9, 0]
						: [0, -7]
			}
			stick={true}
		>
			{expValEquals('platform_editor_table_menu_updates', 'isEnabled', true) ? (
				<UserIntentPopupWrapper api={api} userIntent="tableDragMenuPopupOpen">
					<TableMenu
						api={api}
						editorView={editorView}
						surface={dragMenuDirection === 'row' ? ROW_MENU : COLUMN_MENU}
					/>
				</UserIntentPopupWrapper>
			) : (
				<DragMenu
					editorView={editorView}
					isOpen={isDragMenuOpen}
					tableNode={tableNode}
					direction={dragMenuDirection}
					index={dragMenuIndex}
					target={targetHandleRef || undefined}
					targetCellPosition={targetCellPosition}
					getEditorContainerWidth={getEditorContainerWidth}
					editorAnalyticsAPI={editorAnalyticsAPI}
					pluginConfig={pluginConfig}
					fitWidth={dragMenuDropdownWidth}
					fitHeight={tablePopupMenuFitHeight}
					mountPoint={mountPoint}
					boundariesElement={boundariesElement}
					scrollableElement={scrollableElement}
					isTableScalingEnabled={isTableScalingEnabled}
					shouldUseIncreasedScalingPercent={shouldUseIncreasedScalingPercent}
					isTableFixedColumnWidthsOptionEnabled={tableWithFixedColumnWidthsOption}
					ariaNotifyPlugin={ariaNotifyPlugin}
					api={api}
					isCommentEditor={isCommentEditor || false}
				/>
			)}
		</Popup>
	);
};

FloatingDragMenu.displayName = 'FloatingDragMenu';

export default FloatingDragMenu;
