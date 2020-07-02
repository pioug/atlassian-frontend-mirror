/* eslint-disable jsx-a11y/aria-role */
/** @jsx jsx */
import { Fragment, useState } from 'react';

import { jsx } from '@emotion/core';

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
  isMainExtraWide: boolean;
}
type InitialStateKeys = keyof InitialState;

const DummyContent = () => {
  return (
    <Fragment>
      <button>Dummy content 1</button>
      <button>Dummy content 2</button>
      <button>Dummy content 3</button>
    </Fragment>
  );
};

const ToggleShown = ({ onChange, value, name, id }: ToggleElProps) => (
  <label css={{ display: 'block' }}>
    <input
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
      id={id}
    />
    {`${value ? 'Hide' : 'Show'} ${name}`}
  </label>
);

const ToggleExtraWide = ({ onChange, value }: ToggleElProps) => (
  <Fragment>
    <label css={{ display: 'block', whiteSpace: 'nowrap' }}>
      <input
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
    data-wrapper-element
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
  isMainExtraWide: false,
};
const BasicGrid = () => {
  const [gridState, setGridState] = useState(initialState);

  const toggleShown = (slotName: SlotName) => {
    setGridState({
      ...gridState,
      [`is${slotName}Shown`]: !gridState[
        `is${slotName}Shown` as InitialStateKeys
      ],
    });
  };

  return (
    <PageLayout skipLinksLabel="Jump to section">
      {gridState.isBannerShown && (
        <Fragment>
          <Banner
            testId="banner"
            height={60}
            id="banner"
            skipLinkTitle="Banner"
          >
            <Wrapper borderColor="gold">
              <h3 css={{ textAlign: 'center' }}>Banner</h3>
              <DummyContent />
            </Wrapper>
          </Banner>
        </Fragment>
      )}
      {gridState.isTopNavigationShown && (
        <Fragment>
          <TopNavigation
            testId="topNavigation"
            height={60}
            id="top-navigation"
            skipLinkTitle="Top navigation"
          >
            <Wrapper borderColor="blue">
              <h3 css={{ textAlign: 'center' }}>TopNavigation</h3>
              <DummyContent />
            </Wrapper>
          </TopNavigation>
        </Fragment>
      )}
      {gridState.isLeftPanelShown && (
        <LeftPanel
          testId="leftPanel"
          width={200}
          id="left-panel"
          skipLinkTitle="Left panel"
        >
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>LeftPanel</h3>
            <DummyContent />
          </Wrapper>
        </LeftPanel>
      )}
      <Content testId="content">
        {gridState.isLeftSidebarShown && (
          <LeftSidebarWithoutResize
            testId="leftSidebar"
            width={250}
            id="left-sidebar"
            skipLinkTitle="Left sidebar"
          >
            <Wrapper borderColor="darkgreen">
              <div css={{ minWidth: 50, padding: '0 20px' }}>
                <h3 css={{ textAlign: 'center' }}>LeftSidebar</h3>
                <DummyContent />
              </div>
            </Wrapper>
          </LeftSidebarWithoutResize>
        )}
        {gridState.isMainShown && (
          <Fragment>
            <Main testId="main" id="main" skipLinkTitle="Main">
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
                <DummyContent />
              </Wrapper>
            </Main>
          </Fragment>
        )}
        {gridState.isRightSidebarShown && (
          <RightSidebar
            testId="rightSidebar"
            width={200}
            id="right-sidebar"
            skipLinkTitle="Right sidebar"
          >
            <Wrapper borderColor="darkgreen">
              <h3 css={{ textAlign: 'center' }}>RightSidebar</h3>
              <DummyContent />
            </Wrapper>
          </RightSidebar>
        )}
      </Content>
      {gridState.isRightPanelShown && (
        <RightPanel
          testId="rightPanel"
          width={200}
          id="right-panel"
          skipLinkTitle="Right panel"
        >
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>RightPanel</h3>
            <DummyContent />
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
        />
        <ToggleShown
          name="TopNavigation"
          onChange={() => toggleShown('TopNavigation')}
          value={gridState.isTopNavigationShown}
        />
        <ToggleShown
          name="LeftPanel"
          onChange={() => toggleShown('LeftPanel')}
          value={gridState.isLeftPanelShown}
        />
        <ToggleShown
          name="LeftSidebar"
          onChange={() => toggleShown('LeftSidebar')}
          value={gridState.isLeftSidebarShown}
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
        />
        <ToggleShown
          name="RightPanel"
          onChange={() => toggleShown('RightPanel')}
          value={gridState.isRightPanelShown}
        />
      </div>
    </PageLayout>
  );
};

export default BasicGrid;
