/** @jsx jsx */
import { Fragment, KeyboardEvent } from 'react';

import { jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner/spinner';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';

import {
  LinkPickerPlugin,
  LinkSearchListItemData,
} from '../../../common/types';
import { useFixHeight } from '../../../controllers/use-fix-height';

import {
  LinkSearchError,
  testIds as searchErrorTestIds,
} from './link-search-error';
import { LinkSearchList, testIds as listTestIds } from './link-search-list';
import { ScrollingTabList } from './scrolling-tabs';
import { SearchResultsContainer } from './search-results-container';
import { spinnerContainerStyles, tabsWrapperStyles } from './styled';
import { TrackTabViewed } from './track-tab-viewed';

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
  retry: () => void;
};

export const SearchResults = ({
  tabs,
  activeTab,
  activePlugin,
  isLoadingPlugins,
  isLoadingResults,
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
  retry,
}: SearchResultsProps) => {
  const isActivePlugin = !!activePlugin;

  // This will be redundant if we move towards fixed height search results section
  const fixListHeightProps = useFixHeight(isLoadingResults);

  const tabList = (
    <TabList>
      {tabs.map(tab => (
        <Tab key={tab.tabTitle} testId={testIds.tabItem}>
          {tab.tabTitle}
        </Tab>
      ))}
    </TabList>
  );

  return (
    <SearchResultsContainer
      hasTabs={!!tabs.length || isLoadingPlugins}
      {...fixListHeightProps}
    >
      {isLoadingPlugins && !!queryState && (
        <div css={spinnerContainerStyles}>
          <Spinner testId={testIds.tabsLoadingIndicator} size="medium" />
        </div>
      )}
      {!isLoadingPlugins && isActivePlugin && !!queryState && (
        <Fragment>
          {tabs.length > 0 && (
            <div css={tabsWrapperStyles}>
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
            </div>
          )}
          {!error && (
            <LinkSearchList
              id={linkSearchListId}
              role="listbox"
              items={items}
              isLoading={isLoadingResults}
              selectedIndex={selectedIndex}
              activeIndex={activeIndex}
              onSelect={handleSelected}
              onChange={handleSearchListOnChange}
              onKeyDown={handleKeyDown}
              hasSearchTerm={!!queryState?.query.length}
              activePlugin={activePlugin}
            />
          )}
          {error &&
            (activePlugin?.errorFallback?.(error, retry) ?? (
              <LinkSearchError />
            ))}
        </Fragment>
      )}
    </SearchResultsContainer>
  );
};
