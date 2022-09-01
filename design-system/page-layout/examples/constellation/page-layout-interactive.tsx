/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
  Banner,
  Content,
  LeftPanel,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  RightSidebar,
  TopNavigation,
} from '../../src';
import {
  ScrollableContent,
  SlotLabel,
  SlotWrapper,
  Toggle,
  ToggleBox,
  toKebabCase,
} from '../common';

type SlotName =
  | 'Banner'
  | 'TopNavigation'
  | 'LeftPanel'
  | 'LeftSidebar'
  | 'Main'
  | 'RightSidebar'
  | 'RightPanel';

const initialState = {
  isBannerShown: true,
  isTopNavigationShown: true,
  isLeftPanelShown: true,
  isLeftSidebarShown: true,
  isMainShown: true,
  isRightSidebarShown: true,
  isRightPanelShown: true,
  isBannerFixed: true,
  isTopNavigationFixed: true,
  isLeftPanelFixed: false,
  isLeftPanelScrollable: false,
  isLeftSidebarFixed: true,
  isLeftSidebarScrollable: false,
  isMainScrollable: false,
  isMainExtraWide: false,
  isRightSidebarFixed: false,
  isRightSidebarScrollable: false,
  isRightPanelFixed: false,
  isRightPanelScrollable: false,
};

