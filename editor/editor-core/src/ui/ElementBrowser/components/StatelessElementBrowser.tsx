import React, { memo, useState, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  fireAnalyticsEvent,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
} from '../../../plugins/analytics';
import ElementList from './ElementList/ElementList';
import CategoryList from './CategoryList';
import ElementSearch from './ElementSearch';
import {
  DEVICE_BREAKPOINT_NUMBERS,
  GRID_SIZE,
  INLINE_SIDEBAR_HEIGHT,
  SIDEBAR_HEADING_PADDING_LEFT,
  SIDEBAR_HEADING_WRAPPER_HEIGHT,
  SIDEBAR_WIDTH,
} from '../constants';

import useContainerWidth from '../hooks/use-container-width';
import useSelectAndFocusOnArrowNavigation from '../hooks/use-select-and-focus-on-arrow-navigation';
import { Category, Modes, SelectedItemProps } from '../types';
import { EmptyStateHandler } from '../../../types/empty-state-handler';

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
} & WithAnalyticsEventsProps;

function StatelessElementBrowser(props: StatelessElementBrowserProps) {
  const { items, onSelectItem } = props;

  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  const [columnCount, setColumnCount] = useState(1);
  const {
    selectedItemIndex,
    focusedItemIndex,
    setFocusedItemIndex,
    focusOnSearch,
    onKeyDown,
    setFocusOnSearch,
  } = useSelectAndFocusOnArrowNavigation(items.length - 1, columnCount);

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
  const onItemsEnterKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return;
      }
      props.onInsertItem(items[selectedItemIndex]);
    },
    [props, items, selectedItemIndex],
  );

  /**
   * On arrow key selection and clicks the selectedItemIndex will change.
   * Making sure to update parent component.
   */
  const selectedItem = items[selectedItemIndex];
  useEffect(() => {
    if (onSelectItem && selectedItem != null) {
      onSelectItem(selectedItem);
    }
  }, [onSelectItem, selectedItem]);

  return (
    <Wrapper data-testid="element-browser">
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-height: inherit;
  overflow: hidden;
`;

Wrapper.displayName = 'Wrapper';

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
    <MobileElementBrowserContainer
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      data-testid="mobile__element-browser"
    >
      <MobileSideBar showCategories={showCategories}>
        {showSearch && (
          <ElementSearch
            onSearch={onSearch}
            mode={mode}
            focus={focusOnSearch}
            onClick={setFocusOnSearch}
            searchTerm={searchTerm}
          />
        )}
        {showCategories && (
          <MobileCategoryListWrapper tabIndex={-1}>
            <CategoryList
              categories={categories}
              onSelectCategory={onSelectCategory}
              selectedCategory={selectedCategory}
            />
          </MobileCategoryListWrapper>
        )}
      </MobileSideBar>
      <MobileMainContent>
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
      </MobileMainContent>
    </MobileElementBrowserContainer>
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
    <ElementBrowserContainer data-testid="desktop__element-browser">
      {showCategories && (
        <SideBar showCategories>
          <SidebarHeading>
            <FormattedMessage
              id="fabric.editor.elementbrowser.sidebar.heading"
              defaultMessage="Browse"
              description="Sidebar heading"
            />
          </SidebarHeading>
          <CategoryListWrapper>
            <CategoryList
              categories={categories}
              onSelectCategory={onSelectCategory}
              selectedCategory={selectedCategory}
              createAnalyticsEvent={createAnalyticsEvent}
            />
          </CategoryListWrapper>
        </SideBar>
      )}
      <MainContent onKeyPress={onKeyPress} onKeyDown={onKeyDown}>
        {showSearch && (
          <SearchContainer>
            <ElementSearch
              onSearch={onSearch}
              mode={mode}
              focus={focusOnSearch}
              onClick={setFocusOnSearch}
              searchTerm={searchTerm}
            />
          </SearchContainer>
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
      </MainContent>
    </ElementBrowserContainer>
  );
}

const baseBrowserContainerStyles = css`
  display: flex;
  height: 100%;
  /** Needed for Safari to work with current css.
  * 100% heights wont work and
  * will default to auto if one of the containers doesn't have a specified height in pixels.
  * Setting the min-height to fill available fits safari's needs and the above 100% height works on the rest of the browsers.
  */
  min-height: -webkit-fill-available;
`;

const MobileElementBrowserContainer = styled.div`
  ${baseBrowserContainerStyles};
  flex-direction: column;
`;
MobileElementBrowserContainer.displayName = 'MobileElementBrowserContainer';

const ElementBrowserContainer = styled.div`
  ${baseBrowserContainerStyles};
  flex-direction: row;
`;

type SideBarType = {
  showCategories: boolean;
};

const baseSidebarStyles = css`
  display: flex;
  flex-direction: column;

  overflow-x: auto;
  overflow-y: hidden;
`;

const MobileSideBar = styled.div`
  ${baseSidebarStyles};
  flex: 0 0
    ${({ showCategories }: SideBarType) =>
      showCategories ? 'auto' : INLINE_SIDEBAR_HEIGHT};
  padding: 12px 12px 0 12px;
`;

const SideBar = styled.div`
  ${baseSidebarStyles};
  flex: 0 0
    ${({ showCategories }: SideBarType) =>
      showCategories ? SIDEBAR_WIDTH : 'auto'};
`;

const SidebarHeading = styled.h2`
  flex: 0 0 ${SIDEBAR_HEADING_WRAPPER_HEIGHT};
  display: inline-flex;
  align-items: center;
  padding-left: ${SIDEBAR_HEADING_PADDING_LEFT};
  font-weight: 700;
`;

/**
 *  In enzyme styled components show up as styled.element
 *  and if we don't wanna export SidebarHeading just for testing.
 *  https://github.com/styled-components/styled-components/issues/896
 */
SidebarHeading.displayName = 'SidebarHeading';

const MobileMainContent = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  height: 100%;
`;

const MainContent = styled(MobileMainContent)`
  margin-left: ${GRID_SIZE * 2}px;
  // Needed for safari
  height: auto;
`;

MainContent.displayName = 'MainContent';

const SearchContainer = styled.div`
  padding-bottom: ${GRID_SIZE * 2}px;
`;

const MobileCategoryListWrapper = styled.nav`
  display: flex;
  overflow-x: auto;

  padding: ${GRID_SIZE}px 0 ${GRID_SIZE * 2}px 0;
  min-height: ${GRID_SIZE * 4}px;

  overflow: -moz-scrollbars-none;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const CategoryListWrapper = styled(MobileCategoryListWrapper)`
  padding: 0;
  margin-top: ${GRID_SIZE * 3}px;
  flex-direction: column;
`;

const MemoizedElementBrowser = memo(
  withAnalyticsContext({
    source: 'ElementBrowser',
  })(withAnalyticsEvents()(StatelessElementBrowser)),
);

export default MemoizedElementBrowser;
