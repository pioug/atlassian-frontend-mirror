/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import type { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents from '@atlaskit/analytics-next/withAnalyticsEvents';
import { token } from '@atlaskit/tokens';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE, fireAnalyticsEvent } from '../../analytics';
import type { QuickInsertItem } from '../../provider-factory';
import type { EmptyStateHandler } from '../../types';
import editorUGCToken from '../../ugc-tokens/get-editor-ugc-token';
import {
	DEVICE_BREAKPOINT_NUMBERS,
	ELEMENT_BROWSER_ID,
	GRID_SIZE,
	INLINE_SIDEBAR_HEIGHT,
	SIDEBAR_HEADING_WRAPPER_HEIGHT,
	SIDEBAR_WIDTH,
} from '../constants';
import useContainerWidth from '../hooks/use-container-width';
import useSelectAndFocusOnArrowNavigation from '../hooks/use-select-and-focus-on-arrow-navigation';
import type { Category, Modes, SelectedItemProps } from '../types';
import { ViewMore } from '../ViewMore';

import CategoryList from './CategoryList';
import ElementList from './ElementList/ElementList';
import ElementSearch from './ElementSearch';

export type StatelessElementBrowserProps = {
	categories?: Category[];
	items: QuickInsertItem[];
	onSearch: (searchTerm: string) => void;
	onSelectCategory: (category: Category) => void;
	onSelectItem?: (item: QuickInsertItem) => void;
	onInsertItem: (item: QuickInsertItem) => void;
	selectedCategory?: string;
	showSearch: boolean;
	showCategories: boolean;
	mode: keyof typeof Modes;
	searchTerm?: string;
	emptyStateHandler?: EmptyStateHandler;
	viewMoreItem?: QuickInsertItem;
	cache?: CellMeasurerCache;
} & WithAnalyticsEventsProps;

const wrapper = css({
	width: '100%',
	maxHeight: 'inherit',
	overflow: 'hidden',
});