const BasicGrid = () => {
  const [gridState, setGridState] = useState(initialState);

  const ToggleFixed = useCallback(
    ({ slotName }: { slotName: SlotName }) => {
      const gridKey = `is${slotName}Fixed` as keyof typeof gridState;
      return (
        <Toggle
          id={`${slotName}--fixed`}
          isChecked={gridState[gridKey]}
          onChange={() =>
            setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
          }
        >
          Toggle fixed
        </Toggle>
      );
    },
    [gridState],
  );

  const ToggleScrollable = useCallback(
    ({ slotName }: { slotName: SlotName }) => {
      const gridKey = `is${slotName}Scrollable` as keyof typeof gridState;
      return (
        <Fragment>
          <Toggle
            id={`${slotName}--scrollable`}
            isChecked={gridState[gridKey]}
            onChange={() =>
              setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
            }
          >
            Toggle scrollable content
          </Toggle>
          {gridState[gridKey] && <ScrollableContent />}
        </Fragment>
      );
    },
    [gridState],
  );

  const ToggleShown = useCallback(
    ({ slotName }: { slotName: SlotName }) => {
      const gridKey = `is${slotName}Shown` as keyof typeof gridState;
      return (
        <Toggle
          id={`toggle-${toKebabCase(slotName)}`}
          onChange={() =>
            setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
          }
          isChecked={!gridState[gridKey]}
        >{`${gridState[gridKey] ? 'Hide' : 'Show'} ${slotName}`}</Toggle>
      );
    },
    [gridState],
  );

  const ToggleExtraWide = useCallback(
    () => (
      <Fragment>
        <Toggle
          id={`toggle--extra-wide`}
          onChange={() =>
            setGridState({
              ...gridState,
              isMainExtraWide: !gridState.isMainExtraWide,
            })
          }
          isChecked={gridState.isMainExtraWide}
        >
          Toggle extra-wide content
        </Toggle>
        {gridState.isMainExtraWide && (
          <img
            src="https://picsum.photos/seed/picsum/1600"
            alt="wide placeholder"
            title="wide placeholder image"
          />
        )}
      </Fragment>
    ),
    [gridState],
  );

  return (
    <PageLayout>
      {gridState.isBannerShown && (
        <Banner
          testId="banner"
          id="banner"
          skipLinkTitle="Banner"
          height={100}
          isFixed={gridState.isBannerFixed}
        >
          <SlotWrapper
            borderColor={token('color.border.accent.yellow', 'gold')}
          >
            <SlotLabel>Banner</SlotLabel>
            <b>
              Visit the first focusable element on the page to see the skip
              links menu
            </b>
            <ToggleFixed slotName="Banner" />
          </SlotWrapper>
        </Banner>
      )}
      {gridState.isTopNavigationShown && (
        <TopNavigation
          testId="topNavigation"
          id="top-navigation"
          skipLinkTitle="Top Navigation"
          height={60}
          isFixed={gridState.isTopNavigationFixed}
        >
          <SlotWrapper borderColor={token('color.border.accent.blue', 'blue')}>
            <SlotLabel>TopNavigation</SlotLabel>
            <ToggleFixed slotName="TopNavigation" />
          </SlotWrapper>
        </TopNavigation>
      )}
      {gridState.isLeftPanelShown && (
        <LeftPanel
          testId="leftPanel"
          id="left-panel"
          skipLinkTitle="Left Panel"
          isFixed={gridState.isLeftPanelFixed}
          width={200}
        >
          <SlotWrapper
            borderColor={token('color.border.accent.orange', 'orange')}
          >
            <SlotLabel>LeftPanel</SlotLabel>
            <ToggleFixed slotName="LeftPanel" />
            <ToggleScrollable slotName="LeftPanel" />
          </SlotWrapper>
        </LeftPanel>
      )}
      <Content testId="content">
        {gridState.isLeftSidebarShown && (
          <LeftSidebarWithoutResize
            testId="leftSidebar"
            id="left-sidebar"
            skipLinkTitle="Left Sidebar"
            isFixed={gridState.isLeftSidebarFixed}
            width={250}
          >
            <SlotWrapper
              borderColor={token('color.border.accent.green', 'darkgreen')}
              hasExtraPadding
            >
              <SlotLabel>LeftSidebar</SlotLabel>
              <ToggleFixed slotName="LeftSidebar" />
              <ToggleScrollable slotName="LeftSidebar" />
            </SlotWrapper>
          </LeftSidebarWithoutResize>
        )}
        {gridState.isMainShown && (
          <Main testId="main" id="main" skipLinkTitle="Main Content">
            <SlotWrapper borderColor={token('color.border', 'black')}>
              <SlotLabel>Main</SlotLabel>
              <ToggleExtraWide />
              <ToggleScrollable slotName="Main" />
            </SlotWrapper>
          </Main>
        )}
        {gridState.isRightSidebarShown && (
          <RightSidebar
            testId="rightSidebar"
            id="right-sidebar"
            skipLinkTitle="Right Sidebar"
            isFixed={gridState.isRightSidebarFixed}
            width={200}
          >
            <SlotWrapper
              borderColor={token('color.border.accent.green', 'darkgreen')}
            >
              <SlotLabel>RightSidebar</SlotLabel>
              <ToggleFixed slotName="RightSidebar" />
              <ToggleScrollable slotName="RightSidebar" />
            </SlotWrapper>
          </RightSidebar>
        )}
      </Content>
      {gridState.isRightPanelShown && (
        <RightPanel
          testId="rightPanel"
          id="right-panel"
          skipLinkTitle="Right Panel"
          isFixed={gridState.isRightPanelFixed}
          width={200}
        >
          <SlotWrapper
            borderColor={token('color.border.accent.orange', 'orange')}
          >
            <SlotLabel>RightPanel</SlotLabel>
            <ToggleFixed slotName="RightPanel" />
            <ToggleScrollable slotName="RightPanel" />
          </SlotWrapper>
        </RightPanel>
      )}
      <ToggleBox>
        <ToggleShown slotName="Banner" />
        <ToggleShown slotName="TopNavigation" />
        <ToggleShown slotName="LeftPanel" />
        <ToggleShown slotName="LeftSidebar" />
        <ToggleShown slotName="Main" />
        <ToggleShown slotName="RightSidebar" />
        <ToggleShown slotName="RightPanel" />
      </ToggleBox>
    </PageLayout>
  );
};

export default BasicGrid;
