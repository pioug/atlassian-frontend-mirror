import React from 'react';

import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';

import type { CellHoverCoordinates } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowHeights } from '../../../utils';
import { DragHandle } from '../../DragHandle';

type DragControlsProps = {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  tableActive?: boolean;
  hoveredCell?: CellHoverCoordinates;
  hoverRows?: (rows: number[], danger?: boolean) => void;
  selectRow?: (row: number, expand: boolean) => void;
};

const DragControlsComponent = ({
  tableRef,
  hoveredCell,
  hoverRows,
  selectRow,
  tableActive,
  editorView,
}: DragControlsProps & WrappedComponentProps) => {
  const rowHeights = getRowHeights(tableRef);
  const heights = rowHeights
    .map((height, index) => `${height - 1}px`)
    .join(' ');
  const rowWidth = tableRef.offsetWidth;

  const onClick = (
    index: number,
    event: React.MouseEvent<Element, MouseEvent>,
  ) => {};

  const onMouseOver = () => {};
  const onMouseOut = () => {};

  const rowIndex = hoveredCell?.rowIndex;

  const getLocalId = () => {
    const tableNode = findTable(editorView.state.selection);
    return tableNode?.node?.attrs?.localId || '';
  };

  return (
    <div
      className={ClassName.ROW_CONTROLS_WITH_DRAG}
      style={{
        gridTemplateRows: heights,
      }}
    >
      {rowIndex !== undefined && Number.isFinite(rowIndex) && (
        <div
          style={{
            gridRow: `${(rowIndex as number) + 1} / span 1`,
            display: 'flex',
          }}
        >
          <DragHandle
            onClick={(event) => onClick(rowIndex as number, event)}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            tableLocalId={getLocalId()}
            indexes={[rowIndex]}
            previewWidth={rowWidth}
            previewHeight={rowHeights[rowIndex]}
          />
        </div>
      )}
    </div>
  );
};

export const DragControls = injectIntl(DragControlsComponent);