const baseBrowserContainerStyles = css({
	display: 'flex',
	height: '100%',
	minHeight: '-webkit-fill-available',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const mobileElementBrowserContainer = css(baseBrowserContainerStyles, {
	flexDirection: 'column',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const elementBrowserContainer = css(baseBrowserContainerStyles, {
	flexDirection: 'row',
});

const baseSidebarStyles = css({
	display: 'flex',
	flexDirection: 'column',
	overflowX: 'auto',
	overflowY: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const mobileSideBar = css(baseSidebarStyles, {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	flex: `0 0 ${INLINE_SIDEBAR_HEIGHT}`,
	padding: `${token('space.150', '12px')} ${token(
		'space.150',
		'12px',
	)} 0 ${token('space.150', '12px')}`,
});

const mobileSideBarShowCategories = css({
	flex: '0 0 auto',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const sideBar = css(baseSidebarStyles, {
	flex: "0 0 'auto'",
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const sideBarShowCategories = css(baseSidebarStyles, {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	flex: `0 0 ${SIDEBAR_WIDTH}`,
});
const sidebarHeading = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	flex: `0 0 ${SIDEBAR_HEADING_WRAPPER_HEIGHT}`,
	display: 'inline-flex',
	alignItems: 'center',
	paddingLeft: token('space.150'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	font: editorUGCToken('editor.font.heading.h1', 'typography-modernized'), // use editor h1 modernized here as the style matches
});

const mobileMainContent = css({
	flex: '1 1 auto',
	display: 'flex',
	flexDirection: 'column',
	overflowY: 'auto',
	height: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const mainContent = css(mobileMainContent, {
	marginLeft: token('space.200', '16px'),
	height: 'auto',
});

const searchContainer = css({
	paddingBottom: token('space.200', '16px'),
});

const mobileCategoryListWrapper = css({
	display: 'flex',
	overflowX: 'auto',
	padding: `${token('space.200', '8px')} 0 ${token('space.200', '16px')} 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${GRID_SIZE * 4}px`,
	overflow: '-moz-scrollbars-none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-webkit-scrollbar': {
		display: 'none',
	},
	scrollbarWidth: 'none',
	MsOverflowStyle: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const categoryListWrapper = css(mobileCategoryListWrapper, {
	padding: 0,
	marginTop: token('space.200', '24px'),
	flexDirection: 'column',
});

function StatelessElementBrowser(props: StatelessElementBrowserProps) {
	const {
		items,
		onSelectItem,
		onInsertItem,
		viewMoreItem,
		selectedCategory,
		onSelectCategory,
		searchTerm,
		showCategories,
		cache,
	} = props;
	const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
	const categoryBeenChosen = useRef(false);
	const [columnCount, setColumnCount] = useState(1);

	let selectedCategoryIndex: number | undefined;
	let isFocusSearch;
	selectedCategoryIndex = props.categories?.findIndex((category) => {
		return category.name === selectedCategory;
	});

	if (showCategories) {
		const isEmptySearchTerm = !searchTerm || searchTerm?.length === 0;
		if (!isEmptySearchTerm) {
			// clear the flag if the search happens after a user has chosen the category
			categoryBeenChosen.current = false;
		}
		// A11Y: if categories exists, on the initial render search element should receive focus.
		// After user pick some category the category should stay focused.
		isFocusSearch = !categoryBeenChosen.current || !isEmptySearchTerm;
	}

	const itemIsDisabled = useCallback(
		(index: number) => {
			return items[index]?.isDisabled ?? false;
		},
		[items],
	);

	const {
		selectedItemIndex,
		focusedItemIndex,
		setFocusedItemIndex,
		setFocusedCategoryIndex,
		focusedCategoryIndex,
		focusOnSearch,
		focusOnViewMore,
		onKeyDown,
		setFocusOnSearch,
	} = useSelectAndFocusOnArrowNavigation(
		items.length - 1,
		columnCount,
		!!viewMoreItem,
		itemIsDisabled,
		isFocusSearch,
	);

	useEffect(() => {
		fireAnalyticsEvent(props.createAnalyticsEvent)({
			payload: {
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.ELEMENT_BROWSER,
				eventType: EVENT_TYPE.UI,
				attributes: {
					mode: props.mode,
				},
			},
		});

		return () => {
			fireAnalyticsEvent(props.createAnalyticsEvent)({
				payload: {
					action: ACTION.CLOSED,
					actionSubject: ACTION_SUBJECT.ELEMENT_BROWSER,
					eventType: EVENT_TYPE.UI,
					attributes: {
						mode: props.mode,
					},
				},
			});
		};
	}, [props.createAnalyticsEvent, props.mode]);

	/* Only for hitting enter to select item when focused on search bar,
	 * The actual enter key press is handled on individual items level.
	 */
	const selectedItem = selectedItemIndex !== undefined ? items[selectedItemIndex] : null;
	const onItemsEnterTabKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key !== 'Enter' && (e.key !== 'Tab' || !showCategories)) {
				return;
			}

			if (showCategories && e.key === 'Tab' && selectedCategoryIndex !== undefined) {
				// A11Y: Set focus on first category if tab pressed on search
				setFocusedCategoryIndex(selectedCategoryIndex);
				e.preventDefault();
				return;
			}

			if (onInsertItem && selectedItem != null && !(selectedItem.isDisabled ?? false)) {
				onInsertItem(selectedItem);
			}
			e.preventDefault();
		},
		[onInsertItem, selectedItem, setFocusedCategoryIndex, showCategories, selectedCategoryIndex],
	);

	/**
	 * On arrow key selection and clicks the selectedItemIndex will change.
	 * Making sure to update parent component.
	 */
	useEffect(() => {
		if (onSelectItem && selectedItem != null) {
			onSelectItem(selectedItem);
		}
	}, [onSelectItem, selectedItem]);

	const onSelectCategoryCB = useCallback(
		(category: Category) => {
			onSelectCategory(category);
			categoryBeenChosen.current = true;
		},
		[categoryBeenChosen, onSelectCategory],
	);

	return (
		<div css={wrapper} data-testid="element-browser" id={ELEMENT_BROWSER_ID}>
			<ContainerWidthMonitor />
			{containerWidth < DEVICE_BREAKPOINT_NUMBERS.medium ? (
				<MobileBrowser
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
					selectedItemIndex={selectedItemIndex}
					focusedItemIndex={focusedItemIndex}
					setFocusedItemIndex={setFocusedItemIndex}
					focusedCategoryIndex={focusedCategoryIndex}
					setFocusedCategoryIndex={setFocusedCategoryIndex}
					focusOnSearch={focusOnSearch}
					columnCount={columnCount}
					setColumnCount={setColumnCount}
					setFocusOnSearch={setFocusOnSearch}
					onKeyPress={onItemsEnterTabKeyPress}
					onKeyDown={onKeyDown}
					viewMoreItem={viewMoreItem}
					focusOnViewMore={focusOnViewMore}
					cache={cache}
				/>
			) : (
				<DesktopBrowser
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
					selectedItemIndex={selectedItemIndex}
					focusedItemIndex={focusedItemIndex}
					setFocusedItemIndex={setFocusedItemIndex}
					focusOnSearch={focusOnSearch}
					setColumnCount={setColumnCount}
					columnCount={columnCount}
					setFocusOnSearch={setFocusOnSearch}
					onKeyPress={onItemsEnterTabKeyPress}
					onKeyDown={onKeyDown}
					focusedCategoryIndex={focusedCategoryIndex}
					setFocusedCategoryIndex={setFocusedCategoryIndex}
					selectedCategoryIndex={selectedCategoryIndex}
					onSelectCategory={onSelectCategoryCB}
					cache={cache}
				/>
			)}
		</div>
	);
}

function MobileBrowser({
	showCategories,
	showSearch,
	onSearch,
	mode,
	categories,
	onSelectCategory,
	items,
	onInsertItem,
	selectedCategory,
	selectedItemIndex,
	focusedItemIndex,
	setFocusedItemIndex,
	focusedCategoryIndex,
	setFocusedCategoryIndex,
	focusOnSearch,
	focusOnViewMore,
	columnCount,
	setColumnCount,
	setFocusOnSearch,
	onKeyPress,
	onKeyDown,
	searchTerm,
	createAnalyticsEvent,
	emptyStateHandler,
	viewMoreItem,
	cache,
}: StatelessElementBrowserProps &
	SelectedItemProps & {
		focusOnSearch: boolean;
		focusOnViewMore: boolean;
		setFocusOnSearch: () => void;
		onKeyPress: (e: React.KeyboardEvent) => void;
		onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
		setFocusedItemIndex: (index: number) => void;
		setColumnCount: (columnCount: number) => void;
		columnCount: number;
		focusedCategoryIndex?: number;
		setFocusedCategoryIndex: (index: number) => void;
	}) {
	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			css={mobileElementBrowserContainer}
			onKeyDown={onKeyDown}
			data-testid="mobile__element-browser"
		>
			<div css={showCategories ? [mobileSideBar, mobileSideBarShowCategories] : mobileSideBar}>
				{showSearch && (
					<ElementSearch
						onSearch={onSearch}
						onKeyDown={onKeyPress}
						mode={mode}
						focus={focusOnSearch}
						onClick={setFocusOnSearch}
						searchTerm={searchTerm}
						items={items}
						selectedItemIndex={selectedItemIndex}
					/>
				)}
				{showCategories && (
					<nav css={mobileCategoryListWrapper} tabIndex={-1}>
						<CategoryList
							categories={categories}
							onSelectCategory={onSelectCategory}
							selectedCategory={selectedCategory}
							focusedCategoryIndex={focusedCategoryIndex}
							setFocusedCategoryIndex={setFocusedCategoryIndex}
							setFocusedItemIndex={setFocusedItemIndex}
							setFocusOnSearch={setFocusOnSearch}
						/>
					</nav>
				)}
			</div>
			<div css={mobileMainContent}>
				<ElementList
					items={items}
					mode={mode}
					onInsertItem={onInsertItem}
					selectedItemIndex={selectedItemIndex}
					focusedItemIndex={focusedItemIndex}
					setFocusedItemIndex={setFocusedItemIndex}
					columnCount={columnCount}
					setColumnCount={setColumnCount}
					createAnalyticsEvent={createAnalyticsEvent}
					emptyStateHandler={emptyStateHandler}
					selectedCategory={selectedCategory}
					searchTerm={searchTerm}
					cache={cache}
				/>
			</div>
			{viewMoreItem && <ViewMore item={viewMoreItem} focus={focusOnViewMore} />}
		</div>
	);
}

function DesktopBrowser({
	showCategories,
	showSearch,
	onSearch,
	mode,
	categories,
	onSelectCategory,
	items,
	onInsertItem,
	selectedCategory,
	selectedItemIndex,
	focusedItemIndex,
	setFocusedItemIndex,
	focusedCategoryIndex,
	setFocusedCategoryIndex,
	selectedCategoryIndex,
	focusOnSearch,
	columnCount,
	setColumnCount,
	setFocusOnSearch,
	onKeyPress,
	onKeyDown,
	searchTerm,
	createAnalyticsEvent,
	emptyStateHandler,
	cache,
}: StatelessElementBrowserProps &
	SelectedItemProps & {
		focusOnSearch: boolean;
		setFocusOnSearch: () => void;
		onKeyPress: (e: React.KeyboardEvent) => void;
		onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
		setFocusedItemIndex: (index: number) => void;
		focusedCategoryIndex?: number;
		setFocusedCategoryIndex: (index: number) => void;
		selectedCategoryIndex?: number;
		setColumnCount: (columnCount: number) => void;
		columnCount: number;
	}) {
	return (
		<div css={elementBrowserContainer} data-testid="desktop__element-browser">
			{showCategories && (
				<div css={showCategories ? sideBarShowCategories : sideBar}>
					{/*not using Box here as data-testid not supported*/}
					<div css={sidebarHeading} data-testid="sidebar-heading" id="sidebar-heading">
						<FormattedMessage
							id="fabric.editor.elementbrowser.sidebar.heading"
							defaultMessage="Browse"
							description="Sidebar heading"
						/>
					</div>
					{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
					<nav role="tablist" aria-labelledby="sidebar-heading" css={categoryListWrapper}>
						<CategoryList
							categories={categories}
							onSelectCategory={onSelectCategory}
							selectedCategory={selectedCategory}
							createAnalyticsEvent={createAnalyticsEvent}
							focusedCategoryIndex={focusedCategoryIndex}
							setFocusedCategoryIndex={setFocusedCategoryIndex}
							setFocusedItemIndex={setFocusedItemIndex}
							setFocusOnSearch={setFocusOnSearch}
						/>
					</nav>
				</div>
			)}
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div css={mainContent} onKeyDown={onKeyDown} data-testid="main-content">
				{showSearch && (
					// eslint-disable-next-line
					<div css={searchContainer}>
						<ElementSearch
							onSearch={onSearch}
							onKeyDown={onKeyPress}
							mode={mode}
							focus={focusOnSearch}
							onClick={setFocusOnSearch}
							searchTerm={searchTerm}
							items={items}
							selectedItemIndex={selectedItemIndex}
						/>
					</div>
				)}
				<ElementList
					items={items}
					mode={mode}
					onInsertItem={onInsertItem}
					selectedItemIndex={selectedItemIndex}
					focusedItemIndex={focusedItemIndex}
					setFocusedItemIndex={setFocusedItemIndex}
					columnCount={columnCount}
					setColumnCount={setColumnCount}
					createAnalyticsEvent={createAnalyticsEvent}
					emptyStateHandler={emptyStateHandler}
					selectedCategory={selectedCategory}
					selectedCategoryIndex={selectedCategoryIndex}
					searchTerm={searchTerm}
					setFocusedCategoryIndex={showCategories ? setFocusedCategoryIndex : undefined}
					cache={cache}
				/>
			</div>
		</div>
	);
}

const MemoizedElementBrowser = memo(
	withAnalyticsContext({
		source: 'ElementBrowser',
	})(withAnalyticsEvents()(StatelessElementBrowser)),
);

export default MemoizedElementBrowser;
