import React from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { AriaLiveElementAttributes } from '@atlaskit/editor-plugin-accessibility-utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFloatingDialogZIndex,
	akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import type { RowStickyState } from '../../pm-plugins/sticky-headers/types';
import type { PluginConfig, PluginInjectionAPI, TableDirection } from '../../types';
import { dragMenuDropdownWidth, tablePopupMenuFitHeight } from '../consts';

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
	targetCellPosition?: number;
}

const FloatingDragMenu = ({
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
}: Props): React.JSX.Element | null => {
	if (!isOpen || !targetCellPosition || editorView.state.doc.nodeSize <= targetCellPosition) {
		return null;
	}
	const inStickyMode = stickyHeaders?.sticky;

	const targetHandleRef =
		direction === 'row'
			? document.querySelector('#drag-handle-button-row')
			: document.querySelector('#drag-handle-button-column');

	const offset = direction === 'row' ? [-9, 0] : [0, -7];

	if (!targetHandleRef || !(editorView.state.selection instanceof CellSelection)) {
		return null;
	}

	const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags?.() ?? {};

	const shouldUseIncreasedScalingPercent =
		isTableScalingEnabled && (tableWithFixedColumnWidthsOption || isCommentEditor);

	return (
		<Popup
			alignX={direction === 'row' ? 'right' : undefined}
			alignY={direction === 'row' ? 'start' : undefined}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			target={targetHandleRef as HTMLElement}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitWidth={dragMenuDropdownWidth}
			fitHeight={tablePopupMenuFitHeight}
			// z-index value below is to ensure that this menu is above other floating menu
			// in table, but below floating dialogs like typeaheads, pickers, etc.
			// In sticky mode, we want to show the menu above the sticky header
			zIndex={inStickyMode ? akEditorFloatingDialogZIndex : akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			offset={offset}
			stick={true}
		>
			<DragMenu
				editorView={editorView}
				isOpen={isOpen}
				tableNode={tableNode}
				direction={direction}
				index={index}
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
		</Popup>
	);
};

FloatingDragMenu.displayName = 'FloatingDragMenu';

export default FloatingDragMenu;
