/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
  Banner,
  BANNER_HEIGHT,
  Content,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  LeftPanel,
  LeftSidebar,
  Main,
  PageLayout,
  RIGHT_PANEL_WIDTH,
  RIGHT_SIDEBAR_WIDTH,
  RightPanel,
  RightSidebar,
  TOP_NAVIGATION_HEIGHT,
  TopNavigation,
} from '../src';

import {
  ScrollableContent,
  SlotLabel,
  SlotWrapper,
  Toggle,
  ToggleBox,
} from './common';

type SlotName =
  | 'Banner'
  | 'TopNavigation'
  | 'LeftPanel'
  | 'LeftSidebar'
  | 'Main'
  | 'RightSidebar'
  | 'RightPanel';

const serverRenderedStyles = css({
  height: 'auto',
  position: 'absolute',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  top: `calc(${TOP_NAVIGATION_HEIGHT} + ${BANNER_HEIGHT})`,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  right: `calc(${RIGHT_PANEL_WIDTH} + ${RIGHT_SIDEBAR_WIDTH})`,
  bottom: 0,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  left: `calc(${LEFT_PANEL_WIDTH} + ${LEFT_SIDEBAR_WIDTH})`,
  backgroundColor: token('color.background.neutral.subtle', 'white'),
  transition: 'left 300ms',
});

const draggingStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [`[data-is-sidebar-dragging] &`]: {
    transition: 'none',
  },
});

const ServerRenderedPage = () => {
  return (
    <SlotWrapper
      borderColor={token('color.border', 'black')}
      css={[serverRenderedStyles, draggingStyles]}
    >
      Server rendered page. Added as a sibling to Grid componenet
    </SlotWrapper>
  );
};

const initialState = {
  isBannerShown: true,
  isTopNavigationShown: true,
  isLeftPanelShown: true,
  isLeftSidebarShown: true,
  isRightSidebarShown: true,
  isRightPanelShown: true,
  isBannerFixed: false,
  isTopNavigationFixed: false,
  isLeftPanelFixed: false,
  isLeftPanelScrollable: false,
  isLeftSidebarFixed: false,
  isLeftSidebarScrollable: false,
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
          id={`${slotName}--shown`}
          onChange={() =>
            setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
          }
          isChecked={!gridState[gridKey]}
        >{`${gridState[gridKey] ? 'Hide' : 'Show'} ${slotName}`}</Toggle>
      );
    },
    [gridState],
  );

  return (
    <Fragment>
      <PageLayout>
        {gridState.isBannerShown && (
          <Banner isFixed={gridState.isBannerFixed}>
            <SlotWrapper
              borderColor={token('color.border.accent.yellow', 'gold')}
            >
              <SlotLabel>Banner</SlotLabel>
              <ToggleFixed slotName="Banner" />
            </SlotWrapper>
          </Banner>
        )}
        {gridState.isTopNavigationShown && (
          <TopNavigation isFixed={gridState.isTopNavigationFixed}>
            <SlotWrapper
              borderColor={token('color.border.accent.blue', 'blue')}
            >
              <SlotLabel>TopNavigation</SlotLabel>
              <ToggleFixed slotName="TopNavigation" />
            </SlotWrapper>
          </TopNavigation>
        )}
        {gridState.isLeftPanelShown && (
          <LeftPanel isFixed={gridState.isLeftPanelFixed}>
            <SlotWrapper
              borderColor={token('color.border.accent.orange', 'orange')}
            >
              <SlotLabel>LeftPanel</SlotLabel>
              <ToggleFixed slotName="LeftPanel" />
              <ToggleScrollable slotName="LeftPanel" />
            </SlotWrapper>
          </LeftPanel>
        )}
        <Content>
          {gridState.isLeftSidebarShown && (
            <LeftSidebar isFixed={gridState.isLeftSidebarFixed}>
              <SlotWrapper
                borderColor={token('color.border.accent.green', 'darkgreen')}
              >
                <SlotLabel>LeftSidebar</SlotLabel>
                <ToggleFixed slotName="LeftSidebar" />
                <ToggleScrollable slotName="LeftSidebar" />
              </SlotWrapper>
            </LeftSidebar>
          )}
          <Main>{''}</Main>
          {gridState.isRightSidebarShown && (
            <RightSidebar isFixed={gridState.isRightSidebarFixed} width={200}>
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
          <RightPanel isFixed={gridState.isRightPanelFixed} width={200}>
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
          <ToggleShown slotName="RightSidebar" />
          <ToggleShown slotName="RightPanel" />
        </ToggleBox>
      </PageLayout>
      <ServerRenderedPage />
    </Fragment>
  );
};

export default BasicGrid;
