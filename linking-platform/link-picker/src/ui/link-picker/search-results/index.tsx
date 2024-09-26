/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner/spinner';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';

import { type LinkPickerPlugin, type LinkSearchListItemData } from '../../../common/types';

import { LinkSearchError, testIds as searchErrorTestIds } from './link-search-error';
import { LinkSearchList, testIds as listTestIds } from './link-search-list';
import { ScrollingTabList } from './scrolling-tabs';
import { SearchResultsContainer } from './search-results-container';
import { TrackTabViewed } from './track-tab-viewed';

const tabsWrapperStyles = xcss({
	marginTop: 'space.150',
});

const spinnerContainerStyles = css({
	minHeight: '80px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'center',
	flexGrow: 1,
});

export const testIds = {
	...searchErrorTestIds,
	...listTestIds,
	tabsLoadingIndicator: 'link-picker.tabs-loading-indicator',
	tabList: 'link-picker-tabs',
	tabItem: 'link-picker-tab',
};

export type SearchResultsProps = {
	activePlugin?: LinkPickerPlugin;
	tabs: { tabTitle: string }[];
	isLoadingPlugins?: boolean;
	isLoadingResults: boolean;
	isSubmitting?: boolean;
	activeTab: number;
	handleTabChange: (activeTab: number) => void;
	handleSearchListOnChange: (id: string) => void;
	featureFlags?: Record<string, unknown>;
	linkSearchListId: string;
	queryState?: { query: string };
	items?: LinkSearchListItemData[] | null;
	activeIndex: number;
	selectedIndex: number;
	handleSelected: (objectId: string) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	error?: unknown;
	adaptiveHeight: boolean;
	retry: () => void;
};

export const SearchResults = ({
	tabs,
	activeTab,
	activePlugin,
	isLoadingPlugins,
	isLoadingResults,
	isSubmitting,
	handleTabChange,
	handleSearchListOnChange,
	featureFlags,
	linkSearchListId,
	error,
	queryState,
	items,
	activeIndex,
	selectedIndex,
	handleSelected,
	handleKeyDown,
	adaptiveHeight,
	retry,
}: SearchResultsProps) => {
	const isActivePlugin = !!activePlugin;

	const tabList = (
		<TabList>
			{tabs.map((tab) => (
				<Tab key={tab.tabTitle} testId={testIds.tabItem}>
					{tab.tabTitle}
				</Tab>
			))}
		</TabList>
	);

	return (
		<SearchResultsContainer
			hasTabs={!!tabs.length || isLoadingPlugins}
			adaptiveHeight={adaptiveHeight}
			isLoadingResults={isLoadingResults}
		>
			{isLoadingPlugins && !!queryState && (
				<div css={spinnerContainerStyles}>
					<Spinner
						testId={testIds.tabsLoadingIndicator}
						interactionName="link-picker-tabs-loading"
						size="medium"
					/>
				</div>
			)}
			{!isLoadingPlugins && isActivePlugin && !!queryState && (
				<Fragment>
					{tabs.length > 0 && (
						<Box xcss={tabsWrapperStyles}>
							<Tabs
								id={testIds.tabList}
								testId={testIds.tabList}
								selected={activeTab}
								onChange={handleTabChange}
							>
								{featureFlags?.scrollingTabs ? (
									<ScrollingTabList>{tabList}</ScrollingTabList>
								) : (
									tabList
								)}
							</Tabs>
							<TrackTabViewed activePlugin={activePlugin} />
						</Box>
					)}
					{!error && (
						<LinkSearchList
							id={linkSearchListId}
							role="listbox"
							ariaReadOnly={isSubmitting}
							items={items}
							isLoading={isLoadingResults}
							selectedIndex={selectedIndex}
							activeIndex={activeIndex}
							onSelect={handleSelected}
							onChange={handleSearchListOnChange}
							onKeyDown={handleKeyDown}
							hasSearchTerm={!!queryState?.query.length}
							activePlugin={activePlugin}
							adaptiveHeight={adaptiveHeight}
						/>
					)}
					{error ? activePlugin?.errorFallback?.(error, retry) ?? <LinkSearchError /> : null}
				</Fragment>
			)}
		</SearchResultsContainer>
	);
};
