/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import debounce from 'lodash/debounce';
import { useIntl } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { FlagsProvider } from '@atlaskit/flag';
import { Skeleton } from '@atlaskit/linking-common';
import {
	type DatasourceResponseSchemaProperty,
	type DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { autoScroller } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Box } from '@atlaskit/primitives';
import { N40 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import { WidthObserver } from '@atlaskit/width-detector';

import { startUfoExperience, succeedUfoExperience } from '../../analytics/ufoExperiences';
import { stickyTableHeadersIndex } from '../../common/zindex';
import { useDatasourceExperienceId } from '../../contexts/datasource-experience-id';

import { ColumnPicker } from './column-picker';
import { DragColumnPreview } from './drag-column-preview';
import { DraggableTableHeading } from './draggable-table-heading';
import TableEmptyState from './empty-state';
import { renderType, stringifyType } from './render-type';
import {
	InlineEditableTableCell,
	Table,
	TableCell,
	TableHeading,
	withTablePluginHeaderPrefix,
} from './styled';
import { ReadOnlyCell, TableCellContent } from './table-cell-content';
import { TruncateTextTag } from './truncate-text-tag';
import {
	type DatasourceTypeWithOnlyValues,
	type HeaderRowCellType,
	type IssueLikeDataTableViewProps,
	type RowCellType,
	type RowType,
} from './types';
import { useIsOnScreen } from './useIsOnScreen';
import { COLUMN_BASE_WIDTH, getWidthCss } from './utils';

const tableSidePadding = token('space.200', '16px');

const tableHeadStyles = css({
	background: token('utility.elevation.surface.current', '#FFF'),
	position: 'sticky',
	top: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: stickyTableHeadersIndex,
});

const columnPickerWidth = 80;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ColumnPickerHeader = styled.th({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`${withTablePluginHeaderPrefix('&:last-of-type')}`]: {
		boxSizing: 'border-box',
		border: 0,
		width: `${columnPickerWidth}px`,
		zIndex: 10,
		position: 'sticky',
		right: `calc(-1 * ${tableSidePadding})`,
		backgroundColor: token('utility.elevation.surface.current', '#FFF'),
		/* It is required to have solid (not half-transparent) color because of this gradient business below */
		borderBottom: `2px solid ${token('color.border', N40)}`,
		paddingRight: tableSidePadding,
		background: `linear-gradient( 90deg, rgba(255, 255, 255, 0) 0%, ${token(
			'utility.elevation.surface.current',
			'#FFF',
		)} 10% )`,
		/* Keeps dropdown button in the middle */
		verticalAlign: 'middle',
		/* In case when TH itself is bigger we want to keep picker at the right side */
		textAlign: 'right',
	},
});

const truncateStyles = css({
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const tableContainerStyles = css({
	borderRadius: 'inherit',
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	position: 'relative',
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

const shadowColor = token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.1)');
const shadowColorLight = token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.05)');

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
	backgroundImage: shadows.map(({ backgroundImage }) => backgroundImage).join(','),
	backgroundPosition: shadows.map(({ backgroundPosition }) => backgroundPosition).join(','),
	backgroundRepeat: 'no-repeat',
	backgroundSize: shadows.map(({ size }) => size).join(','),
	backgroundAttachment: shadows.map(({ attachment }) => attachment).join(','),
};

const scrollableContainerStyles = css({
	overflow: 'auto',
	boxSizing: 'border-box',
	backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundImage: scrollableContainerShadowsCssComponents.backgroundImage,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundPosition: scrollableContainerShadowsCssComponents.backgroundPosition,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundRepeat: scrollableContainerShadowsCssComponents.backgroundRepeat,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundSize: scrollableContainerShadowsCssComponents.backgroundSize,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundAttachment: scrollableContainerShadowsCssComponents.backgroundAttachment,
});

const tableStyles = css({
	// These styles are needed to prevent thead bottom border from scrolling away.
	// This happens because it is sticky. https://stackoverflow.com/questions/50361698/border-style-do-not-work-with-sticky-position-element
	borderCollapse: 'separate',
	borderSpacing: 0,
	// There is a strange table:first-of-type rule that sets margin-top to 0 coming from container,
	// but because our table is now not the first child (there is an empty div to measure width) we need to set it manually.
	margin: 0,
});

// By default tbody and thead have border-bottom: 2px ...
// This removes it, because for header we handle it via `th` styling and footer supply bottom border
const noDefaultBorderStyles = css({
	borderBottom: 0,
});

const headerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body.UNSAFE_small', fontFallback.body.UNSAFE_small),
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
		.filter((column) => visibleColumnKeys.includes(column.key))
		.sort((a, b) => {
			const indexB = visibleColumnKeys.indexOf(b.key);
			const indexA = visibleColumnKeys.indexOf(a.key);
			return indexA - indexB;
		});

	const alphabeticallySortedInvisibleColumns = columns
		.filter((column) => !visibleColumnKeys.includes(column.key))
		.sort(sortColumns);

	return [...visibleColumns, ...alphabeticallySortedInvisibleColumns];
};

