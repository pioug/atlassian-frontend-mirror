/** @jsx jsx */
import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { Skeleton } from '@atlaskit/linking-common';
import {
  DatasourceResponseSchemaProperty,
  DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { autoScroller } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
  startUfoExperience,
  succeedUfoExperience,
} from '../../analytics/ufoExperiences';
import { stickyTableHeadersIndex } from '../../common/zindex';

import { ColumnPicker } from './column-picker';
import { DragColumnPreview } from './drag-column-preview';
import { DraggableTableHeading } from './draggable-table-heading';
import TableEmptyState from './empty-state';
import { fallbackRenderType, stringifyType } from './render-type';
import {
  fieldTextFontSize,
  Table,
  TableHeading,
  withTablePluginBodyPrefix,
  withTablePluginHeaderPrefix,
} from './styled';
import {
  DatasourceTypeWithOnlyValues,
  IssueLikeDataTableViewProps,
} from './types';
import { useIsOnScreen } from './useIsOnScreen';
import { COLUMN_BASE_WIDTH, getWidthCss } from './utils';

const tableSidePadding = token('space.200', '16px');

const tableHeadStyles = css({
  background: token('utility.elevation.surface.current', '#FFF'),
  position: 'sticky',
  top: 0,
  zIndex: stickyTableHeadersIndex,
});

const truncateTextStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const ColumnPickerHeader = styled.th({
  [`${withTablePluginHeaderPrefix()}`]: {
    boxSizing: 'content-box',
    border: 0,
    width: '56px',
    zIndex: 10,
    position: 'sticky',
    right: `calc(-1 * ${tableSidePadding})`,
    backgroundColor: token('utility.elevation.surface.current', '#FFF'),
    borderBottom: `2px solid ${token('color.border', N40)}`,
    paddingRight: token('space.100', '4px'),
    background: `linear-gradient( 90deg, rgba(255, 255, 255, 0) 0%, ${token(
      'utility.elevation.surface.current',
      '#FFF',
    )} 10% )`,
    verticalAlign: 'middle',
    textAlign: 'right',
  },
  [`${withTablePluginHeaderPrefix('&:last-of-type')}`]: {
    paddingRight: tableSidePadding,
  },
});

const truncateStyles = css({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const TableCell = styled.td({
  [`${withTablePluginBodyPrefix()}`]: {
    fontSize: fieldTextFontSize,
    padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
    border: 0,
    minWidth: 'auto',
    verticalAlign: 'inherit',
    boxSizing: 'border-box',
    borderRight: `0.5px solid ${token('color.border', N40)}`,
    borderBottom: `0.5px solid ${token('color.border', N40)}`,
    overflow: 'hidden',
  },
  [`${withTablePluginBodyPrefix('&:first-child')}`]: {
    paddingLeft: token('space.100', '8px'),
  },
  [`${withTablePluginBodyPrefix('&:last-child')}`]: {
    borderRight: 0,
    paddingRight: token('space.100', '8px'),
  },
});

const tableContainerStyles = css({
  borderRadius: 'inherit',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
});

/**
 * Following section deals with slight gradient shadows that we add
 * on all four sides when there is more content in that direction.
 *
 * We do that by applying two gradients to the background -
 * one is "static" ('local') and other is "sticky" ('scroll'). \
 * "Static" one makes a white color gradient, that when window is at the end of scrollable area goes on top
 * of "sticky" (gray) one, dominating and hence disabling sticky one.
 */

interface ShadowCssPortion {
  backgroundImage: string;
  backgroundPosition: string;
  size: string;
  attachment: string;
}

const shadowColor = token(
  'elevation.shadow.overflow.perimeter',
  'rgba(0, 0, 0, 0.1)',
);
const shadowColorLight = token(
  'elevation.shadow.overflow.perimeter',
  'rgba(0, 0, 0, 0.05)',
);

const leftWhiteOverrideGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    90deg,
    ${token('utility.elevation.surface.current', '#FFF')} 30%,
    rgba(255, 255, 255, 0)
  )`,
  backgroundPosition: 'left center',
  size: `40px 100%`,
  attachment: `local`,
};

const topWhiteOverrideGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    0deg,
    rgba(255, 255, 255, 0),
    ${token('utility.elevation.surface.current', '#FFF')} 30%
  )`,
  backgroundPosition: 'top center',
  size: `100% 100px`,
  attachment: `local`,
};

const rightWhiteOverrideGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    ${token('utility.elevation.surface.current', '#FFF')} 70%
  )`,
  backgroundPosition: 'right center',
  size: `40px 100%`,
  attachment: `local`,
};

const bottomWhiteOverride: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    0deg,
    ${token('utility.elevation.surface.current', '#FFF')} 30%,
    rgba(255, 255, 255, 0)
  )`,
  backgroundPosition: 'bottom center',
  size: `100% 40px`,
  attachment: `local`,
};

const leftShadowGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    90deg,
    ${shadowColor},
    rgba(0, 0, 0, 0)
  )`,
  backgroundPosition: 'left center',
  size: `14px 100%`,
  attachment: `scroll`,
};

const topShadowGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    0deg,
    rgba(0, 0, 0, 0),
    ${shadowColorLight}
  )`,
  backgroundPosition: '0 52px',
  size: `100% 14px`,
  attachment: `scroll`,
};

const rightShadowGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    90deg,
    rgba(0, 0, 0, 0),
    ${shadowColor}
  )`,
  backgroundPosition: 'right center',
  size: `14px 100%`,
  attachment: `scroll`,
};

const bottomShadowGradient: ShadowCssPortion = {
  backgroundImage: `
  linear-gradient(
    0deg,
    ${shadowColorLight},
    rgba(0, 0, 0, 0)
  )`,
  backgroundPosition: 'bottom center',
  size: `100% 10px`,
  attachment: `scroll`,
};

const shadows: ShadowCssPortion[] = [
  leftWhiteOverrideGradient,
  leftShadowGradient,
  rightWhiteOverrideGradient,
  rightShadowGradient,
  topWhiteOverrideGradient,
  topShadowGradient,
  bottomWhiteOverride,
  bottomShadowGradient,
];

export const scrollableContainerShadowsCssComponents = {
  backgroundImage: shadows
    .map(({ backgroundImage }) => backgroundImage)
    .join(','),
  backgroundPosition: shadows
    .map(({ backgroundPosition }) => backgroundPosition)
    .join(','),
  backgroundRepeat: 'no-repeat',
  backgroundSize: shadows.map(({ size }) => size).join(','),
  backgroundAttachment: shadows.map(({ attachment }) => attachment).join(','),
};

const scrollableContainerStyles = css({
  overflow: 'auto',
  boxSizing: 'border-box',
  backgroundColor: token('utility.elevation.surface.current', '#FFF'),
  backgroundImage: scrollableContainerShadowsCssComponents.backgroundImage,
  backgroundPosition:
    scrollableContainerShadowsCssComponents.backgroundPosition,
  backgroundRepeat: scrollableContainerShadowsCssComponents.backgroundRepeat,
  backgroundSize: scrollableContainerShadowsCssComponents.backgroundSize,
  backgroundAttachment:
    scrollableContainerShadowsCssComponents.backgroundAttachment,
});

const tableStyles = css({
  // These styles are needed to prevent thead bottom border from scrolling away.
  // This happens because it is sticky. https://stackoverflow.com/questions/50361698/border-style-do-not-work-with-sticky-position-element
  borderCollapse: 'separate',
  borderSpacing: 0,
});

// By default tbody and thead have border-bottom: 2px ...
// This removes it, because for header we handle it via `th` styling and footer supply bottom border
const noDefaultBorderStyles = css({
  borderBottom: 0,
});

const headerStyles = css({
  fontSize: token('font.size.075', '12px'),
  fontWeight: token('font.weight.medium', '500'),
});

const headingHoverEffectStyles = css({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  '&:hover': {
    background: token('color.background.input.hovered', '#F7F8F9'),
    borderRadius: token('border.radius.200', '3px'),
  },
});

export interface RowType {
  cells: Array<RowCellType>;
  key?: string;
  ref?: Ref<HTMLTableRowElement>;
}

export interface RowCellType {
  key: string;
  width: number;
  shouldTruncate?: boolean;
  content?: React.ReactNode | string;
}

function extractIndex(data: Record<string, unknown>) {
  const { index } = data;
  invariant(typeof index === 'number');
  return index;
}

const sortColumns = (
  firstOption: DatasourceResponseSchemaProperty,
  secondOption: DatasourceResponseSchemaProperty,
): number => {
  return firstOption.title.localeCompare(secondOption.title);
};

export const getOrderedColumns = (
  columns: DatasourceResponseSchemaProperty[],
  visibleColumnKeys: string[],
) => {
  const visibleColumns = columns
    .filter(column => visibleColumnKeys.includes(column.key))
    .sort((a, b) => {
      const indexB = visibleColumnKeys.indexOf(b.key);
      const indexA = visibleColumnKeys.indexOf(a.key);
      return indexA - indexB;
    });

  const alphabeticallySortedInvisibleColumns = columns
    .filter(column => !visibleColumnKeys.includes(column.key))
    .sort(sortColumns);

  return [...visibleColumns, ...alphabeticallySortedInvisibleColumns];
};

const DEFAULT_WIDTH = COLUMN_BASE_WIDTH * 22;
const keyBasedWidthMap: Record<string, number> = {
  priority: COLUMN_BASE_WIDTH * 5,
  status: COLUMN_BASE_WIDTH * 18,
  summary: COLUMN_BASE_WIDTH * 45,
  description: COLUMN_BASE_WIDTH * 31,
  type: COLUMN_BASE_WIDTH * 6,
  key: COLUMN_BASE_WIDTH * 15,
};

function getDefaultColumnWidth(
  key: string,
  type: DatasourceType['type'],
): number {
  const keyBasedWidth = keyBasedWidthMap[key];
  if (keyBasedWidth) {
    return keyBasedWidth;
  }

  switch (type) {
    case 'date':
      return COLUMN_BASE_WIDTH * 16;

    case 'icon':
      return COLUMN_BASE_WIDTH * 7;

    default:
      return DEFAULT_WIDTH;
  }
}

const TruncateTextTag = forwardRef(
  (props: React.PropsWithChildren<unknown>, ref: React.Ref<HTMLElement>) => {
    return (
      <span css={truncateTextStyles} {...props} ref={ref}>
        {props.children}
      </span>
    );
  },
);

export const IssueLikeDataTableView = ({
  testId,
  onNextPage,
  onLoadDatasourceDetails,
  items,
  columns,
  renderItem = fallbackRenderType,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
  columnCustomSizes,
  onColumnResize,
  wrappedColumnKeys,
  onWrappedColumnChange,
  status,
  hasNextPage,
  scrollableContainerHeight,
  parentContainerRenderInstanceId,
  extensionKey,
}: IssueLikeDataTableViewProps) => {
  const tableId = useMemo(() => Symbol('unique-id'), []);
  const intl = useIntl();

  const tableHeaderRowRef = useRef<HTMLTableRowElement>(null);

  const [lastRowElement, setLastRowElement] =
    useState<HTMLTableRowElement | null>(null);
  const [hasFullSchema, setHasFullSchema] = useState(false);
  const isBottomOfTableVisibleRaw = useIsOnScreen(lastRowElement);

  const containerRef = useRef<HTMLDivElement>(null);

  const [orderedColumns, setOrderedColumns] = useState(() =>
    getOrderedColumns([...columns], [...visibleColumnKeys]),
  );

  useEffect(() => {
    if (!hasFullSchema) {
      setOrderedColumns(
        getOrderedColumns([...columns], [...visibleColumnKeys]),
      );
    }
  }, [columns, visibleColumnKeys, hasFullSchema]);

  useEffect(() => {
    if (parentContainerRenderInstanceId && status === 'resolved') {
      succeedUfoExperience(
        {
          name: 'datasource-rendered',
        },
        parentContainerRenderInstanceId,
      );
    }
  }, [parentContainerRenderInstanceId, status]);

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

  const getColumnWidth = useCallback(
    (key: string, type: DatasourceType['type']) =>
      columnCustomSizes?.[key] || getDefaultColumnWidth(key, type),
    [columnCustomSizes],
  );

  const headerColumns: Array<RowCellType> = useMemo(
    () =>
      visibleSortedColumns.map(
        ({ key, title, type }) =>
          ({
            key,
            content: title,
            shouldTruncate: true,
            width: getColumnWidth(key, type),
          } as RowCellType),
      ),
    [getColumnWidth, visibleSortedColumns],
  );

  const loadingRow: RowType = useMemo(
    () => ({
      key: 'loading',
      cells: headerColumns.map<RowCellType>(column => ({
        ...column,
        content: (
          <Skeleton
            borderRadius={8}
            width="100%"
            height={14}
            testId="issues-table-row-loading"
          />
        ),
      })),
    }),
    [headerColumns],
  );

  useEffect(() => {
    if (isBottomOfTableVisibleRaw && hasNextPage && status === 'resolved') {
      void onNextPage({
        isSchemaFromData: false,
        shouldForceRequest: true,
      });
    }
  }, [isBottomOfTableVisibleRaw, status, hasNextPage, onNextPage]);

  const hasData = items.length > 0;

  // This variable contains initial Y mouse coordinate, so we can restrict
  // autoScroller in X axis only
  const initialAutoScrollerClientY = useRef<number | null>();
  useEffect(() => {
    if (!onVisibleColumnKeysChange || !hasData) {
      return;
    }

    return combine(
      monitorForElements({
        onDragStart: ({ location, source }) => {
          initialAutoScrollerClientY.current = location.current.input.clientY;
          if (source.data.type === 'table-header') {
            autoScroller.start({
              input: {
                ...location.current.input,
                clientY:
                  // The goal is to have clientY the same and in the middle of the scrollable area
                  // Since clientY is taken from to of the viewport we need to plus that in order to get
                  // middle of the scrollable area in reference to the viewport
                  (initialAutoScrollerClientY.current || 0) +
                  (containerRef.current?.offsetHeight || 0) / 2,
              },
              behavior: 'container-only',
            });
          }
        },
        onDrag: ({ location, source }) => {
          if (source.data.type === 'table-header') {
            autoScroller.updateInput({
              input: {
                ...location.current.input,
                clientY:
                  (initialAutoScrollerClientY.current || 0) +
                  (containerRef.current?.offsetHeight || 0) / 2,
              },
            });
          }
        },
        onDrop({ source, location }) {
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
            setOrderedColumns(columns =>
              getOrderedColumns([...columns], [...newColumnKeyOrder]),
            );
          }
        },
      }),
    );
  }, [visibleColumnKeys, onVisibleColumnKeysChange, tableId, hasData]);

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

          const renderedValues = renderItem({
            type,
            values,
          } as DatasourceTypeWithOnlyValues);

          const stringifiedContent = values
            .map(value =>
              stringifyType(
                { type, value } as DatasourceType,
                intl.formatMessage,
                intl.formatDate,
              ),
            )
            .filter(value => value !== '')
            .join(', ');
          const contentComponent =
            stringifiedContent && !wrappedColumnKeys?.includes(key) ? (
              <Tooltip
                tag={TruncateTextTag}
                content={stringifiedContent}
                testId="issues-table-cell-tooltip"
              >
                {renderedValues}
              </Tooltip>
            ) : (
              renderedValues
            );

          return {
            key,
            content: contentComponent,
            width: getColumnWidth(key, type),
          };
        }),
        ref:
          rowIndex === items.length - 1
            ? el => setLastRowElement(el)
            : undefined,
      })),
    [
      items,
      visibleSortedColumns,
      renderItem,
      wrappedColumnKeys,
      getColumnWidth,
      intl.formatMessage,
      intl.formatDate,
    ],
  );

  const rows = useMemo(() => {
    if (status !== 'loading') {
      return tableRows;
    }
    // if there are table rows, only add 1 loading row
    if (tableRows.length > 0) {
      return [
        ...tableRows,
        { ...loadingRow, key: `loading-${tableRows.length}` },
      ];
    }
    // if there are no table rows add 14 rows if it is compact (has scrollableContainerHeight or non-modal)
    // add 10 rows if it is modal (no scrollableContainerHeight)
    const loadingRowsCount = scrollableContainerHeight ? 14 : 10;
    return [...Array(loadingRowsCount)].map((_, index) => ({
      ...loadingRow,
      key: `loading-${index}`,
    }));
  }, [loadingRow, status, tableRows, scrollableContainerHeight]);

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

    if (parentContainerRenderInstanceId) {
      startUfoExperience(
        {
          name: 'column-picker-rendered',
          metadata: { extensionKey: extensionKey ?? undefined },
        },
        parentContainerRenderInstanceId,
      );
    }

    try {
      await onLoadDatasourceDetails();
      setHasFullSchema(true);
    } catch (e) {
      setHasFullSchema(false);
    }
  }, [
    parentContainerRenderInstanceId,
    extensionKey,
    hasFullSchema,
    onLoadDatasourceDetails,
  ]);

  const shouldUseWidth = !!(onColumnResize || columnCustomSizes);

  const isEditable = onVisibleColumnKeysChange && hasData;

  return (
    <div
      /* There is required contentEditable={true} in editor-card-plugin
       * But this brakes how DND works. We set contentEditable={false} to allow DND to work
       * when dragging is initiated on top of a column label.
       */
      contentEditable={false}
      ref={containerRef}
      css={[
        tableContainerStyles,
        scrollableContainerHeight && scrollableContainerStyles,
      ]}
      style={
        scrollableContainerHeight
          ? {
              maxHeight: `${scrollableContainerHeight}px`,
            }
          : undefined
      }
    >
      <Table
        css={tableStyles}
        data-testid={testId}
        style={shouldUseWidth ? { tableLayout: 'fixed' } : {}}
      >
        <thead
          data-testid={testId && `${testId}--head`}
          css={[noDefaultBorderStyles, tableHeadStyles]}
          className={!!onVisibleColumnKeysChange ? 'has-column-picker' : ''}
        >
          <tr ref={tableHeaderRowRef}>
            {headerColumns.map(({ key, content, width }, cellIndex) => {
              let heading = (
                <Tooltip
                  content={content}
                  tag="span"
                  position="bottom-start"
                  testId={'datasource-header-content'}
                >
                  <span css={headerStyles}>{content}</span>
                </Tooltip>
              );

              const isHeadingOutsideButton =
                !isEditable || !onWrappedColumnChange;
              if (isHeadingOutsideButton) {
                heading = <div css={headingHoverEffectStyles}>{heading}</div>;
              }

              if (isEditable) {
                const previewRows = tableRows
                  .map(({ cells }) => {
                    const cell: RowCellType | undefined = cells.find(
                      ({ key: cellKey }) => cellKey === key,
                    );
                    if (cell) {
                      return cell.content;
                    }
                  })
                  .slice(0, 5);

                const dragPreview = (
                  <DragColumnPreview title={heading} rows={previewRows} />
                );

                return (
                  <DraggableTableHeading
                    tableId={tableId}
                    key={key}
                    id={key}
                    index={cellIndex}
                    width={width}
                    onWidthChange={onColumnResize?.bind(null, key)}
                    dndPreviewHeight={containerRef.current?.offsetHeight || 0}
                    dragPreview={dragPreview}
                    isWrapped={wrappedColumnKeys?.includes(key)}
                    onIsWrappedChange={onWrappedColumnChange?.bind(null, key)}
                  >
                    {heading}
                  </DraggableTableHeading>
                );
              } else {
                return (
                  <TableHeading
                    key={key}
                    data-testid={`${key}-column-heading`}
                    style={getWidthCss({ shouldUseWidth, width })}
                  >
                    {heading}
                  </TableHeading>
                );
              }
            })}
            {onVisibleColumnKeysChange && (
              <ColumnPickerHeader>
                <ColumnPicker
                  columns={hasFullSchema ? orderedColumns : []}
                  selectedColumnKeys={hasFullSchema ? visibleColumnKeys : []}
                  onSelectedColumnKeysChange={onSelectedColumnKeysChange}
                  onOpen={handlePickerOpen}
                  parentContainerRenderInstanceId={
                    parentContainerRenderInstanceId
                  }
                />
              </ColumnPickerHeader>
            )}
          </tr>
        </thead>
        <tbody
          css={noDefaultBorderStyles}
          data-testid={testId && `${testId}--body`}
        >
          {rows.map(({ key, cells, ref }) => (
            <tr
              key={key}
              data-testid={testId && `${testId}--row-${key}`}
              ref={ref}
            >
              {cells.map(({ key: cellKey, content, width }, cellIndex) => {
                const isLastCell = cellIndex === cells.length - 1;
                let loadingRowStyle: React.CSSProperties = getWidthCss({
                  shouldUseWidth,
                  width,
                });
                // extra padding is required around skeleton loader to avoid vertical jumps when data loads
                if (key?.includes('loading')) {
                  loadingRowStyle = {
                    ...loadingRowStyle,
                    paddingBlock: token('space.100', '8px'),
                  };
                }
                return (
                  <TableCell
                    key={cellKey}
                    data-testid={testId && `${testId}--cell-${cellIndex}`}
                    colSpan={isEditable && isLastCell ? 2 : undefined}
                    style={loadingRowStyle}
                    css={[
                      wrappedColumnKeys?.includes(cellKey)
                        ? null
                        : truncateStyles,
                    ]}
                  >
                    {content}
                  </TableCell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const EmptyState = TableEmptyState;
