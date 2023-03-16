/** @jsx jsx */
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import Avatar from '@atlaskit/avatar';
import { extractClosestEdge } from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { reorderWithEdge } from '@atlaskit/drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
  Column,
  columnLabel,
  getInitialColumnOrder,
  getInitialRowOrder,
  President,
  presidents,
} from './data/presidents';
import { DraggableTableHeading } from './pieces/table/draggable-table-heading';
import { DraggableTableRow } from './pieces/table/draggable-table-row';
import { useTableHeightAsCssVar } from './pieces/table/use-table-height-as-css-var';
import { GlobalStyles } from './util/global-styles';

/**
 * We're doing this to make the drop indicator a bit more visible
 */
const tableStyles = css({
  tableLayout: 'fixed',
  /* eslint-disable-next-line @repo/internal/styles/no-nested-styles */
  'th:first-child, td:first-child': {
    paddingLeft: 8,
  },
});

const tableHeadStyles = css({
  background: token('elevation.surface', '#FFF'),
  borderTop: '2px solid transparent',
});

const textOverflowStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

function CellData({
  row,
  column,
}: {
  row: President;
  column: keyof President;
}) {
  if (column === 'name') {
    return (
      <Inline alignBlock="center" space="100">
        <Avatar />
        <span css={textOverflowStyles}>{row[column]}</span>
      </Inline>
    );
  }

  return <Fragment>{row[column]}</Fragment>;
}

function extractIndex(data: Record<string, unknown>) {
  const { index } = data;
  invariant(typeof index === 'number');
  return index;
}

type ColumnWidths = Record<Column, number>;

export default function Example() {
  const [rowOrder, setRowOrder] = useState(getInitialRowOrder);
  const [columnOrder, setColumnOrder] = useState(getInitialColumnOrder);
  const tableRef = useRef<HTMLTableElement>(null);

  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({
    name: 1 / 3,
    party: 1 / 3,
    term: 1 / 3,
  });

  /**
   * Called after the user 'drops' (stops resizing) to save the new width
   * values in state.
   *
   * Resizing a column will affect the width of the column to its left.
   */
  const onResize = useCallback(
    ({ columnIndex, width }: { columnIndex: number; width: number }) => {
      invariant(columnIndex > 0);

      const column = columnOrder[columnIndex];
      const prevColumn = columnOrder[columnIndex - 1];

      const deltaWidth = width - columnWidths[column];

      setColumnWidths({
        ...columnWidths,
        [prevColumn]: columnWidths[prevColumn] - deltaWidth,
        [column]: columnWidths[column] + deltaWidth,
      });
    },
    [columnOrder, columnWidths],
  );

  /**
   * Exposes the height of the table as a CSS variable on the table.
   *
   * This is used by the resize handles, as well as column drop indicators.
   */
  useTableHeightAsCssVar(tableRef);

  useEffect(() => {
    const table = tableRef.current;
    invariant(table);
    return combine(
      monitorForElements({
        onDrop({ source, location }) {
          if (location.current.dropTargets.length === 0) {
            return;
          }

          const target = location.current.dropTargets[0];
          if (source.data.id === target.data.id) {
            return;
          }

          if (source.data.type === 'table-row') {
            const closestEdgeOfTarget = extractClosestEdge(target.data);
            invariant(
              closestEdgeOfTarget === 'top' || closestEdgeOfTarget === 'bottom',
            );

            setRowOrder(rowOrder => {
              const startIndex = extractIndex(source.data);
              const indexOfTarget = extractIndex(target.data);

              return reorderWithEdge({
                list: rowOrder,
                closestEdgeOfTarget,
                startIndex,
                indexOfTarget,
                axis: 'vertical',
              });
            });
          }

          if (source.data.type === 'table-header') {
            const closestEdgeOfTarget = extractClosestEdge(target.data);
            invariant(
              closestEdgeOfTarget === 'left' || closestEdgeOfTarget === 'right',
            );

            setColumnOrder(columnOrder => {
              const startIndex = extractIndex(source.data);
              const indexOfTarget = extractIndex(target.data);

              return reorderWithEdge({
                list: columnOrder,
                closestEdgeOfTarget,
                startIndex,
                indexOfTarget,
                axis: 'horizontal',
              });
            });
          }
        },
      }),
    );
  }, []);

  return (
    <Fragment>
      <GlobalStyles />
      <table ref={tableRef} css={tableStyles}>
        <thead css={tableHeadStyles}>
          <tr>
            {columnOrder.map((column, index) => (
              <DraggableTableHeading
                key={column}
                id={column}
                index={index}
                width={columnWidths[column]}
                onResize={onResize}
              >
                {columnLabel[column]}
              </DraggableTableHeading>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowOrder.map((rowIndex, index) => {
            const president = presidents[rowIndex];
            return (
              <DraggableTableRow
                key={president.id}
                id={president.id}
                index={index}
              >
                {columnOrder.map(column => (
                  <td key={column} css={textOverflowStyles}>
                    <CellData column={column} row={president} />
                  </td>
                ))}
              </DraggableTableRow>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
}
