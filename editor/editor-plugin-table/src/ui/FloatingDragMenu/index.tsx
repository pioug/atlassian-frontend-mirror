import React from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  akEditorFloatingDialogZIndex,
  akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { getPluginState } from '../../pm-plugins/plugin-factory';
import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import type { PluginConfig, TableDirection } from '../../types';
import { dragMenuDropdownWidth, tablePopupMenuFitHeight } from '../consts';

import DragMenu from './DragMenu';

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  tableRef?: HTMLTableElement;
  tableNode?: PmNode;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  direction?: TableDirection;
  index?: number;
  targetCellPosition?: number;
  getEditorContainerWidth: GetEditorContainerWidth;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
  stickyHeaders?: RowStickyState;
  pluginConfig?: PluginConfig;
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
}: Props) => {
  if (
    !isOpen ||
    !targetCellPosition ||
    editorView.state.doc.nodeSize <= targetCellPosition
  ) {
    return null;
  }
  const inStickyMode = stickyHeaders?.sticky;

  const targetHandleRef =
    direction === 'row'
      ? document.querySelector('#drag-handle-button-row')
      : document.querySelector('#drag-handle-button-column');

  const offset = direction === 'row' ? [-9, 0] : [0, -7];

  if (
    !targetHandleRef ||
    !(editorView.state.selection instanceof CellSelection)
  ) {
    return null;
  }

  const { isTableScalingEnabled = false } = getPluginState(editorView.state);

  return (
    <Popup
      alignX={direction === 'row' ? 'right' : undefined}
      alignY={direction === 'row' ? 'start' : undefined}
      target={targetHandleRef as HTMLElement}
      mountTo={mountPoint}
      boundariesElement={boundariesElement}
      scrollableElement={scrollableElement}
      fitWidth={dragMenuDropdownWidth}
      fitHeight={tablePopupMenuFitHeight}
      // z-index value below is to ensure that this menu is above other floating menu
      // in table, but below floating dialogs like typeaheads, pickers, etc.
      // In sticky mode, we want to show the menu above the sticky header
      zIndex={
        inStickyMode
          ? akEditorFloatingDialogZIndex
          : akEditorFloatingOverlapPanelZIndex
      }
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
      />
    </Popup>
  );
};

FloatingDragMenu.displayName = 'FloatingDragMenu';

export default FloatingDragMenu;
