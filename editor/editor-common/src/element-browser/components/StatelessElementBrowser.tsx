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
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE, fireAnalyticsEvent } from '../../analytics';
import type { QuickInsertItem } from '../../provider-factory';
import type { EmptyStateHandler } from '../../types';
import editorUGCToken from '../../ugc-tokens/get-editor-ugc-token';
import { ViewMore as ViewMoreNext } from '../components/ViewMore';
import {
	DEVICE_BREAKPOINT_NUMBERS,
	ELEMENT_BROWSER_ID,
	ELEMENT_BROWSER_LIST_ID,
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
	cache?: CellMeasurerCache;
	categories?: Category[];
	emptyStateHandler?: EmptyStateHandler;
	items: QuickInsertItem[];
	mode: keyof typeof Modes;
	onInsertItem: (item: QuickInsertItem) => void;
	onSearch: (searchTerm: string) => void;
	onSelectCategory: (category: Category) => void;
	onSelectItem?: (item: QuickInsertItem) => void;
	onViewMore?: () => void;
	searchTerm?: string;
	selectedCategory?: string;
	showCategories: boolean;
	showSearch: boolean;
	/**
	 * @private
	 * @deprecated
	 * Deprecated in favour of onViewMore
	 * Please clean up viewMoreItem when cleaning up platform_editor_refactor_view_more
	 */
	viewMoreItem?: QuickInsertItem;
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
	font: editorUGCToken('editor.font.heading.h1'),
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
		onViewMore,
		selectedCategory,
		onSelectCategory,
		searchTerm,
		showCategories,
		cache,
	} = props;
	const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
	const categoryBeenChosen = useRef(false);
	const [columnCount, setColumnCount] = useState(1);

	let isFocusSearch;
	const selectedCategoryIndex: number | undefined = props.categories?.findIndex((category) => {
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
		focusOnEmptyStateButton,
		focusedCategoryIndex,
		focusOnSearch,
		focusOnViewMore,
		onKeyDown,
		setFocusOnSearch,
	} = useSelectAndFocusOnArrowNavigation(
		items.length - 1,
		columnCount,
		fg('platform_editor_refactor_view_more') ? !!onViewMore : !!viewMoreItem,
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
					focusOnEmptyStateButton={focusOnEmptyStateButton}
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
					onViewMore={onViewMore}
					focusOnViewMore={focusOnViewMore}
					cache={cache}
				/>
			) : (
				<DesktopBrowser
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
					selectedItemIndex={selectedItemIndex}
					focusOnEmptyStateButton={focusOnEmptyStateButton}
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
	onViewMore,
	cache,
	focusOnEmptyStateButton = false,
}: StatelessElementBrowserProps &
	SelectedItemProps & {
		columnCount: number;
		focusedCategoryIndex?: number;
		focusOnEmptyStateButton?: boolean;
		focusOnSearch: boolean;
		focusOnViewMore: boolean;
		onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
		onKeyPress: (e: React.KeyboardEvent) => void;
		setColumnCount: (columnCount: number) => void;
		setFocusedCategoryIndex: (index: number) => void;
		setFocusedItemIndex: (index: number) => void;
		setFocusOnSearch: () => void;
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
						ariaControlsId={
							expValEquals('platform_editor_august_a11y', 'isEnabled', true)
								? ELEMENT_BROWSER_LIST_ID
								: undefined
						}
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
			<div
				css={mobileMainContent}
				id={
					expValEquals('platform_editor_august_a11y', 'isEnabled', true)
						? ELEMENT_BROWSER_LIST_ID
						: undefined
				}
			>
				<ElementList
					items={items}
					mode={mode}
					onInsertItem={onInsertItem}
					selectedItemIndex={selectedItemIndex}
					focusedItemIndex={focusedItemIndex}
					focusOnEmptyStateButton={focusOnEmptyStateButton}
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
			{onViewMore && fg('platform_editor_refactor_view_more') && (
				<ViewMoreNext onViewMore={onViewMore} focus={focusOnViewMore} />
			)}
			{viewMoreItem && !fg('platform_editor_refactor_view_more') && (
				<ViewMore item={viewMoreItem} focus={focusOnViewMore} />
			)}
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
	focusOnEmptyStateButton = false,
}: StatelessElementBrowserProps &
	SelectedItemProps & {
		columnCount: number;
		focusedCategoryIndex?: number;
		focusOnEmptyStateButton?: boolean;
		focusOnSearch: boolean;
		onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
		onKeyPress: (e: React.KeyboardEvent) => void;
		selectedCategoryIndex?: number;
		setColumnCount: (columnCount: number) => void;
		setFocusedCategoryIndex: (index: number) => void;
		setFocusedItemIndex: (index: number) => void;
		setFocusOnSearch: () => void;
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
							ariaControlsId={
								selectedCategory ? `browse-category-${selectedCategory}-tab` : 'browse-category-tab'
							}
						/>
					</div>
				)}
				<ElementList
					items={items}
					mode={mode}
					onInsertItem={onInsertItem}
					selectedItemIndex={selectedItemIndex}
					focusedItemIndex={focusedItemIndex}
					focusOnEmptyStateButton={focusOnEmptyStateButton}
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
