/** @jsx jsx */
import { Fragment, useState } from 'react';

import { CSSObject, jsx } from '@emotion/core';

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
};
interface InitialState {
  isBannerShown: true;
  isTopNavigationShown: true;
  isLeftPanelShown: true;
  isLeftSidebarShown: true;
  isRightSidebarShown: true;
  isRightPanelShown: true;
  isBannerFixed: false;
  isTopNavigationFixed: false;
  isLeftPanelFixed: false;
  isLeftPanelScrollable: false;
  isLeftSidebarFixed: false;
  isLeftSidebarScrollable: false;
  isRightSidebarFixed: false;
  isRightSidebarScrollable: false;
  isRightPanelFixed: false;
  isRightPanelScrollable: false;
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
  <label htmlFor="chckbx1" css={{ display: 'block' }}>
    <input
      id="chckbx1"
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
    />
    Toggle fixed
  </label>
);

const ToggleShown = ({
  onChange,
  value,
  name,
}: ToggleElProps & { name: string }) => (
  <label htmlFor="chckbx2" css={{ display: 'block' }}>
    <input
      id="chckbx2"
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
    />
    {`${value ? 'Hide' : 'Show'} ${name}`}
  </label>
);

const ToggleScrollableContent = ({ onChange, value }: ToggleElProps) => (
  <Fragment>
    <label htmlFor="chckbx3" css={{ display: 'block' }}>
      <input
        id="chckbx3"
        type="checkbox"
        onChange={onChange}
        value={value.toString()}
      />
      Toggle scrollable content
    </label>
    {value && <ScrollableContent />}
  </Fragment>
);

const Wrapper = ({
  borderColor,
  children,
}: {
  borderColor: string;
  children: React.ReactNode;
}) => (
  <div
    css={{
      outline: `2px dashed ${borderColor}`,
      outlineOffset: -4,
      padding: 8,
      height: '100%',
      boxSizing: 'border-box',
      backgroundColor: 'white',
    }}
  >
    {children}
  </div>
);

const serverRenderedStyles: CSSObject = {
  position: 'absolute',
  top: `calc(${TOP_NAVIGATION_HEIGHT} + ${BANNER_HEIGHT})`,
  left: `calc(${LEFT_PANEL_WIDTH} + ${LEFT_SIDEBAR_WIDTH})`,
  bottom: 0,
  right: `calc(${RIGHT_PANEL_WIDTH} + ${RIGHT_SIDEBAR_WIDTH})`,
  backgroundColor: 'white',
  transition: 'left 300ms',
  [`[data-is-sidebar-dragging] &`]: {
    transition: 'none',
  },
};
const ServerRenderedPage = () => {
  return (
    <div
      css={serverRenderedStyles}
      style={{ outline: '1px dashed black', outlineOffset: -4, padding: 8 }}
    >
      Server rendered page. Added as a sibling to Grid componenet
    </div>
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
    <Fragment>
      <PageLayout>
        {gridState.isBannerShown && (
          <Banner isFixed={gridState.isBannerFixed}>
            <Wrapper borderColor="gold">
              <h3 css={{ textAlign: 'center' }}>Banner</h3>
              <ToggleFixed
                onChange={() => toggleFixed('Banner')}
                value={gridState.isBannerFixed}
              />
            </Wrapper>
          </Banner>
        )}
        {gridState.isTopNavigationShown && (
          <TopNavigation isFixed={gridState.isTopNavigationFixed}>
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
          <LeftPanel isFixed={gridState.isLeftPanelFixed}>
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
        <Content>
          {gridState.isLeftSidebarShown && (
            <LeftSidebar>
              <Wrapper borderColor="darkgreen">
                <h3 css={{ textAlign: 'center' }}>LeftSidebar</h3>
                <ToggleFixed
                  onChange={() => toggleFixed('LeftSidebar')}
                  value={gridState.isLeftSidebarFixed}
                />
                <ToggleScrollableContent
                  onChange={() => toggleScrollable('LeftSidebar')}
                  value={gridState.isLeftSidebarScrollable}
                />
              </Wrapper>
            </LeftSidebar>
          )}
          <Main>{''}</Main>
          {gridState.isRightSidebarShown && (
            <RightSidebar isFixed={gridState.isRightSidebarFixed} width={200}>
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
          <RightPanel isFixed={gridState.isRightPanelFixed} width={200}>
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
            borderRadius: 3,
            zIndex: 1,
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
      <ServerRenderedPage />
    </Fragment>
  );
};

export default BasicGrid;
