/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
  Banner,
  Content,
  LeftPanel,
  LeftSidebar,
  LeftSidebarState,
  Main,
  PageLayout,
  RightPanel,
  RightSidebar,
  TopNavigation,
} from '../../src';
import {
  ExpandLeftSidebarKeyboardShortcut,
  ScrollableContent,
  SlotLabel,
  SlotWrapper,
  Toggle,
  ToggleBox,
} from '../common';

type SlotName =
  | 'Banner'
  | 'TopNavigation'
  | 'LeftPanel'
  | 'LeftSidebar'
  | 'Main'
  | 'RightSidebar'
  | 'RightPanel'
  | 'PageLayout';

const initialState = {
  isBannerShown: false,
  isTopNavigationShown: true,
  isLeftPanelShown: false,
  isLeftSidebarShown: true,
  isMainShown: true,
  isRightSidebarShown: false,
  isRightPanelShown: false,
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
  isPageLayoutShown: true,
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
            data-toggle-scrollable
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
          isChecked={gridState[gridKey] !== initialState[gridKey]}
        >{`${gridState[gridKey] ? 'Unmount' : 'Mount'} ${slotName}`}</Toggle>
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
    <Fragment>
      {gridState.isPageLayoutShown && (
        <PageLayout
          onLeftSidebarExpand={(state: LeftSidebarState) =>
            console.log('onExpand', state)
          }
          onLeftSidebarCollapse={(state: LeftSidebarState) =>
            console.log('onCollapse', state)
          }
        >
          {gridState.isBannerShown && (
            <Banner height={60} isFixed={gridState.isBannerFixed}>
              <SlotWrapper
                borderColor={token('color.border.accent.yellow', 'gold')}
              >
                <SlotLabel>Banner</SlotLabel>
                <ToggleFixed slotName="Banner" />
              </SlotWrapper>
            </Banner>
          )}
          {gridState.isTopNavigationShown && (
            <TopNavigation height={60} isFixed={gridState.isTopNavigationFixed}>
              <SlotWrapper
                borderColor={token('color.border.accent.blue', 'blue')}
              >
                <SlotLabel>TopNavigation</SlotLabel>
                <ToggleFixed slotName="TopNavigation" />
              </SlotWrapper>
            </TopNavigation>
          )}
          {gridState.isLeftPanelShown && (
            <LeftPanel isFixed={gridState.isLeftPanelFixed} width={200}>
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
              <LeftSidebar
                testId="left-sidebar"
                id="left-sidebar"
                skipLinkTitle="Project Navigation"
                isFixed={gridState.isLeftSidebarFixed}
                onResizeStart={(state: LeftSidebarState) =>
                  console.log('onResizeStart', state)
                }
                onResizeEnd={(state: LeftSidebarState) =>
                  console.log('onResizeEnd', state)
                }
                onFlyoutExpand={() => console.log('onFlyoutExpand')}
                onFlyoutCollapse={() => console.log('onFlyoutCollapse')}
                resizeGrabAreaLabel="Resize Current project sidebar"
                resizeButtonLabel="Current project sidebar"
                valueTextLabel="Width"
                // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
                overrides={{
                  ResizeButton: {
                    render: (Component, props) => (
                      <Tooltip
                        content={'Left Sidebar'}
                        hideTooltipOnClick
                        position="right"
                        testId="tooltip"
                      >
                        <Component {...props} />
                      </Tooltip>
                    ),
                  },
                }}
              >
                <SlotWrapper hasExtraPadding hasHorizontalScrollbar={false}>
                  <SlotLabel>LeftSidebar</SlotLabel>
                  <ToggleFixed slotName="LeftSidebar" />
                  <ToggleScrollable slotName="LeftSidebar" />
                </SlotWrapper>

                <ExpandLeftSidebarKeyboardShortcut />
              </LeftSidebar>
            )}
            {gridState.isMainShown && (
              <Main id="main" skipLinkTitle="Main">
                <SlotWrapper>
                  <SlotLabel>Main</SlotLabel>
                  <ToggleExtraWide />
                  <ToggleScrollable slotName="Main" />
                </SlotWrapper>
              </Main>
            )}
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
        </PageLayout>
      )}
      <ToggleBox>
        <ToggleShown slotName="Banner" />
        <ToggleShown slotName="TopNavigation" />
        <ToggleShown slotName="LeftPanel" />
        <ToggleShown slotName="LeftSidebar" />
        <ToggleShown slotName="Main" />
        <ToggleShown slotName="RightSidebar" />
        <ToggleShown slotName="RightPanel" />
        <ToggleShown slotName="PageLayout" />
      </ToggleBox>
    </Fragment>
  );
};
export default BasicGrid;
