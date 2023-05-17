/** @jsx jsx */
import { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { Skeleton } from '@atlaskit/linking-common';
import {
  DatasourceResponseSchemaProperty,
  DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { autoScroller } from '@atlaskit/pragmatic-drag-and-drop-autoscroll';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { ColumnPicker } from './column-picker';
import { DraggableTableHeading } from './draggable-table-heading';
import TableEmptyState from './empty-state';
import { fallbackRenderType } from './render-type';
import { TableHeading } from './styled';
import { IssueLikeDataTableViewProps } from './types';
import { useIsOnScreen } from './useIsOnScreen';

const tableHeadStyles = css({
  background: token('elevation.surface', '#FFF'),
  borderTop: '2px solid transparent',
});

const columnPickerHeaderStyles = css({
  width: '40px', // TODO use some variable for that?
  paddingBlock: token('space.100', '8px'),
});

const tableDragPreviewStyles = css({
  backgroundColor: token('elevation.surface', '#FFF'),
});

const containerDragPreviewStyles = css({
  overflow: 'hidden',
});

export interface RowType {
  cells: Array<RowCellType>;
  key?: string;
  ref?: Ref<HTMLTableRowElement>;
}

export interface RowCellType {
  key: string;
  content?: React.ReactNode | string;
}

function extractIndex(data: Record<string, unknown>) {
  const { index } = data;
  invariant(typeof index === 'number');
  return index;
}

const orderColumns = (
  columns: DatasourceResponseSchemaProperty[],
  visibleColumnKeys: string[],
) => {
  // newColumnKeyOrder contains keys of selected (visible columns only).
  // In order to sort all the columns we need to insert unselected ones into this list
  // We put them into their absolution position as it was in unchanged (before column move) order.
  columns.forEach(({ key }, index) => {
    if (!visibleColumnKeys.includes(key)) {
      visibleColumnKeys.splice(index, 0, key);
    }
  });

  columns.sort((a, b) => {
    const indexB = visibleColumnKeys.indexOf(b.key);
    const indexA = visibleColumnKeys.indexOf(a.key);
    return indexA - indexB;
  });

  return [...columns];
};

export const IssueLikeDataTableView = ({
  testId,
  onNextPage,
  items,
  columns,
  renderItem = fallbackRenderType,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
  status,
  hasNextPage,
}: IssueLikeDataTableViewProps) => {
  const tableId = useMemo(() => Symbol('unique-id'), []);

  const [lastRowElement, setLastRowElement] =
    useState<HTMLTableRowElement | null>(null);
  const [isDragPreview, setIsDragPreview] = useState(false);
  const isBottomOfTableVisibleRaw = useIsOnScreen(lastRowElement);

  const containerRef = useRef<HTMLDivElement>(null);

  const [orderedColumns, setOrderedColumns] = useState(() =>
    orderColumns([...columns], [...visibleColumnKeys]),
  );

  const visibleSortedColumns = useMemo(
    () =>
      visibleColumnKeys
        .map(visibleKey => orderedColumns.find(({ key }) => visibleKey === key))
        .filter(Boolean) as DatasourceResponseSchemaProperty[],
    [orderedColumns, visibleColumnKeys],
  );

  // TODO seems like this component can't handle some combination of incremental data retreaval.
  // If data comes first, then columns and then visibleColumnKeys it blows up,
  // or some other combination.

  const identityColumnKey = orderedColumns.find(
    column => column.isIdentity,
  )?.key;

  const loadingRow: RowType = useMemo(
    () => ({
      key: 'loading',
      cells: visibleSortedColumns.map<RowCellType>(({ key }) => {
        const content = (
          <Skeleton
            borderRadius={token('border.radius.100', '3px')}
            width={'100%'}
            height={'20px'}
          />
        );
        return {
          key,
          content,
        };
      }),
    }),
    [visibleSortedColumns],
  );

  const headColumns: Array<RowCellType> = visibleSortedColumns.map(column => ({
    key: column.key,
    content: column.title,
    // width: TODO Find out how we going to retrieve column width
    shouldTruncate: true,
  }));

  useEffect(() => {
    if (
      status === 'empty' ||
      (isBottomOfTableVisibleRaw && hasNextPage && status !== 'loading')
    ) {
      void onNextPage();
    }
  }, [isBottomOfTableVisibleRaw, status, hasNextPage, onNextPage]);

  let dndPreviewHeight = 0;
  if (items.length > 0 && containerRef.current) {
    const containerEl = containerRef.current;
    invariant(containerEl);
    dndPreviewHeight = containerEl.offsetHeight;
  }

  // This variable contains initial Y mouse coordinate, so we can restrict
  // autoScroller in X axis only
  const initialAutoScrollerClientY = useRef<number | null>();
  useEffect(() => {
    if (!onVisibleColumnKeysChange) {
      return;
    }
    return combine(
      monitorForElements({
        onDragStart: ({ location }) => {
          initialAutoScrollerClientY.current = location.current.input.clientY;
          autoScroller.start({
            input: location.current.input,
            behavior: 'container-only',
          });
        },
        onDrag: ({ location }) => {
          autoScroller.updateInput({
            input: {
              ...location.current.input,
              clientY: initialAutoScrollerClientY.current || 0,
            },
          });
        },
        onDrop({ source, location }) {
          initialAutoScrollerClientY.current = null;
          autoScroller.stop();
          if (location.current.dropTargets.length === 0) {
            return;
          }

          const target = location.current.dropTargets[0];
          if (source.data.id === target.data.id) {
            return;
          }

          if (
            source.data.type === 'table-header' &&
            source.data.tableId === tableId
          ) {
            const closestEdgeOfTarget = extractClosestEdge(target.data);
            invariant(
              closestEdgeOfTarget === 'left' || closestEdgeOfTarget === 'right',
            );

            const startIndex = extractIndex(source.data);
            const indexOfTarget = extractIndex(target.data);

            const newColumnKeyOrder = reorderWithEdge({
              list: visibleColumnKeys,
              closestEdgeOfTarget,
              startIndex,
              indexOfTarget,
              axis: 'horizontal',
            });

            onVisibleColumnKeysChange?.([...newColumnKeyOrder]);

            // We sort columns (whole objects) according to their key order presented in newColumnKeyOrder
            setOrderedColumns(columns => {
              return orderColumns([...columns], [...newColumnKeyOrder]);
            });
          }
        },
      }),
    );
  }, [visibleColumnKeys, onVisibleColumnKeysChange, tableId]);

  const tableRows: Array<RowType> = useMemo(
    () =>
      items.map<RowType>((newRowData, rowIndex) => ({
        key: `${
          (identityColumnKey && newRowData[identityColumnKey]) || rowIndex
        }`,
        cells: visibleSortedColumns.map<RowCellType>(({ key, type }) => {
          const value = newRowData[key];
          const values = Array.isArray(value) ? value : [value];
          const content = values.map(value =>
            renderItem({ type, value } as DatasourceType),
          );

          return {
            key,
            content,
          };
        }),
        ref:
          rowIndex === items.length - 1
            ? el => setLastRowElement(el)
            : undefined,
      })),
    [identityColumnKey, renderItem, items, visibleSortedColumns],
  );

  const rows = [...tableRows, ...(status === 'loading' ? [loadingRow] : [])];

  const setIsDragPreviewOn = useCallback(
    () => setIsDragPreview(true),
    [setIsDragPreview],
  );
  const setIsDragPreviewOff = useCallback(
    () => setIsDragPreview(false),
    [setIsDragPreview],
  );

  const onSelectedColumnKeysChange = useCallback(
    (newSelectedColumnKeys: string[]) => {
      onVisibleColumnKeysChange?.(newSelectedColumnKeys);
    },
    [onVisibleColumnKeysChange],
  );

  return (
    <div
      ref={containerRef}
      css={isDragPreview ? containerDragPreviewStyles : null}
    >
      <table
        css={isDragPreview ? tableDragPreviewStyles : null}
        data-testid={testId}
      >
        <thead data-testid={testId && `${testId}--head`} css={tableHeadStyles}>
          <tr>
            {headColumns.map(({ key, content }, cellIndex) => {
              if (onVisibleColumnKeysChange) {
                return (
                  <DraggableTableHeading
                    tableId={tableId}
                    key={key}
                    id={key}
                    index={cellIndex}
                    dndPreviewHeight={dndPreviewHeight}
                    onDragPreviewStart={setIsDragPreviewOn}
                    onDragPreviewEnd={setIsDragPreviewOff}
                  >
                    {content}
                  </DraggableTableHeading>
                );
              } else {
                return (
                  <TableHeading key={key} data-testid={`${key}-column-heading`}>
                    {content}
                  </TableHeading>
                );
              }
            })}
            {onVisibleColumnKeysChange && (
              <th css={columnPickerHeaderStyles}>
                <ColumnPicker
                  columns={orderedColumns}
                  selectedColumnKeys={visibleColumnKeys}
                  onSelectedColumnKeysChange={onSelectedColumnKeysChange}
                />
              </th>
            )}
          </tr>
        </thead>
        <tbody data-testid={testId && `${testId}--body`}>
          {rows.map(({ key, cells, ref }) => (
            <tr
              key={key}
              data-testid={testId && `${testId}--row-${key}`}
              ref={ref}
            >
              {cells.map(({ key, content }, cellIndex) => (
                <td
                  key={key}
                  data-testid={testId && `${testId}--cell-${cellIndex}`}
                  colSpan={cellIndex + 1 === cells.length ? 2 : undefined}
                >
                  {content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const EmptyState = TableEmptyState;
