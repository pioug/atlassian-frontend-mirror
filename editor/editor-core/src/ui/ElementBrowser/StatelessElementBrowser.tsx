import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import WidthDetector from '@atlaskit/width-detector';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { CategoryType, Modes } from './types';
import ElementSearch from './components/ElementSearch';
import CategoryList from './components/CategoryList';
import CategoryItems from './components/CategoryItems';
import {
  DEVICE_BREAKPOINT_NUMBERS,
  GRID_SIZE,
  INLINE_SIDEBAR_HEIGHT,
  SIDEBAR_HEADING_PADDING_LEFT,
  SIDEBAR_HEADING_TEXT,
  SIDEBAR_HEADING_WRAPPER_HEIGHT,
  SIDEBAR_WIDTH,
} from './constants';

interface StatelessElementBrowserProps {
  items: QuickInsertItem[];
  categories: Partial<CategoryType>[];
  onSearch: (searchTerm: string) => void;
  onSelectCategory: (category: Partial<CategoryType>) => void;
  onSelectItem?: (item: QuickInsertItem) => void;
  onEnter: (item: QuickInsertItem) => void;
  onClickItem: (item: QuickInsertItem) => void;
  showSearch: boolean;
  showCategories: boolean;
  mode: keyof typeof Modes;
}

const StatelessElementBrowser = ({
  categories,
  items,
  onSearch,
  onSelectCategory,
  showCategories,
  showSearch,
  mode,
}: StatelessElementBrowserProps) => {
  return (
    <WidthDetector containerStyle={widthDetectorStyle}>
      {(width?: number) => {
        if (width && width < DEVICE_BREAKPOINT_NUMBERS.medium) {
          return (
            <MobileElementBrowserContainer>
              <MobileSideBar showCategories={showCategories}>
                {showSearch && (
                  <div>
                    <ElementSearch onSearch={onSearch} mode={mode} />
                  </div>
                )}
                {showCategories && (
                  <MobileCategoryListWrapper>
                    <CategoryList
                      categories={categories}
                      onSelect={onSelectCategory}
                    />
                  </MobileCategoryListWrapper>
                )}
              </MobileSideBar>
              <MobileMainContent>
                <CategoryItems items={items} mode={mode} />
              </MobileMainContent>
            </MobileElementBrowserContainer>
          );
        }
        return (
          <ElementBrowserContainer>
            {showCategories && (
              <SideBar showCategories>
                <SideBarHeading>{SIDEBAR_HEADING_TEXT}</SideBarHeading>
                <CategoryListWrapper>
                  <CategoryList
                    categories={categories}
                    onSelect={onSelectCategory}
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
              <CategoryItems items={items} mode={mode} />
            </MainContent>
          </ElementBrowserContainer>
        );
      }}
    </WidthDetector>
  );
};

const widthDetectorStyle = {
  height: '100%',
  maxHeight: 'inherit',
  overflow: 'hidden',
};

const baseBrowserContainerStyles = css`
  display: flex;
  height: 100%;
  max-height: inherit;
`;

const MobileElementBrowserContainer = styled.div`
  ${baseBrowserContainerStyles};
  flex-direction: column;
`;

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
`;

const MobileMainContent = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  overflow: -moz-scrollbars-none;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  /** Needed for Safari to work with current css.
  * For some reason, specified 100% height in parent containers didn't work and
  * the content still overflows in safari.
  */
  max-height: -webkit-fill-available;
`;

const MainContent = styled(MobileMainContent)`
  padding: ${GRID_SIZE * 3}px 0;
`;

const SearchContainer = styled.div`
  padding-bottom: ${GRID_SIZE * 3}px;
`;

const MobileCategoryListWrapper = styled.nav`
  display: flex;
  overflow-x: auto;
`;

const CategoryListWrapper = styled(MobileCategoryListWrapper)`
  flex-direction: column;
`;

const MemoizedElementBrowser = memo(StatelessElementBrowser);

export default MemoizedElementBrowser;
