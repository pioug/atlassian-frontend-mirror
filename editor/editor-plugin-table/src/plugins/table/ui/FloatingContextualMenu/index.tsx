/** @jsx jsx */
import { jsx } from '@emotion/react';

import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import {
  findCellRectClosestToPos,
  getSelectionRect,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';

import { Popup } from '@atlaskit/editor-common/ui';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';

import { getPluginState } from '../../pm-plugins/plugin-factory';
import { pluginKey } from '../../pm-plugins/plugin-key';
import { PluginConfig } from '../../types';
import {
  contextualMenuDropdownWidth,
  contextualMenuTriggerSize,
} from '../consts';
import { tablePopupStyles } from './styles';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import ContextualMenu from './ContextualMenu';

// offset of the contextual menu dropdown
const calculateOffset = (targetCellRef: HTMLElement, state: EditorState) => {
  const { tableRef } = pluginKey.getState(state);
  let top = -contextualMenuTriggerSize;

  if (tableRef && targetCellRef) {
    const targetOffset = targetCellRef.getBoundingClientRect();
    const tableOffset = tableRef.getBoundingClientRect();
    let topDiff = targetOffset.top - tableOffset.top;
    if (topDiff < 200) {
      top -= topDiff + 2;
    }
  }
  return [contextualMenuTriggerSize / 2, top];
};

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  getEditorContainerWidth: GetEditorContainerWidth;
  targetCellPosition?: number;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  pluginConfig?: PluginConfig;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
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
}: Props) => {
  // TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
  const { targetCellPosition } = getPluginState(editorView.state);
  if (
    !isOpen ||
    !targetCellPosition ||
    editorView.state.doc.nodeSize <= targetCellPosition
  ) {
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

  return (
    <Popup
      alignX="right"
      alignY="top"
      target={targetCellRef as HTMLElement}
      mountTo={mountPoint}
      boundariesElement={boundariesElement}
      scrollableElement={scrollableElement}
      fitHeight={188}
      fitWidth={contextualMenuDropdownWidth}
      // z-index value below is to ensure that this menu is above other floating menu
      // in table, but below floating dialogs like typeaheads, pickers, etc.
      zIndex={akEditorFloatingOverlapPanelZIndex}
      forcePlacement={true}
      offset={[-7, 0]}
    >
      <div css={tablePopupStyles}>
        <ContextualMenu
          editorView={editorView}
          offset={calculateOffset(
            targetCellRef as HTMLElement,
            editorView.state,
          )}
          isOpen={isOpen}
          targetCellPosition={targetCellPosition}
          allowColumnSorting={pluginConfig && pluginConfig.allowColumnSorting}
          allowMergeCells={pluginConfig!.allowMergeCells}
          allowBackgroundColor={pluginConfig!.allowBackgroundColor}
          selectionRect={selectionRect}
          boundariesElement={boundariesElement}
          editorAnalyticsAPI={editorAnalyticsAPI}
          getEditorContainerWidth={getEditorContainerWidth}
        />
      </div>
    </Popup>
  );
};

FloatingContextualMenu.displayName = 'FloatingContextualMenu';

export default FloatingContextualMenu;
