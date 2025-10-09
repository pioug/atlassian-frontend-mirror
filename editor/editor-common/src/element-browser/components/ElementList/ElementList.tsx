/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { Grid, List } from 'react-virtualized';
import type { Size } from 'react-virtualized/dist/commonjs/AutoSizer';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { ButtonItem } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE, fireAnalyticsEvent } from '../../../analytics';
import type { QuickInsertItem } from '../../../provider-factory';
import { IconFallback } from '../../../quick-insert';
import type { EmptyStateHandler } from '../../../types';
import {
	ELEMENT_ITEM_HEIGHT,
	ELEMENT_ITEM_PADDING,
	ELEMENT_LIST_PADDING,
	SCROLLBAR_WIDTH,
} from '../../constants';
import useContainerWidth from '../../hooks/use-container-width';
import useFocus from '../../hooks/use-focus';
import type { SelectedItemProps } from '../../types';
import { Modes } from '../../types';

import EmptyState from './EmptyState';
import { getColumnCount, getScrollbarWidth } from './utils';

export const ICON_HEIGHT = 40;
export const ICON_WIDTH = 40;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const itemIcon: SerializedStyles = css({
	width: `${ICON_WIDTH}px`,
	height: `${ICON_HEIGHT}px`,
	overflow: 'hidden',
	border: `${token('border.width')} solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: token('radius.small', '3px'),
	boxSizing: 'border-box',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: {
		width: `${ICON_WIDTH}px`,
		height: `${ICON_HEIGHT}px`,
	},
});

export interface Props {
	cache?: CellMeasurerCache;
	columnCount: number;
	emptyStateHandler?: EmptyStateHandler;
	focusOnEmptyStateButton?: boolean;
	items: QuickInsertItem[];
	mode: keyof typeof Modes;
	onInsertItem: (item: QuickInsertItem) => void;
	searchTerm?: string;
	selectedCategory?: string;
	selectedCategoryIndex?: number;
	setColumnCount: (columnCount: number) => void;
	setFocusedCategoryIndex?: (index: number) => void; // undefined for the case of mobile browser or when no categories
	setFocusedItemIndex: (index: number) => void;
}

function ElementList({
	items,
	mode,
	selectedItemIndex,
	focusedItemIndex,
	focusOnEmptyStateButton,
	columnCount,
	setColumnCount,
	createAnalyticsEvent,
	emptyStateHandler,
	selectedCategory,
	selectedCategoryIndex,
	searchTerm,
	setFocusedCategoryIndex,
	setFocusedItemIndex,
	cache,
	onInsertItem,
}: Props & SelectedItemProps & WithAnalyticsEventsProps) {
	const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
	const [scrollbarWidth, setScrollbarWidth] = useState(SCROLLBAR_WIDTH);

	const fullMode = mode === Modes.full;

	useEffect(() => {
		/**
		 * More of an optimization condition.
		 * Initially the containerWidths are reported 0 twice.
		 **/
		if (fullMode && containerWidth > 0) {
			setColumnCount(getColumnCount(containerWidth));
			const updatedScrollbarWidth = getScrollbarWidth();

			if (updatedScrollbarWidth > 0) {
				setScrollbarWidth(updatedScrollbarWidth);
			}
		}
	}, [fullMode, containerWidth, setColumnCount, scrollbarWidth]);

	const onExternalLinkClick = useCallback(() => {
		fireAnalyticsEvent(createAnalyticsEvent)({
			payload: {
				action: ACTION.VISITED,
				actionSubject: ACTION_SUBJECT.SMART_LINK,
				eventType: EVENT_TYPE.TRACK,
			},
		});
	}, [createAnalyticsEvent]);

	const listCache = useMemo(() => {
		return (
			cache ??
			new CellMeasurerCache({
				fixedWidth: true,
				defaultHeight: ELEMENT_ITEM_HEIGHT,
				minHeight: ELEMENT_ITEM_HEIGHT,
			})
		);
	}, [cache]);

	useEffect(() => {
		// need to recalculate values if we have the same items, but they're reordered
		listCache.clearAll();
	}, [listCache, searchTerm]);

	const rowHeight = ({ index }: { index: number }) => {
		return listCache.rowHeight({ index });
	};

	return (
		<Fragment>
			<ContainerWidthMonitor />
			<div
				css={elementItemsWrapper}
				data-testid="element-items"
				id={selectedCategory ? `browse-category-${selectedCategory}-tab` : 'browse-category-tab'}
				aria-labelledby={
					selectedCategory
						? `browse-category--${selectedCategory}-button`
						: 'browse-category-button'
				}
				role="tabpanel"
				tabIndex={items.length === 0 ? 0 : undefined}
			>
				{!items.length ? (
					emptyStateHandler ? (
						emptyStateHandler({
							mode,
							selectedCategory,
							searchTerm,
						})
					) : (
						<EmptyState
							onExternalLinkClick={onExternalLinkClick}
							focusOnEmptyStateButton={focusOnEmptyStateButton}
						/>
					)
				) : (
					<Fragment>
						{containerWidth > 0 && (
							<AutoSizer disableWidth>
								{({ height }: Size) =>
									columnCount === 1 ? (
										<ElementListSingleColumn
											cache={listCache}
											setFocusedCategoryIndex={setFocusedCategoryIndex}
											selectedCategoryIndex={selectedCategoryIndex}
											items={items}
											setFocusedItemIndex={setFocusedItemIndex}
											fullMode={fullMode}
											selectedItemIndex={selectedItemIndex}
											focusedItemIndex={focusedItemIndex}
											rowHeight={rowHeight}
											containerWidth={containerWidth}
											height={height}
											onInsertItem={onInsertItem}
										/>
									) : (
										<ElementListMultipleColumns
											columnCount={columnCount}
											cache={listCache}
											setFocusedCategoryIndex={setFocusedCategoryIndex}
											selectedCategoryIndex={selectedCategoryIndex}
											items={items}
											setFocusedItemIndex={setFocusedItemIndex}
											fullMode={fullMode}
											selectedItemIndex={selectedItemIndex}
											focusedItemIndex={focusedItemIndex}
											rowHeight={rowHeight}
											containerWidth={containerWidth}
											height={height}
											onInsertItem={onInsertItem}
										/>
									)
								}
							</AutoSizer>
						)}
					</Fragment>
				)}
			</div>
		</Fragment>
	);
}

type ElementListSingleColumnProps = {
	cache: CellMeasurerCache;
	containerWidth: number;
	focusedItemIndex?: number;
	fullMode: boolean;
	height: number;
	items: QuickInsertItem[];
	onInsertItem: (item: QuickInsertItem) => void;
	rowHeight: ({ index }: { index: number }) => number;
	selectedCategoryIndex?: number;
	selectedItemIndex?: number;
	setFocusedCategoryIndex?: (index: number) => void;
	setFocusedItemIndex: (index: number) => void;
};

const ElementListSingleColumn = (props: ElementListSingleColumnProps) => {
	const {
		items,
		fullMode,
		setFocusedItemIndex,
		rowHeight,
		containerWidth,
		height,
		onInsertItem,
		cache,
		focusedItemIndex,
		setFocusedCategoryIndex,
		selectedCategoryIndex,
		selectedItemIndex,
	} = props;

	const rowRenderer = useMemo(
		() =>
			({
				index,
				key,
				style,
				parent,
			}: {
				index: number;
				key: string | number;
				parent: object;
				style: object;
			}) => {
				return (
					<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
						{/* eslint-disable-next-line @atlassian/a11y/no-static-element-interactions*/}
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							key={key}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 -- Ignored via go/DSP-18766
							className="element-item-wrapper"
							css={elementItemWrapperSingle}
							onKeyDown={(e) => {
								if (e.key === 'Tab') {
									if (e.shiftKey && index === 0) {
										if (setFocusedCategoryIndex) {
											if (!!selectedCategoryIndex) {
												setFocusedCategoryIndex(selectedCategoryIndex);
											} else {
												setFocusedCategoryIndex(0);
											}
											e.preventDefault();
										}
									}
									// before focus jumps from elements list we need to rerender react-virtualized grid.
									// Otherwise on the next render 'scrollToCell' will have same cached value
									// and grid will not be scrolled to top.
									// So Tab press on category will not work anymore due to invisible 1-t element.
									else if (index === items.length - 2) {
										setFocusedItemIndex(items.length - 1);
									}
								}
							}}
						>
							<MemoizedElementItem
								inlineMode={!fullMode}
								index={index}
								item={items[index]}
								selected={selectedItemIndex === index}
								focus={focusedItemIndex === index}
								setFocusedItemIndex={setFocusedItemIndex}
								onInsertItem={onInsertItem}
								role={
									expValEquals('platform_editor_august_a11y', 'isEnabled', true)
										? 'option'
										: undefined
								}
							/>
						</div>
					</CellMeasurer>
				);
			}, // eslint-disable-next-line react-hooks/exhaustive-deps
		[
			cache,
			items,
			fullMode,
			selectedItemIndex,
			focusedItemIndex,
			selectedCategoryIndex,
			setFocusedCategoryIndex,
			setFocusedItemIndex,
			props,
		],
	);

	return (
		<List
			rowRenderer={rowRenderer}
			rowCount={items.length}
			rowHeight={rowHeight}
			width={containerWidth - ELEMENT_LIST_PADDING * 2}
			height={height}
			overscanRowCount={3}
			containerRole="presentation"
			role="listbox"
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(selectedItemIndex !== undefined && {
				scrollToIndex: selectedItemIndex,
			})}
		/>
	);
};

type ElementListMultipleColumnsProps = {
	cache: CellMeasurerCache;
	columnCount: number;
	containerWidth: number;
	focusedItemIndex?: number;
	fullMode: boolean;
	height: number;
	items: QuickInsertItem[];
	onInsertItem: (item: QuickInsertItem) => void;
	rowHeight: ({ index }: { index: number }) => number;
	selectedCategoryIndex?: number;
	selectedItemIndex?: number;
	setFocusedCategoryIndex?: (index: number) => void;
	setFocusedItemIndex: (index: number) => void;
};

const ElementListMultipleColumns = (props: ElementListMultipleColumnsProps) => {
	const {
		columnCount,
		items,
		fullMode,
		setFocusedItemIndex,
		rowHeight,
		containerWidth,
		height,
		onInsertItem,
		cache,
		focusedItemIndex,
		setFocusedCategoryIndex,
		selectedCategoryIndex,
		selectedItemIndex,
	} = props;

	const columnWidth = (containerWidth - ELEMENT_ITEM_PADDING * 2) / columnCount;
	const rowCount = Math.ceil(items.length / columnCount);

	const cellRenderer = useMemo(
		() =>
			({
				columnIndex,
				key,
				parent,
				rowIndex,
				style,
			}: {
				columnIndex: number;
				key: string | number;
				parent: object;
				rowIndex: number;
				style: object;
			}) => {
				const index = rowIndex * columnCount + columnIndex;
				if (items[index] == null) {
					return;
				}

				return index > items.length - 1 ? null : (
					<CellMeasurer
						cache={cache}
						key={key}
						rowIndex={rowIndex}
						columnIndex={columnIndex}
						parent={parent}
					>
						{/* eslint-disable-next-line @atlassian/a11y/no-static-element-interactions*/}
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							key={key}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 -- Ignored via go/DSP-18766
							className="element-item-wrapper"
							role="gridcell"
							tabIndex={0}
							css={elementItemWrapper}
							onKeyDown={(e) => {
								if (e.key === 'Tab') {
									if (e.shiftKey && index === 0) {
										if (setFocusedCategoryIndex) {
											if (!!selectedCategoryIndex) {
												setFocusedCategoryIndex(selectedCategoryIndex);
											} else {
												setFocusedCategoryIndex(0);
											}
											e.preventDefault();
										}
									}
									// before focus jumps from elements list we need to rerender react-virtualized grid.
									// Otherwise on the next render 'scrollToCell' will have same cached value
									// and grid will not be scrolled to top.
									// So Tab press on category will not work anymore due to invisible 1-t element.
									else if (index === items.length - 2) {
										setFocusedItemIndex(items.length - 1);
									}
								}
							}}
						>
							<MemoizedElementItem
								inlineMode={!fullMode}
								index={index}
								item={items[index]}
								selected={selectedItemIndex === index}
								focus={focusedItemIndex === index}
								setFocusedItemIndex={setFocusedItemIndex}
								onInsertItem={onInsertItem}
							/>
						</div>
					</CellMeasurer>
				);
			}, // eslint-disable-next-line react-hooks/exhaustive-deps
		[
			cache,
			items,
			fullMode,
			selectedItemIndex,
			columnCount,
			focusedItemIndex,
			selectedCategoryIndex,
			setFocusedCategoryIndex,
			setFocusedItemIndex,
			props,
		],
	);

	return (
		<Grid
			containerRole="row"
			cellRenderer={cellRenderer}
			height={height}
			width={containerWidth - ELEMENT_LIST_PADDING * 2} // containerWidth - padding on Left/Right (for focus outline)
			/**
			 * Refresh Grid on WidthObserver value change.
			 * Length of the items used to force re-render to solve Firefox bug with react-virtualized retaining
			 * scroll position after updating the data. If new data has different number of cells, a re-render
			 * is forced to prevent the scroll position render bug.
			 */
			key={containerWidth + items.length}
			rowHeight={rowHeight}
			rowCount={rowCount}
			columnCount={columnCount}
			columnWidth={columnWidth}
			deferredMeasurementCache={cache}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(selectedItemIndex !== undefined && {
				scrollToRow: Math.floor(selectedItemIndex / columnCount),
			})}
		/>
	);
};

type ElementItemType = {
	focus: boolean;
	index: number;
	inlineMode: boolean;
	item: QuickInsertItem;
	onInsertItem: (item: QuickInsertItem) => void;
	role?: string;
	selected: boolean;
	setFocusedItemIndex: (index: number) => void;
};

const MemoizedElementItem = memo(ElementItem);
MemoizedElementItem.displayName = 'MemoizedElementItem';

export function ElementItem({
	inlineMode,
	selected,
	item,
	index,
	onInsertItem,
	focus,
	setFocusedItemIndex,
	role,
}: ElementItemType) {
	const ref = useFocus(focus);

	/**
	 * Note: props.onSelectItem(item) is not called here as the StatelessElementBrowser's
	 * useEffect would trigger it on selectedItemIndex change. (Line 106-110)
	 * This implementation was changed for keyboard/click selection to work with `onInsertItem`.
	 */
	const onClick = useCallback(
		(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
			e.preventDefault();
			e.stopPropagation();
			setFocusedItemIndex(index);

			switch (e.nativeEvent.detail) {
				case 0:
					onInsertItem(item);
					break;
				case 1:
					if (inlineMode) {
						onInsertItem(item);
					}
					break;
				case 2:
					if (!inlineMode) {
						onInsertItem(item);
					}
					break;
				default:
					return;
			}
		},
		[index, inlineMode, item, onInsertItem, setFocusedItemIndex],
	);

	const { icon, title, description, keyshortcut, isDisabled } = item;
	return (
		<Tooltip content={description} testId={`element-item-tooltip-${index}`}>
			<ButtonItem
				onClick={onClick}
				iconBefore={<ElementBefore icon={icon} title={title} />}
				isSelected={selected}
				aria-describedby={
					expValEquals('platform_editor_august_a11y', 'isEnabled', true) ? undefined : title
				}
				aria-label={
					expValEquals('platform_editor_august_a11y', 'isEnabled', true) ? title : undefined
				}
				ref={ref}
				testId={`element-item-${index}`}
				id={`searched-item-${index}`}
				isDisabled={isDisabled}
				role={role}
			>
				<ItemContent
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={inlineMode ? null : itemStyleOverrides}
					tabIndex={0}
					title={title}
					description={description}
					keyshortcut={keyshortcut}
					isDisabled={isDisabled}
				/>
			</ButtonItem>
		</Tooltip>
	);
}

/**
 * Inline mode should use the existing Align-items:center value.
 */
const itemStyleOverrides = {
	alignItems: 'flex-start',
};

const ElementBefore = memo(({ icon }: Partial<QuickInsertItem>) => (
	<div css={[itemIcon, itemIconStyle]}>{icon ? icon() : <IconFallback />}</div>
));

const ItemContent = memo(
	({ title, description, keyshortcut, isDisabled }: Partial<QuickInsertItem>) => {
		if (fg('platform_editor_typography_ugc')) {
			return (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				<div css={itemBody} className="item-body">
					<div css={itemText}>
						<Stack space="space.025">
							<div css={itemTitleWrapper}>
								<Text color={isDisabled ? 'color.text.disabled' : undefined} maxLines={1}>
									{title}
								</Text>
								<div css={itemAfter}>
									{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
									{keyshortcut && <div css={shortcutStyle}>{keyshortcut}</div>}
								</div>
							</div>
							{description && (
								<Text
									color={isDisabled ? 'color.text.disabled' : 'color.text.subtle'}
									size="small"
									maxLines={2}
								>
									{description}
								</Text>
							)}
						</Stack>
					</div>
				</div>
			);
		} else {
			return (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				<div css={itemBody} className="item-body">
					<div css={itemText}>
						<div css={itemTitleWrapper}>
							{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text*/}
							<p css={isDisabled ? itemTitleDisabled : itemTitle}>{title}</p>
							<div css={itemAfter}>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								{keyshortcut && <div css={shortcutStyle}>{keyshortcut}</div>}
							</div>
						</div>
						{description && (
							// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
							<p css={isDisabled ? itemDescriptionDisabled : itemDescription}>{description}</p>
						)}
					</div>
				</div>
			);
		}
	},
);

const elementItemsWrapper = css({
	flex: 1,
	flexFlow: 'row wrap',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	overflow: 'hidden',
	padding: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ReactVirtualized__Grid': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.small', '3px'),
		outline: 'none',
		'&:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			boxShadow: `0 0 0 ${ELEMENT_LIST_PADDING}px ${token('color.border.focused')}`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ReactVirtualized__Grid__innerScrollContainer': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"div[class='element-item-wrapper']:last-child": {
			paddingBottom: token('space.050', '4px'),
		},
	},
});

const elementItemWrapperSingle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		button: {
			minHeight: '60px',
			alignItems: 'flex-start',
			padding: `${token('space.150', '12px')} ${token('space.150', '12px')} 11px`,
		},
	},
});

const elementItemWrapper = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		button: {
			minHeight: '75px',
			alignItems: 'flex-start',
			padding: `${token('space.150', '12px')} ${token('space.150', '12px')} 11px`,
		},
	},
});

const itemBody = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.4,
	width: '100%',
	marginTop: token('space.negative.025', '-2px'),
});

/*
 * -webkit-line-clamp is also supported by firefox 🎉
 * https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/68#CSS
 */
const multilineStyle = css({
	display: '-webkit-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const itemDescription = css(multilineStyle, {
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(11.67),
	color: token('color.text.subtle'),
	marginTop: token('space.025', '2px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const itemDescriptionDisabled = css(multilineStyle, {
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(11.67),
	color: token('color.text.disabled'),
	marginTop: token('space.025', '2px'),
});

const itemText = css({
	width: 'inherit',
	whiteSpace: 'initial',
});

const itemTitleWrapper = css({
	display: 'flex',
	justifyContent: 'space-between',
});
const itemTitle = css({
	width: '100%',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
});

const itemTitleDisabled = css({
	width: '100%',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	color: token('color.text.disabled'),
});

const itemAfter = css({
	flex: '0 0 auto',
	paddingTop: token('space.025', '2px'),
	marginBottom: token('space.negative.025', '-2px'),
});

const itemIconStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		height: '40px',
		width: '40px',
		objectFit: 'cover',
	},
});

const MemoizedElementListWithAnalytics = memo(
	withAnalyticsContext({ component: 'ElementList' })(ElementList),
);

export default MemoizedElementListWithAnalytics;
