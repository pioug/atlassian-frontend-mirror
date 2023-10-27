import React from 'react';

import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import type { TableDirection } from '../../types';
import { dragMenuDropdownWidth } from '../consts';

import { DragMenu } from './DragMenu';

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
}

const FloatingDragMenu = ({
  mountPoint,
  boundariesElement,
  scrollableElement,
  editorView,
  isOpen,
  tableRef,
  tableNode,
  direction,
  index,
  targetCellPosition,
  getEditorContainerWidth,
}: Props) => {
  if (
    !isOpen ||
    !targetCellPosition ||
    editorView.state.doc.nodeSize <= targetCellPosition
  ) {
    return null;
  }

  const domAtPos = editorView.domAtPos.bind(editorView);
  const targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);
  if (!targetCellRef) {
    return null;
  }
  const tableMap = tableNode ? TableMap.get(tableNode) : undefined;
  const offset =
    direction === 'row'
      ? [7, 0]
      : index === (tableMap?.width || 1) - 1
      ? [14, 0]
      : [-14, 0];
  // TODO: we will need to adjust the alignment and offset values depending on whether this is a row or column menu.
  return (
    <Popup
      alignX={direction === 'row' ? 'left' : 'center'}
      alignY="top"
      target={targetCellRef as HTMLElement}
      mountTo={mountPoint}
      boundariesElement={boundariesElement}
      scrollableElement={scrollableElement}
      fitWidth={dragMenuDropdownWidth}
      // z-index value below is to ensure that this menu is above other floating menu
      // in table, but below floating dialogs like typeaheads, pickers, etc.
      zIndex={akEditorFloatingOverlapPanelZIndex}
      forcePlacement={true}
      offset={offset}
      stick={true}
    >
      <DragMenu
        editorView={editorView}
        isOpen={isOpen}
        boundariesElement={boundariesElement}
        tableNode={tableNode}
        direction={direction}
        index={index}
        targetCellPosition={targetCellPosition}
        getEditorContainerWidth={getEditorContainerWidth}
      />
    </Popup>
  );
};

FloatingDragMenu.displayName = 'FloatingDragMenu';

export default FloatingDragMenu;
