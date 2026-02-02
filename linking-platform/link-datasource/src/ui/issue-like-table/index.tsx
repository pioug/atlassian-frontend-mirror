/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx, styled } from '@compiled/react';
import invariant from 'tiny-invariant';

import { FlagsProvider } from '@atlaskit/flag';
import { Skeleton } from '@atlaskit/linking-common';
import {
	type DatasourceResponseSchemaProperty,
	type DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { autoScroller } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Box } from '@atlaskit/primitives/compiled';
import { N40 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { startUfoExperience, succeedUfoExperience } from '../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../contexts/datasource-experience-id';
import { useIsInPDFRender } from '../../hooks/useIsInPDFRender';

import { ColumnPicker } from './column-picker';
import { DragColumnPreview } from './drag-column-preview';
import { DraggableTableHeading } from './draggable-table-heading';
import TableEmptyState from './empty-state';
import { renderType } from './render-type';
import { TableCellContent } from './table-cell-content';
import {
	type HeaderRowCellType,
	type IssueLikeDataTableViewProps,
	type RowCellType,
	type RowType,
} from './types';
import { useIsOnScreen } from './useIsOnScreen';
import { COLUMN_BASE_WIDTH, getFieldLabelById, getWidthCss } from './utils';

const tableSidePadding = token('space.200', '16px');

const tableHeadStyles = css({
	backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	position: 'sticky',
	top: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: 10,
});

const columnPickerWidth = 80;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ColumnPickerHeader = styled.th({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:last-of-type, .ProseMirror .pm-table-wrapper > table thead &:last-of-type, &:last-of-type':
		{
			boxSizing: 'border-box',
			border: 0,
			width: `${columnPickerWidth}px`,
			zIndex: 10,
			position: 'sticky',
			right: `calc(-1 * ${tableSidePadding})`,
			background: `linear-gradient( 90deg, rgba(255, 255, 255, 0) 0%, ${token(
				'utility.elevation.surface.current',
				'#FFF',
			)} 10% )`,
			/* It is required to have solid (not half-transparent) color because of this gradient business below */
			borderBottom: `${token('border.width.selected')} solid ${token('color.border', N40)}`,
			paddingRight: tableSidePadding,
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

const wrappedStyles = css({
	whiteSpace: 'normal',
});

const tableContainerStyles = css({
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const Table = styled.table({
	width: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const TableHeading = styled.th({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &, .ProseMirror .pm-table-wrapper > table thead &, &': {
		border: 0,
		position: 'relative',
		/* This makes resizing work with out jumping due to padding + changes overall width for same default values. */
		boxSizing: 'border-box',
		lineHeight: '24px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.050', '4px'),
		borderRight: `0.5px solid ${token('color.border', N40)}`,
		borderBottom: `${token('border.width.selected')} solid ${token('color.border', N40)}`,
		/*
	  lineHeight * 2 -> Max height of two lined header
	  verticalPadding * 2 -> padding for this component itself
	  verticalPadding * 2 -> padding inside span (--container)
	  2px -> Bottom border
	  Last two terms are needed because of border-box box sizing.
	*/
		height: `calc(24px * 2 + ${token('space.025', '2px')} * 4 + 2px)`,
		verticalAlign: 'bottom',
		backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead.has-column-picker &:nth-last-of-type(2), .ProseMirror .pm-table-wrapper > table thead.has-column-picker &:nth-last-of-type(2), thead.has-column-picker &:nth-last-of-type(2)':
		{
			borderRight: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:first-of-type, .ProseMirror .pm-table-wrapper > table thead &:first-of-type, &:first-of-type':
		{
			paddingLeft: token('space.050', '4px'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:last-of-type, .ProseMirror .pm-table-wrapper > table thead &:last-of-type, &:last-of-type':
		{
			borderRight: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"& [data-testid='datasource-header-content--container']": {
		width: '100%',
		/* With Button now being a parent for this component it adds its lineHeight value and spoils
	  `height` calculation above. */
		lineHeight: '24px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.050', '4px'),
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		whiteSpace: 'normal',
		overflow: 'hidden',
		wordWrap: 'break-word',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const InlineEditableTableCell = styled.td({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table tbody &, .ProseMirror .pm-table-wrapper > table tbody &, &': {
		/* First section here is to override things editor table plugin css defines */
		font: token('font.body'),
		paddingTop: token('space.0', '0'),
		paddingRight: token('space.0', '0'),
		paddingBottom: token('space.0', '0'),
		paddingLeft: token('space.0', '0'),
		border: 0,
		minWidth: 'auto',
		height: '40px',
		verticalAlign: 'inherit',
		boxSizing: 'content-box',
		borderRight: `${token('border.width', '1px')} solid ${token('color.border', N40)}`,
		borderBottom: `${token('border.width', '1px')} solid ${token('color.border', N40)}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table tbody &:last-of-type, .ProseMirror .pm-table-wrapper > table tbody &:last-of-type, &:last-of-type':
		{
			borderRight: 0,
		},
	// Inline smart links are pretty opinionated about word-wrapping.
	// We want it to be controlled by user, so we make it overflow and truncate by default.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	["& [data-testid='inline-card-icon-and-title'], " +
	"& [data-testid='button-connect-account'] > span"]: {
		whiteSpace: 'unset',
	},
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
const scrollableContainerStyles = css({
	overflow: 'auto',
	boxSizing: 'border-box',
	backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	backgroundImage: `
		linear-gradient(90deg, ${token('utility.elevation.surface.current', '#FFF')} 30%, rgba(255, 255, 255, 0)),
		linear-gradient(90deg, ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.1)')}, rgba(0, 0, 0, 0)),
		linear-gradient(90deg, rgba(255, 255, 255, 0), ${token('utility.elevation.surface.current', '#FFF')} 70%),
		linear-gradient(90deg, rgba(0, 0, 0, 0), ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.1)')}),
		linear-gradient(0deg, rgba(255, 255, 255, 0), ${token('utility.elevation.surface.current', '#FFF')} 30%),
		linear-gradient(0deg, rgba(0, 0, 0, 0), ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.05)')}),
		linear-gradient(0deg, ${token('utility.elevation.surface.current', '#FFF')} 30%, rgba(255, 255, 255, 0)),
		linear-gradient(0deg, ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.05)')}, rgba(0, 0, 0, 0))
		`,
	backgroundPosition:
		'left center, left center, right center, right center, center top, 0px 52px, center bottom, center bottom',
	backgroundRepeat: 'no-repeat',
	backgroundSize:
		'40px 100%, 14px 100%, 40px 100%, 14px 100%, 100% 100px, 100% 14px, 100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll, local, scroll, local, scroll, local, scroll',
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
	font: token('font.body.small', fontFallback.body.UNSAFE_small),
	fontWeight: token('font.weight.medium', '500'),
});

const headingHoverEffectStyles = css({
	display: 'flex',
	alignItems: 'center',
	whiteSpace: 'nowrap',
	'&:hover': {
		backgroundColor: token('color.background.input.hovered', '#F7F8F9'),
		borderRadius: token('radius.large', '3px'),
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
	priority: COLUMN_BASE_WIDTH * 12.5, // 100px
	status: COLUMN_BASE_WIDTH * 12.5,
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

	const experienceId = useDatasourceExperienceId();
	const tableHeaderRowRef = useRef<HTMLTableRowElement>(null);

	const [lastRowElement, setLastRowElement] = useState<HTMLTableRowElement | null>(null);
	const [hasFullSchema, setHasFullSchema] = useState(false);

	const isInPDFRender = useIsInPDFRender();

	const isBottomOfTableVisibleRaw = useIsOnScreen(lastRowElement) && !isInPDFRender;

	const containerRef = useRef<HTMLDivElement>(null);

	const [orderedColumns, setOrderedColumns] = useState(() =>
		getOrderedColumns([...columns], [...visibleColumnKeys]),
	);

	useEffect(() => {
		if (orderedColumns.length !== columns.length) {
			setOrderedColumns(getOrderedColumns([...columns], [...visibleColumnKeys]));
		}
	}, [columns, visibleColumnKeys, orderedColumns]);

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
	const columnsWidthsSum = useMemo(
		() =>
			visibleSortedColumns
				.map(({ key, type }) => columnCustomSizes?.[key] || getDefaultColumnWidth(key, type))
				.reduce((sum, width) => width + sum, 0) +
			(onVisibleColumnKeysChange ? columnPickerWidth : 0),
		[columnCustomSizes, onVisibleColumnKeysChange, visibleSortedColumns],
	);

	const shouldUseWidth = !!(onColumnResize || columnCustomSizes);

	const tableContainerWidth = Math.ceil(containerRef.current?.getBoundingClientRect().width || 0);

	const getColumnWidth = useCallback(
		(key: string, type: DatasourceType['type'], isLastCell: boolean) => {
			if (
				isLastCell &&
				shouldUseWidth &&
				tableContainerWidth &&
				tableContainerWidth > columnsWidthsSum
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
				content: (
					<Box paddingInline="space.100">
						<Skeleton borderRadius={8} width="100%" height={14} testId="issues-table-row-loading" />
					</Box>
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

	useEffect(() => {
		if (isInPDFRender && hasNextPage && status === 'resolved') {
			setTimeout(() => {
				onNextPage({
					isSchemaFromData: false,
					shouldRequestFirstPage: false,
				});
			}, 10);
		}
	}, [isInPDFRender, onNextPage, status, hasNextPage]);

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
			itemIds.map<RowType>((id, rowIndex) => {
				return {
					key: id,
					cells: visibleSortedColumns.map<RowCellType>(({ key, type, title }, cellIndex) => {
						return {
							key,
							columnKey: key,
							content: (
								<TableCellContent
									id={id}
									columnKey={key}
									columnType={type}
									columnTitle={title}
									wrappedColumnKeys={wrappedColumnKeys}
									renderItem={renderItem}
								/>
							),
							width: getColumnWidth(key, type, cellIndex === visibleSortedColumns.length - 1),
						};
					}),
					ref: rowIndex === items.length - 1 ? (el) => setLastRowElement(el) : undefined,
				};
			}),
		[items, itemIds, renderItem, wrappedColumnKeys, visibleSortedColumns, getColumnWidth],
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
		} catch {
			setHasFullSchema(false);
		}
	}, [experienceId, extensionKey, hasFullSchema, onLoadDatasourceDetails]);

	const isEditable = onVisibleColumnKeysChange && hasData;

	const orderedColumnsAreUpToDate = orderedColumns.length === columns.length;
	const shouldDisplayColumnsInPicker = hasFullSchema && orderedColumnsAreUpToDate;

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
									<span css={headerStyles} id={getFieldLabelById(key)}>
										{content}
									</span>
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
									columns={shouldDisplayColumnsInPicker ? orderedColumns : []}
									selectedColumnKeys={shouldDisplayColumnsInPicker ? visibleColumnKeys : []}
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
								return (
									<InlineEditableTableCell
										key={cellKey}
										data-testid={testId && `${testId}--cell-${cellIndex}`}
										colSpan={isEditable && isLastCell ? 2 : undefined}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
										style={loadingRowStyle}
										css={[wrappedColumnKeys?.includes(cellKey) ? wrappedStyles : truncateStyles]}
									>
										{content}
									</InlineEditableTableCell>
								);
							})}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);

	return <FlagsProvider>{view}</FlagsProvider>;
};

export const EmptyState = TableEmptyState;