const DEFAULT_WIDTH = COLUMN_BASE_WIDTH * 22;
const keyBasedWidthMap: Record<string, number> = {
	priority: COLUMN_BASE_WIDTH * 13.75, // 110px
	status: COLUMN_BASE_WIDTH * 15,
	summary: COLUMN_BASE_WIDTH * 45,
	description: COLUMN_BASE_WIDTH * 31,
	type: COLUMN_BASE_WIDTH * 6,
	key: COLUMN_BASE_WIDTH * 15,
};

function getDefaultColumnWidth(key: string, type: DatasourceType['type']): number {
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

export const IssueLikeDataTableView = ({
	testId,
	onNextPage,
	onLoadDatasourceDetails,
	items,
	itemIds,
	columns,
	renderItem = renderType,
	visibleColumnKeys,
	onVisibleColumnKeysChange,
	columnCustomSizes,
	onColumnResize,
	wrappedColumnKeys,
	onWrappedColumnChange,
	status,
	hasNextPage,
	scrollableContainerHeight,
	extensionKey,
}: IssueLikeDataTableViewProps) => {
	const tableId = useMemo(() => Symbol('unique-id'), []);
	const intl = useIntl();

	const experienceId = useDatasourceExperienceId();
	const tableHeaderRowRef = useRef<HTMLTableRowElement>(null);

	const [lastRowElement, setLastRowElement] = useState<HTMLTableRowElement | null>(null);
	const [hasFullSchema, setHasFullSchema] = useState(false);
	const isBottomOfTableVisibleRaw = useIsOnScreen(lastRowElement);

	const containerRef = useRef<HTMLDivElement>(null);

	const [orderedColumns, setOrderedColumns] = useState(() =>
		getOrderedColumns([...columns], [...visibleColumnKeys]),
	);

	// Table container width is used to know if sum of all column widths is bigger of container or not.
	// When sum of all columns is less than container size we make last column stretchable (width: undefined)
	const [tableContainerWidth, setTableContainerWidth] = useState<number | undefined>();

	useEffect(() => {
		const { current } = containerRef;
		if (containerRef && current) {
			setTableContainerWidth(current.getBoundingClientRect().width);
		}
	}, [containerRef]);

	useEffect(() => {
		if (!hasFullSchema) {
			setOrderedColumns(getOrderedColumns([...columns], [...visibleColumnKeys]));
		}
	}, [columns, visibleColumnKeys, hasFullSchema]);

	useEffect(() => {
		if (experienceId && status === 'resolved') {
			succeedUfoExperience(
				{
					name: 'datasource-rendered',
				},
				experienceId,
			);
		}
	}, [experienceId, status]);

	const visibleSortedColumns = useMemo(
		() =>
			visibleColumnKeys
				.map((visibleKey) => orderedColumns.find(({ key }) => visibleKey === key))
				.filter(Boolean) as DatasourceResponseSchemaProperty[],
		[orderedColumns, visibleColumnKeys],
	);

	// TODO seems like this component can't handle some combination of incremental data retrieval.
	// If data comes first, then columns and then visibleColumnKeys it blows up,
	// or some other combination.

	const identityColumnKey = 'id';

	const columnsWidthsSum = useMemo(
		() =>
			visibleSortedColumns
				.map(({ key, type }) => columnCustomSizes?.[key] || getDefaultColumnWidth(key, type))
				.reduce((sum, width) => width + sum, 0) +
			(onVisibleColumnKeysChange ? columnPickerWidth : 0),
		[columnCustomSizes, onVisibleColumnKeysChange, visibleSortedColumns],
	);

	const shouldUseWidth = !!(onColumnResize || columnCustomSizes);

	const getColumnWidth = useCallback(
		(key: string, type: DatasourceType['type'], isLastCell: boolean) => {
			if (
				isLastCell &&
				shouldUseWidth &&
				(!tableContainerWidth || tableContainerWidth > columnsWidthsSum)
			) {
				return undefined;
			} else {
				return columnCustomSizes?.[key] || getDefaultColumnWidth(key, type);
			}
		},
		[columnCustomSizes, columnsWidthsSum, shouldUseWidth, tableContainerWidth],
	);

	const headerColumns: Array<HeaderRowCellType> = useMemo(
		() =>
			visibleSortedColumns.map(({ key, title, type }, index) => ({
				key,
				content: title,
				shouldTruncate: true,
				width: getColumnWidth(key, type, index === visibleSortedColumns.length - 1),
			})),
		[getColumnWidth, visibleSortedColumns],
	);

	const loadingRow: RowType = useMemo(
		() => ({
			key: 'loading',
			cells: headerColumns.map<RowCellType>((column) => ({
				content: fg('platform-datasources-enable-two-way-sync') ? (
					<Box paddingInline="space.100">
						<Skeleton borderRadius={8} width="100%" height={14} testId="issues-table-row-loading" />
					</Box>
				) : (
					<Skeleton borderRadius={8} width="100%" height={14} testId="issues-table-row-loading" />
				),
				key: column.key,
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

					if (source.data.type === 'table-header' && source.data.tableId === tableId) {
						const closestEdgeOfTarget = extractClosestEdge(target.data);
						invariant(closestEdgeOfTarget === 'left' || closestEdgeOfTarget === 'right');

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
						setOrderedColumns((columns) => getOrderedColumns([...columns], [...newColumnKeyOrder]));
					}
				},
			}),
		);
	}, [visibleColumnKeys, onVisibleColumnKeysChange, tableId, hasData]);

	const tableRows: Array<RowType> = useMemo(
		() =>
			// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
			fg('enable_datasource_react_sweet_state')
				? itemIds.map<RowType>((id, rowIndex) => {
						return {
							key: id,
							cells: visibleSortedColumns.map<RowCellType>(({ key, type }, cellIndex) => {
								return {
									key,
									columnKey: key,
									// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
									content: fg('platform-datasources-enable-two-way-sync') ? (
										<TableCellContent
											id={id}
											columnKey={key}
											columnType={type}
											wrappedColumnKeys={wrappedColumnKeys}
											renderItem={renderItem}
										/>
									) : (
										<ReadOnlyCell
											id={id}
											columnKey={key}
											columnType={type}
											wrappedColumnKeys={wrappedColumnKeys}
											renderItem={renderItem}
										/>
									),
									width: getColumnWidth(key, type, cellIndex === visibleSortedColumns.length - 1),
								};
							}),
							ref: rowIndex === items.length - 1 ? (el) => setLastRowElement(el) : undefined,
						};
					})
				: items.map<RowType>((newRowData, rowIndex) => ({
						key: `${
							(identityColumnKey &&
								newRowData[identityColumnKey] &&
								newRowData[identityColumnKey].data) ||
							rowIndex
						}`,
						cells: visibleSortedColumns.map<RowCellType>(({ key, type }, cellIndex) => {
							// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
							const value = newRowData[key]?.data;
							const values = Array.isArray(value) ? value : [value];

							const renderedValues = renderItem({
								type,
								values,
							} as DatasourceTypeWithOnlyValues);

							const stringifiedContent = values
								.map((value) =>
									stringifyType(
										{ type, value } as DatasourceType,
										intl.formatMessage,
										intl.formatDate,
									),
								)
								.filter((value) => value !== '')
								.join(', ');

							const contentComponent =
								stringifiedContent && !wrappedColumnKeys?.includes(key) ? (
									<Tooltip
										// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
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
								width: getColumnWidth(key, type, cellIndex === visibleSortedColumns.length - 1),
							};
						}),
						ref: rowIndex === items.length - 1 ? (el) => setLastRowElement(el) : undefined,
					})),
		[
			items,
			itemIds,
			renderItem,
			wrappedColumnKeys,
			visibleSortedColumns,
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
			return [...tableRows, { ...loadingRow, key: `loading-${tableRows.length}` }];
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

		if (experienceId) {
			startUfoExperience(
				{
					name: 'column-picker-rendered',
					metadata: { extensionKey: extensionKey ?? undefined },
				},
				experienceId,
			);
		}

		try {
			await onLoadDatasourceDetails();
			setHasFullSchema(true);
		} catch (e) {
			setHasFullSchema(false);
		}
	}, [experienceId, extensionKey, hasFullSchema, onLoadDatasourceDetails]);

	const isEditable = onVisibleColumnKeysChange && hasData;

	const view = (
		<div
			/* There is required contentEditable={true} in editor-card-plugin
			 * But this brakes how DND works. We set contentEditable={false} to allow DND to work
			 * when dragging is initiated on top of a column label.
			 */
			contentEditable={false}
			ref={containerRef}
			css={[tableContainerStyles, scrollableContainerHeight && scrollableContainerStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				scrollableContainerHeight
					? {
							maxHeight: `${scrollableContainerHeight}px`,
						}
					: undefined
			}
			data-testid={'issue-like-table-container'}
		>
			<WidthObserver setWidth={debounce(setTableContainerWidth, 100)} />
			<Table
				css={tableStyles}
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={shouldUseWidth ? { tableLayout: 'fixed' } : {}}
			>
				<thead
					data-testid={testId && `${testId}--head`}
					css={[noDefaultBorderStyles, tableHeadStyles]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
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

							const isHeadingOutsideButton = !isEditable || !onWrappedColumnChange;
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

								const dragPreview = <DragColumnPreview title={heading} rows={previewRows} />;

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
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
								/>
							</ColumnPickerHeader>
						)}
					</tr>
				</thead>
				<tbody css={noDefaultBorderStyles} data-testid={testId && `${testId}--body`}>
					{rows.map(({ key, cells, ref }) => (
						<tr key={key} data-testid={testId && `${testId}--row-${key}`} ref={ref}>
							{cells.map(({ key: cellKey, content, width }, cellIndex) => {
								const isLastCell = cellIndex === cells.length - 1;
								let loadingRowStyle: React.CSSProperties = getWidthCss({
									shouldUseWidth,
									width,
								});

								// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
								if (fg('platform-datasources-enable-two-way-sync')) {
									return (
										<InlineEditableTableCell
											key={cellKey}
											data-testid={testId && `${testId}--cell-${cellIndex}`}
											colSpan={isEditable && isLastCell ? 2 : undefined}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											style={loadingRowStyle}
											css={[wrappedColumnKeys?.includes(cellKey) ? null : truncateStyles]}
										>
											{content}
										</InlineEditableTableCell>
									);
								} else {
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
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											style={loadingRowStyle}
											css={[wrappedColumnKeys?.includes(cellKey) ? null : truncateStyles]}
										>
											{content}
										</TableCell>
									);
								}
							})}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);

	return fg('platform-datasources-enable-two-way-sync') ? (
		<FlagsProvider>{view}</FlagsProvider>
	) : (
		view
	);
};

export const EmptyState = TableEmptyState;
