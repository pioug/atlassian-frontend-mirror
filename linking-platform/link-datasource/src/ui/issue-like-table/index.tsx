/** @jsx jsx */
import { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import invariant from 'tiny-invariant';

import { Skeleton } from '@atlaskit/linking-common';
import {
  DatasourceResponseSchemaProperty,
  DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { autoScroller } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { ColumnPicker } from './column-picker';
import { DraggableTableHeading } from './draggable-table-heading';
import TableEmptyState from './empty-state';
import { fallbackRenderType } from './render-type';
import { Table, TableHeading } from './styled';
import { IssueLikeDataTableViewProps } from './types';
import { useIsOnScreen } from './useIsOnScreen';

const tableHeadStyles = css({
  background: token('elevation.surface', '#FFF'),
  borderTop: '2px solid transparent',
});

const ColumnPickerHeader = styled.td`
  width: 40px;
  padding-block: ${token('space.100', '8px')};
  position: sticky;
  right: 0px;
  background-color: ${token('elevation.surface', '#FFF')};
  &:last-child {
    padding-right: ${token('space.100', '8px')};
  }
`;

const truncatedCellStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
  maxWidth?: number;
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

const BASE_WIDTH = 8;
function getColumnWidth(
  key: string,
  type: DatasourceType['type'],
): number | undefined {
  const keyBasedWidth: Record<string, number> = {
    assignee: BASE_WIDTH * 22,
    key: BASE_WIDTH * 10,
    labels: BASE_WIDTH * 22,
    priority: BASE_WIDTH * 8,
    status: BASE_WIDTH * 18,
    summary: BASE_WIDTH * 45,
    type: BASE_WIDTH * 8,
  };

  if (keyBasedWidth[key]) {
    return keyBasedWidth[key];
  }

  switch (type) {
    case 'date':
      return BASE_WIDTH * 14;

    case 'string':
      return BASE_WIDTH * 22;

    default:
      return undefined;
  }
}

export const IssueLikeDataTableView = ({
  testId,
  onNextPage,
  onLoadDatasourceDetails,
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
  const [hasFullSchema, setHasFullSchema] = useState(false);
  const isBottomOfTableVisibleRaw = useIsOnScreen(lastRowElement);

  const containerRef = useRef<HTMLDivElement>(null);

  const [orderedColumns, setOrderedColumns] = useState(() =>
    orderColumns([...columns], [...visibleColumnKeys]),
  );

  useEffect(() => {
    setOrderedColumns(orderColumns([...columns], [...visibleColumnKeys]));
  }, [columns, visibleColumnKeys]);

  const visibleSortedColumns = useMemo(
    () =>
      visibleColumnKeys
        .map(visibleKey => orderedColumns.find(({ key }) => visibleKey === key))
        .filter(Boolean) as DatasourceResponseSchemaProperty[],
    [orderedColumns, visibleColumnKeys],
  );

  // TODO seems like this component can't handle some combination of incremental data retrieval.
  // If data comes first, then columns and then visibleColumnKeys it blows up,
  // or some other combination.

  const identityColumnKey = 'id';

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

  const headColumns: Array<RowCellType> = visibleSortedColumns.map(
    ({ key, title, type }) => ({
      key,
      content: title,
      shouldTruncate: true,
      maxWidth: getColumnWidth(key, type),
    }),
  );

  useEffect(() => {
    if (isBottomOfTableVisibleRaw && hasNextPage && status === 'resolved') {
      void onNextPage({
        isSchemaFromData: false,
      });
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
          (identityColumnKey &&
            newRowData[identityColumnKey] &&
            newRowData[identityColumnKey].data) ||
          rowIndex
        }`,
        cells: visibleSortedColumns.map<RowCellType>(({ key, type }) => {
          const value = newRowData[key]?.data || newRowData[key];
          const values = Array.isArray(value) ? value : [value];
          const content = values.map(value =>
            renderItem({ type, value } as DatasourceType),
          );

          return {
            key,
            content: content.length === 1 ? content[0] : content,
            maxWidth: getColumnWidth(key, type),
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

  const handlePickerOpen = useCallback(async () => {
    if (hasFullSchema) {
      return;
    }

    try {
      await onLoadDatasourceDetails();
      setHasFullSchema(true);
    } catch (e) {
      setHasFullSchema(false);
    }
  }, [hasFullSchema, onLoadDatasourceDetails]);

  return (
    <div
      ref={containerRef}
      css={isDragPreview ? containerDragPreviewStyles : null}
    >
      <Table
        css={isDragPreview ? tableDragPreviewStyles : null}
        data-testid={testId}
      >
        <thead data-testid={testId && `${testId}--head`} css={tableHeadStyles}>
          <tr>
            {headColumns.map(({ key, content, maxWidth }, cellIndex) => {
              const TruncatedContent = () => (
                <div css={truncatedCellStyles}>{content}</div>
              );
              if (onVisibleColumnKeysChange && status !== 'loading') {
                return (
                  <DraggableTableHeading
                    tableId={tableId}
                    key={key}
                    id={key}
                    index={cellIndex}
                    maxWidth={maxWidth}
                    dndPreviewHeight={dndPreviewHeight}
                    onDragPreviewStart={setIsDragPreviewOn}
                    onDragPreviewEnd={setIsDragPreviewOff}
                  >
                    <TruncatedContent />
                  </DraggableTableHeading>
                );
              } else {
                return (
                  <TableHeading
                    key={key}
                    data-testid={`${key}-column-heading`}
                    style={{
                      maxWidth,
                    }}
                  >
                    <TruncatedContent />
                  </TableHeading>
                );
              }
            })}
            {onVisibleColumnKeysChange && (
              <ColumnPickerHeader>
                <ColumnPicker
                  columns={hasFullSchema ? orderedColumns : []}
                  selectedColumnKeys={hasFullSchema ? visibleColumnKeys : []}
                  isDatasourceLoading={status === 'loading'}
                  onSelectedColumnKeysChange={onSelectedColumnKeysChange}
                  onOpen={handlePickerOpen}
                />
              </ColumnPickerHeader>
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
              {cells.map(({ key: cellKey, content, maxWidth }, cellIndex) => (
                <td
                  key={cellKey}
                  data-testid={testId && `${testId}--cell-${cellIndex}`}
                  colSpan={cellIndex + 1 === cells.length ? 2 : undefined}
                  css={truncatedCellStyles}
                  style={{
                    maxWidth,
                  }}
                >
                  {content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const EmptyState = TableEmptyState;
