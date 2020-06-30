import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import CategoryItems from './components/CategoryItems';
import CategoryList from './components/CategoryList';
import ElementSearch from './components/ElementSearch';
import {
  DEVICE_BREAKPOINT_NUMBERS,
  GRID_SIZE,
  INLINE_SIDEBAR_HEIGHT,
  SIDEBAR_HEADING_PADDING_LEFT,
  SIDEBAR_HEADING_TEXT,
  SIDEBAR_HEADING_WRAPPER_HEIGHT,
  SIDEBAR_WIDTH,
} from './constants';
import useContainerWidth from './hooks/useContainerWidth';
import { Category, Modes } from './types';

export interface StatelessElementBrowserProps {
  items: QuickInsertItem[];
  categories: Category[];
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
  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
  return (
    <Wrapper>
      <ContainerWidthMonitor />
      {containerWidth < DEVICE_BREAKPOINT_NUMBERS.medium ? (
        <MobileBrowser {...props} />
      ) : (
        <DesktopBrowser {...props} />
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

function MobileBrowser({
  showCategories,
  showSearch,
  onSearch,
  mode,
  categories,
  onSelectCategory,
  items,
  onSelectItem,
  onEnterKeyPress,
  selectedCategory,
}: StatelessElementBrowserProps) {
  return (
    <MobileElementBrowserContainer>
      <MobileSideBar showCategories={showCategories}>
        {showSearch && <ElementSearch onSearch={onSearch} mode={mode} />}
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
        <CategoryItems
          items={items}
          mode={mode}
          onSelectItem={onSelectItem}
          onEnterKeyPress={onEnterKeyPress}
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
  onEnterKeyPress,
  selectedCategory,
}: StatelessElementBrowserProps) {
  return (
    <ElementBrowserContainer>
      {showCategories && (
        <SideBar showCategories>
          <SideBarHeading>{SIDEBAR_HEADING_TEXT}</SideBarHeading>
          <CategoryListWrapper>
            <CategoryList
              categories={categories}
              onSelectCategory={onSelectCategory}
              selectedCategory={selectedCategory}
            />
          </CategoryListWrapper>
        </SideBar>
      )}
      <MainContent>
        {showSearch && (
          <SearchContainer>
            <ElementSearch onSearch={onSearch} mode={mode} />
          </SearchContainer>
        )}
        <CategoryItems
          items={items}
          mode={mode}
          onSelectItem={onSelectItem}
          onEnterKeyPress={onEnterKeyPress}
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
  padding: ${GRID_SIZE}px;
  padding-top: 0;
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

const SideBarHeading = styled.h2`
  flex: 0 0 ${SIDEBAR_HEADING_WRAPPER_HEIGHT};
  display: inline-flex;
  align-items: center;
  padding-left: ${SIDEBAR_HEADING_PADDING_LEFT};
  font-weight: 700;
`;

/**
 *  In enzyme styled components show up as styled.element
 *  and if we don't wanna export SideBarHeading just for testing.
 *  https://github.com/styled-components/styled-components/issues/896
 */
SideBarHeading.displayName = 'SideBarHeading';

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

const SearchContainer = styled.div`
  padding-bottom: ${GRID_SIZE * 3}px;
`;

const MobileCategoryListWrapper = styled.nav`
  display: flex;
  overflow-x: auto;

  padding: ${GRID_SIZE}px 0;

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
