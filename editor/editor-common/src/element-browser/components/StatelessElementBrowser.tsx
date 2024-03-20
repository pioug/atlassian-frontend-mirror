/** @jsx jsx */
import React, { memo, useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '../../analytics';
import type { QuickInsertItem } from '../../provider-factory';
import type { EmptyStateHandler } from '../../types';
import {
  DEVICE_BREAKPOINT_NUMBERS,
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

const mobileElementBrowserContainer = css(baseBrowserContainerStyles, {
  flexDirection: 'column',
});

const elementBrowserContainer = css(baseBrowserContainerStyles, {
  flexDirection: 'row',
});

const baseSidebarStyles = css({
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'auto',
  overflowY: 'hidden',
});

const mobileSideBar = css(baseSidebarStyles, {
  flex: `0 0 ${INLINE_SIDEBAR_HEIGHT}`,
  padding: `${token('space.150', '12px')} ${token(
    'space.150',
    '12px',
  )} 0 ${token('space.150', '12px')}`,
});

const mobileSideBarShowCategories = css({
  flex: '0 0 auto',
});
const sideBar = css(baseSidebarStyles, {
  flex: "0 0 'auto'",
});

const sideBarShowCategories = css(baseSidebarStyles, {
  flex: `0 0 ${SIDEBAR_WIDTH}`,
});
const sidebarHeading = css({
  flex: `0 0 ${SIDEBAR_HEADING_WRAPPER_HEIGHT}`,
  display: 'inline-flex',
  alignItems: 'center',
  paddingLeft: token('space.150', '12px'),
  fontWeight: 700,
});

const mobileMainContent = css({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  height: '100%',
});

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
  minHeight: `${GRID_SIZE * 4}px`,
  overflow: '-moz-scrollbars-none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  MsOverflowStyle: 'none',
});

const categoryListWrapper = css(mobileCategoryListWrapper, {
  padding: 0,
  marginTop: token('space.200', '24px'),
  flexDirection: 'column',
});

function StatelessElementBrowser(props: StatelessElementBrowserProps) {
  const { items, onSelectItem, onInsertItem, viewMoreItem } = props;

  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  const [columnCount, setColumnCount] = useState(1);
  const {
    selectedItemIndex,
    focusedItemIndex,
    setFocusedItemIndex,
    focusOnSearch,
    focusOnViewMore,
    onKeyDown,
    setFocusOnSearch,
  } = useSelectAndFocusOnArrowNavigation(
    items.length - 1,
    columnCount,
    !!viewMoreItem,
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
  const selectedItem =
    selectedItemIndex !== undefined ? items[selectedItemIndex] : null;
  const onItemsEnterKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return;
      }
      if (onInsertItem && selectedItem != null) {
        onInsertItem(selectedItem);
      }
      e.preventDefault();
    },
    [onInsertItem, selectedItem],
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

  return (
    <div css={wrapper} data-testid="element-browser">
      <ContainerWidthMonitor />
      {containerWidth < DEVICE_BREAKPOINT_NUMBERS.medium ? (
        <MobileBrowser
          {...props}
          selectedItemIndex={selectedItemIndex}
          focusedItemIndex={focusedItemIndex}
          setFocusedItemIndex={setFocusedItemIndex}
          focusOnSearch={focusOnSearch}
          setColumnCount={setColumnCount}
          setFocusOnSearch={setFocusOnSearch}
          onKeyPress={onItemsEnterKeyPress}
          onKeyDown={onKeyDown}
          viewMoreItem={viewMoreItem}
          focusOnViewMore={focusOnViewMore}
        />
      ) : (
        <DesktopBrowser
          {...props}
          selectedItemIndex={selectedItemIndex}
          focusedItemIndex={focusedItemIndex}
          setFocusedItemIndex={setFocusedItemIndex}
          focusOnSearch={focusOnSearch}
          setColumnCount={setColumnCount}
          setFocusOnSearch={setFocusOnSearch}
          onKeyPress={onItemsEnterKeyPress}
          onKeyDown={onKeyDown}
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
  focusOnSearch,
  focusOnViewMore,
  setColumnCount,
  setFocusOnSearch,
  onKeyPress,
  onKeyDown,
  searchTerm,
  createAnalyticsEvent,
  emptyStateHandler,
  viewMoreItem,
}: StatelessElementBrowserProps &
  SelectedItemProps & {
    focusOnSearch: boolean;
    focusOnViewMore: boolean;
    setFocusOnSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    setFocusedItemIndex: (index: number) => void;
    setColumnCount: (columnCount: number) => void;
  }) {
  return (
    <div
      css={mobileElementBrowserContainer}
      onKeyDown={onKeyDown}
      data-testid="mobile__element-browser"
    >
      <div
        css={
          showCategories
            ? [mobileSideBar, mobileSideBarShowCategories]
            : mobileSideBar
        }
      >
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
          setColumnCount={setColumnCount}
          createAnalyticsEvent={createAnalyticsEvent}
          emptyStateHandler={emptyStateHandler}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
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
  focusOnSearch,
  setColumnCount,
  setFocusOnSearch,
  onKeyPress,
  onKeyDown,
  searchTerm,
  createAnalyticsEvent,
  emptyStateHandler,
}: StatelessElementBrowserProps &
  SelectedItemProps & {
    focusOnSearch: boolean;
    setFocusOnSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    setFocusedItemIndex: (index: number) => void;
    setColumnCount: (columnCount: number) => void;
  }) {
  return (
    <div css={elementBrowserContainer} data-testid="desktop__element-browser">
      {showCategories && (
        <div css={showCategories ? sideBarShowCategories : sideBar}>
          <h2
            css={sidebarHeading}
            data-testid="sidebar-heading"
            id="sidebar-heading"
          >
            <FormattedMessage
              id="fabric.editor.elementbrowser.sidebar.heading"
              defaultMessage="Browse"
              description="Sidebar heading"
            />
          </h2>

          {/*eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */}
          <nav
            role="tablist"
            aria-labelledby="sidebar-heading"
            css={categoryListWrapper}
          >
            <CategoryList
              categories={categories}
              onSelectCategory={onSelectCategory}
              selectedCategory={selectedCategory}
              createAnalyticsEvent={createAnalyticsEvent}
            />
          </nav>
        </div>
      )}
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
          setColumnCount={setColumnCount}
          createAnalyticsEvent={createAnalyticsEvent}
          emptyStateHandler={emptyStateHandler}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
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
