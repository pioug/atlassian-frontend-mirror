import React, { memo, useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import ElementList, { itemStepCounter } from './components/ElementList';
import CategoryList from './components/CategoryList';
import ElementSearch from './components/ElementSearch';
import {
  DEVICE_BREAKPOINT_NUMBERS,
  GRID_SIZE,
  INLINE_SIDEBAR_HEIGHT,
  SIDEBAR_HEADING_PADDING_LEFT,
  SIDEBAR_HEADING_WRAPPER_HEIGHT,
  SIDEBAR_WIDTH,
} from './constants';
import useContainerWidth from './hooks/useContainerWidth';
import useSelectAndFocusOnArrowNavigation from './hooks/useSelectAndFocusOnArrowNavigation';
import { Category, Modes, SelectedItemProps } from './types';

export interface StatelessElementBrowserProps {
  categories?: Category[];
  items: QuickInsertItem[];
  onSearch: (searchTerm: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectItem: (item: QuickInsertItem) => void;
  onEnterKeyPress: (item: QuickInsertItem) => void;
  selectedCategory?: string;
  showSearch: boolean;
  showCategories: boolean;
  mode: keyof typeof Modes;
}

function StatelessElementBrowser(props: StatelessElementBrowserProps) {
  const { items, onEnterKeyPress } = props;

  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  const [itemsContainerWidth, setItemsContainerWidth] = useState(0);
  const {
    selectedItemIndex,
    focusedItemIndex,
    setFocusedItemIndex,
    focusOnSearch,
    onKeyDown,
    setFocusOnSearch,
  } = useSelectAndFocusOnArrowNavigation(
    items.length - 1,
    itemStepCounter(itemsContainerWidth),
  );

  /* Only for hitting enter to select item when focused on search bar,
   * The actual enter key press is handled on individual items level.
   */
  const onItemsEnterKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return;
      }
      onEnterKeyPress(items[selectedItemIndex]);
    },
    [onEnterKeyPress, items, selectedItemIndex],
  );

  return (
    <Wrapper>
      <ContainerWidthMonitor />
      {containerWidth < DEVICE_BREAKPOINT_NUMBERS.medium ? (
        <MobileBrowser
          {...props}
          selectedItemIndex={selectedItemIndex}
          focusedItemIndex={focusedItemIndex}
          setFocusedItemIndex={setFocusedItemIndex}
          focusOnSearch={focusOnSearch}
          setItemsContainerWidth={setItemsContainerWidth}
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
          setItemsContainerWidth={setItemsContainerWidth}
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
  height: 100%;
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
  onSelectItem,
  selectedCategory,
  selectedItemIndex,
  focusedItemIndex,
  setFocusedItemIndex,
  focusOnSearch,
  setItemsContainerWidth,
  setFocusOnSearch,
  onKeyPress,
  onKeyDown,
}: StatelessElementBrowserProps &
  SelectedItemProps & {
    focusOnSearch: boolean;
    setFocusOnSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    setFocusedItemIndex: (index: number) => void;
  }) {
  return (
    <MobileElementBrowserContainer
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
    >
      <MobileSideBar showCategories={showCategories}>
        {showSearch && (
          <ElementSearch
            onSearch={onSearch}
            mode={mode}
            focus={focusOnSearch}
            onClick={setFocusOnSearch}
          />
        )}
        {showCategories && (
          <MobileCategoryListWrapper>
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
          onSelectItem={onSelectItem}
          selectedItemIndex={selectedItemIndex}
          focusedItemIndex={focusedItemIndex}
          setFocusedItemIndex={setFocusedItemIndex}
          setItemsContainerWidth={setItemsContainerWidth}
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
  onSelectItem,
  selectedCategory,
  selectedItemIndex,
  focusedItemIndex,
  setFocusedItemIndex,
  focusOnSearch,
  setItemsContainerWidth,
  setFocusOnSearch,
  onKeyPress,
  onKeyDown,
}: StatelessElementBrowserProps &
  SelectedItemProps & {
    focusOnSearch: boolean;
    setFocusOnSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    setFocusedItemIndex: (index: number) => void;
  }) {
  return (
    <ElementBrowserContainer>
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
            />
          </SearchContainer>
        )}
        <ElementList
          items={items}
          mode={mode}
          onSelectItem={onSelectItem}
          selectedItemIndex={selectedItemIndex}
          focusedItemIndex={focusedItemIndex}
          setFocusedItemIndex={setFocusedItemIndex}
          setItemsContainerWidth={setItemsContainerWidth}
        />
      </MainContent>
    </ElementBrowserContainer>
  );
}

const baseBrowserContainerStyles = css`
  display: flex;
  height: 100%;
`;

const MobileElementBrowserContainer = styled.div`
  ${baseBrowserContainerStyles};
  max-height: inherit;
  flex-direction: column;
`;
MobileElementBrowserContainer.displayName = 'MobileElementBrowserContainer';

const ElementBrowserContainer = styled.div`
  ${baseBrowserContainerStyles};
  /**
   * For Safari, as 100% doesn't work.
   */
  max-height: fill-available;
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

  /** Needed for Safari to work with current css.
  * For some reason, specified 100% height in parent containers didn't work and
  * the content still overflows in safari.
  */
  max-height: -webkit-fill-available;
`;

const MainContent = styled(MobileMainContent)`
  margin-left: ${GRID_SIZE * 2}px;
`;

MainContent.displayName = 'MainContent';

const SearchContainer = styled.div`
  padding-bottom: ${GRID_SIZE * 3}px;
`;

const MobileCategoryListWrapper = styled.nav`
  display: flex;
  overflow-x: auto;

  padding: ${GRID_SIZE * 2}px 0 ${GRID_SIZE}px 0;
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
  margin-top: ${GRID_SIZE * 4}px;
  height: 100%;
  flex-direction: column;
`;

const MemoizedElementBrowser = memo(StatelessElementBrowser);

export default MemoizedElementBrowser;
