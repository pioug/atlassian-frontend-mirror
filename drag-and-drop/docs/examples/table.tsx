/** @jsx jsx */
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import invariant from 'tiny-invariant';

import Avatar from '@atlaskit/avatar';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { reorderWithEdge } from '@atlaskit/drag-and-drop-hitbox/util/reorder-with-edge';
import { DropIndicator } from '@atlaskit/drag-and-drop-indicator/box';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { TableRowData, tableRows } from './data/table';
import { GlobalStyles } from './util/global-styles';

/**
 * We're doing this to make the drop indicator a bit more visible
 */
const tableStyles = css({
  /* eslint-disable-next-line @repo/internal/styles/no-nested-styles */
  'th:first-child, td:first-child': {
    paddingLeft: 8,
  },
});

type DraggableStatus = 'idle' | 'preview' | 'dragging';

const tableRowStatusStyles: Partial<Record<
  DraggableStatus,
  SerializedStyles
>> = {
  idle: css({
    ':hover': {
      background: token('color.background.neutral.subtle.hovered', '#091E420F'),
    },
  }),
  preview: css({
    background: token('elevation.surface.overlay', '#FFF'),
    boxShadow: token('elevation.shadow.overlay', 'none'),
  }),
  dragging: css({
    background: token('color.background.neutral.subtle.hovered', '#091E420F'),
    opacity: 0.5,
  }),
};

/**
 * Because we cannot render arbitrary elements inside of a `<tr />` element,
 * we cannot use the `<DropIndicator />` component for row drags.
 *
 * Instead we use bespoke styles.
 */
const tableRowDropIndicatorStyles: Partial<Record<Edge, SerializedStyles>> = {
  top: css({
    position: 'relative',
    '::after': {
      content: "''",
      position: 'absolute',
      top: -1,
      left: 0,
      height: 2,
      width: '100%',
      background: token('color.border.brand', '#0052CC'),
    },
  }),
  bottom: css({
    position: 'relative',
    '::after': {
      content: "''",
      position: 'absolute',
      bottom: -1,
      left: 0,
      height: 2,
      width: '100%',
      background: token('color.border.brand', '#0052CC'),
    },
  }),
};

const DraggableTableRow = ({
  children,
  id,
}: {
  children: ReactNode;
  id: unknown;
}) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [status, setStatus] = useState<DraggableStatus>('idle');

  useEffect(() => {
    const row = ref.current;
    invariant(row);
    return combine(
      draggable({
        element: row,
        getInitialData() {
          return { type: 'table-row', id };
        },
        onGenerateDragPreview() {
          setStatus('preview');
        },
        onDragStart() {
          setStatus('dragging');
        },
        onDrop() {
          setStatus('idle');
        },
      }),
      dropTargetForElements({
        element: row,
        getData({ input, element }) {
          const data = { id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        canDrop(args) {
          return args.source.data.type === 'table-row';
        },
        onDrag(args) {
          if (args.source.data.id !== id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [id]);

  return (
    <tr
      ref={ref}
      css={[
        tableRowStatusStyles[status],
        closestEdge && tableRowDropIndicatorStyles[closestEdge],
      ]}
    >
      {children}
    </tr>
  );
};

const tableHeaderStyles = css({
  position: 'relative',
  paddingBlock: 8,
  lineHeight: 24 / 14,
  background: token('color.background.neutral', '#091e420f'),
});

const tableHeaderStatusStyles: Partial<Record<
  DraggableStatus,
  SerializedStyles
>> = {
  idle: css({
    ':hover': {
      background: token('color.background.neutral.hovered', '#091E4224'),
    },
  }),
  preview: css({
    background: token('elevation.surface.overlay', '#FFF'),
    boxShadow: token('elevation.shadow.overlay', 'none'),
  }),
  dragging: css({
    background: token('color.background.neutral.hovered', '#091E4224'),
    color: token('color.text.disabled', '#091E424F'),
  }),
};

const DraggableTableHeader = ({
  children,
  id,
}: {
  children: ReactNode;
  id: unknown;
}) => {
  const ref = useRef<HTMLTableCellElement>(null);

  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [status, setStatus] = useState<DraggableStatus>('idle');

  useEffect(() => {
    const cell = ref.current;
    invariant(cell);
    return combine(
      draggable({
        element: cell,
        getInitialData() {
          return { type: 'table-header', id };
        },
        onGenerateDragPreview() {
          setStatus('preview');
        },
        onDragStart() {
          setStatus('dragging');
        },
        onDrop() {
          setStatus('idle');
        },
      }),
      dropTargetForElements({
        element: cell,
        getData({ input, element }) {
          const data = { id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        },
        canDrop(args) {
          return args.source.data.type === 'table-header';
        },
        onDrag(args) {
          if (args.source.data.id !== id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [id]);

  return (
    <th ref={ref} css={[tableHeaderStyles, tableHeaderStatusStyles[status]]}>
      {children}
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </th>
  );
};

function renderCell(row: TableRowData, column: { id: string; label: string }) {
  switch (column.id) {
    case 'icon':
      return <Avatar src={row.avatarUrl} size="large" appearance="square" />;

    case 'id':
    case 'name':
      return row[column.id];
  }
}

export default function Example() {
  const [columns, setColumns] = useState([
    { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
    { id: 'icon', label: 'Icon' },
  ]);
  const [rows, setRows] = useState(tableRows);

  const tableRef = useRef<HTMLTableElement>(null);
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
            const edge = extractClosestEdge(target.data);
            invariant(edge === 'top' || edge === 'bottom');

            setRows(rows => {
              const startIndex = rows.findIndex(
                row => row.id === source.data.id,
              );
              const finishIndex = rows.findIndex(
                row => row.id === target.data.id,
              );

              return reorderWithEdge({
                list: rows,
                edge,
                startIndex,
                finishIndex,
                axis: 'vertical',
              });
            });
          }

          if (source.data.type === 'table-header') {
            const edge = extractClosestEdge(target.data);
            invariant(edge === 'left' || edge === 'right');

            setColumns(columns => {
              const startIndex = columns.findIndex(
                col => col.id === source.data.id,
              );
              const finishIndex = columns.findIndex(
                col => col.id === target.data.id,
              );

              return reorderWithEdge({
                list: columns,
                edge,
                startIndex,
                finishIndex,
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
        <thead>
          <tr>
            {columns.map(column => (
              <DraggableTableHeader key={column.id} id={column.id}>
                {column.label}
              </DraggableTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <DraggableTableRow key={row.id} id={row.id}>
              {columns.map(column => (
                <td key={column.id}>{renderCell(row, column)}</td>
              ))}
            </DraggableTableRow>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
}
