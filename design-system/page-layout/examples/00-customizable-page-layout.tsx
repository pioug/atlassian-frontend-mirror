/** @jsx jsx */
import { Fragment, useState } from 'react';

import { CSSObject, jsx } from '@emotion/core';

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
} from '../src';

type SlotName =
  | 'Banner'
  | 'TopNavigation'
  | 'LeftPanel'
  | 'LeftSidebar'
  | 'Main'
  | 'RightSidebar'
  | 'RightPanel';
type ToggleElProps = {
  onChange: () => void;
  value: boolean;
  name?: SlotName;
  id?: string;
};
interface InitialState {
  isBannerShown: boolean;
  isTopNavigationShown: boolean;
  isLeftPanelShown: boolean;
  isLeftSidebarShown: boolean;
  isMainShown: boolean;
  isRightSidebarShown: boolean;
  isRightPanelShown: boolean;
  isBannerFixed: boolean;
  isTopNavigationFixed: boolean;
  isLeftPanelFixed: boolean;
  isLeftPanelScrollable: boolean;
  isLeftSidebarFixed: boolean;
  isLeftSidebarScrollable: boolean;
  isMainScrollable: boolean;
  isMainExtraWide: boolean;
  isRightSidebarFixed: boolean;
  isRightSidebarScrollable: boolean;
  isRightPanelFixed: boolean;
  isRightPanelScrollable: boolean;
}
type InitialStateKeys = keyof InitialState;

const scrollableContentCSS = {
  height: '2rem',
  width: '80%',
  backgroundColor: 'papayawhip',
  margin: '2rem auto',
  boxSizing: 'border-box',
  borderRadius: 3,
} as CSSObject;

const ScrollableContent = () => {
  const arr = new Array(50);
  return <Fragment>{arr.fill(<div css={scrollableContentCSS} />)}</Fragment>;
};

const ToggleFixed = ({ onChange, value }: ToggleElProps) => (
  <label htmlFor="chckbx1" css={{ display: 'block', whiteSpace: 'nowrap' }}>
    <input
      id="chckbx1"
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
      checked={value}
    />
    Toggle fixed
  </label>
);

const ToggleShown = ({ onChange, value, name, id }: ToggleElProps) => (
  <label htmlFor={id} css={{ display: 'block' }}>
    <input
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
      id={id}
    />
    {`${value ? 'Hide' : 'Show'} ${name}`}
  </label>
);

const ToggleScrollableContent = ({ onChange, value }: ToggleElProps) => (
  <Fragment>
    <label htmlFor="chckbx2" css={{ display: 'block', whiteSpace: 'nowrap' }}>
      <input
        id="chckbx2"
        type="checkbox"
        onChange={onChange}
        value={value.toString()}
        checked={value}
      />
      Toggle scrollable content
    </label>
    {value && <ScrollableContent />}
  </Fragment>
);

const ToggleExtraWide = ({ onChange, value }: ToggleElProps) => (
  <Fragment>
    <label htmlFor="chckbx3" css={{ display: 'block', whiteSpace: 'nowrap' }}>
      <input
        id="chckbx3"
        type="checkbox"
        onChange={onChange}
        value={value.toString()}
        checked={value}
      />
      Toggle extra-wide content
    </label>
    {value && (
      <img
        src="https://picsum.photos/seed/picsum/1600"
        alt="wide placeholder"
        title="wide placeholder image"
      />
    )}
  </Fragment>
);

const Wrapper = ({
  borderColor,
  children,
  noOutline,
  noHorizontalScrollbar,
}: {
  borderColor: string;
  children: React.ReactNode;
  noOutline?: boolean;
  noHorizontalScrollbar?: boolean;
}) => (
  <div
    css={{
      outline: noOutline ? 'none' : `2px dashed ${borderColor}`,
      outlineOffset: -4,
      padding: 8,
      height: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: noHorizontalScrollbar ? 'hidden' : 'auto',
      backgroundColor: 'white',
    }}
  >
    {children}
  </div>
);

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

  const toggleFixed = (slotName: SlotName) => {
    setGridState({
      ...gridState,
      [`is${slotName}Fixed`]: !gridState[
        `is${slotName}Fixed` as InitialStateKeys
      ],
    });
  };
  const toggleScrollable = (slotName: SlotName) => {
    setGridState({
      ...gridState,
      [`is${slotName}Scrollable`]: !gridState[
        `is${slotName}Scrollable` as InitialStateKeys
      ],
    });
  };
  const toggleShown = (slotName: SlotName) => {
    setGridState({
      ...gridState,
      [`is${slotName}Shown`]: !gridState[
        `is${slotName}Shown` as InitialStateKeys
      ],
    });
  };

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
          <Wrapper borderColor="gold">
            <h3 css={{ textAlign: 'center' }}>Banner</h3>
            <b>
              Visit the first focusable element on the page to see the skip
              links menu
            </b>
            <ToggleFixed
              onChange={() => toggleFixed('Banner')}
              value={gridState.isBannerFixed}
            />
          </Wrapper>
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
          <Wrapper borderColor="blue">
            <h3 css={{ textAlign: 'center' }}>TopNavigation</h3>
            <ToggleFixed
              onChange={() => toggleFixed('TopNavigation')}
              value={gridState.isTopNavigationFixed}
            />
          </Wrapper>
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
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>LeftPanel</h3>
            <ToggleFixed
              onChange={() => toggleFixed('LeftPanel')}
              value={gridState.isLeftPanelFixed}
            />
            <ToggleScrollableContent
              onChange={() => toggleScrollable('LeftPanel')}
              value={gridState.isLeftPanelScrollable}
            />
          </Wrapper>
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
            <Wrapper borderColor="darkgreen">
              <div css={{ minWidth: 50, padding: '0 20px' }}>
                <h3 css={{ textAlign: 'center' }}>LeftSidebar</h3>
                <ToggleFixed
                  onChange={() => toggleFixed('LeftSidebar')}
                  value={gridState.isLeftSidebarFixed}
                />
                <ToggleScrollableContent
                  onChange={() => toggleScrollable('LeftSidebar')}
                  value={gridState.isLeftSidebarScrollable}
                />
              </div>
            </Wrapper>
          </LeftSidebarWithoutResize>
        )}
        {gridState.isMainShown && (
          <Main testId="main" id="main" skipLinkTitle="Main Content">
            <Wrapper borderColor="black">
              <h3 css={{ textAlign: 'center' }}>Main</h3>
              <ToggleExtraWide
                onChange={() =>
                  setGridState({
                    ...gridState,
                    isMainExtraWide: !gridState.isMainExtraWide,
                  })
                }
                value={gridState.isMainExtraWide}
              />
              <ToggleScrollableContent
                onChange={() => toggleScrollable('Main')}
                value={gridState.isMainScrollable}
              />
            </Wrapper>
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
            <Wrapper borderColor="darkgreen">
              <h3 css={{ textAlign: 'center' }}>RightSidebar</h3>
              <ToggleFixed
                onChange={() => toggleFixed('RightSidebar')}
                value={gridState.isRightSidebarFixed}
              />
              <ToggleScrollableContent
                onChange={() => toggleScrollable('RightSidebar')}
                value={gridState.isRightSidebarScrollable}
              />
            </Wrapper>
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
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>RightPanel</h3>
            <ToggleFixed
              onChange={() => toggleFixed('RightPanel')}
              value={gridState.isRightPanelFixed}
            />
            <ToggleScrollableContent
              onChange={() => toggleScrollable('RightPanel')}
              value={gridState.isRightPanelScrollable}
            />
          </Wrapper>
        </RightPanel>
      )}
      <div
        css={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translate(-50%)',
          backgroundColor: 'white',
          padding: '1rem',
          border: '1px solid lightgray',
          zIndex: 2,
          borderRadius: 3,
        }}
      >
        <ToggleShown
          name="Banner"
          onChange={() => toggleShown('Banner')}
          value={gridState.isBannerShown}
          id="toggle-banner"
        />
        <ToggleShown
          name="TopNavigation"
          onChange={() => toggleShown('TopNavigation')}
          value={gridState.isTopNavigationShown}
          id="toggle-top-navigation"
        />
        <ToggleShown
          name="LeftPanel"
          onChange={() => toggleShown('LeftPanel')}
          value={gridState.isLeftPanelShown}
          id="toggle-left-panel"
        />
        <ToggleShown
          name="LeftSidebar"
          onChange={() => toggleShown('LeftSidebar')}
          value={gridState.isLeftSidebarShown}
          id="toggle-left-sidebar"
        />
        <ToggleShown
          name="Main"
          onChange={() => toggleShown('Main')}
          value={gridState.isMainShown}
          id="toggle-main"
        />
        <ToggleShown
          name="RightSidebar"
          onChange={() => toggleShown('RightSidebar')}
          value={gridState.isRightSidebarShown}
          id="toggle-right-sidebar"
        />
        <ToggleShown
          name="RightPanel"
          onChange={() => toggleShown('RightPanel')}
          value={gridState.isRightPanelShown}
          id="toggle-right-panel"
        />
      </div>
    </PageLayout>
  );
};

export default BasicGrid;
