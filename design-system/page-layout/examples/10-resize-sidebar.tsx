/** @jsx jsx */
import { FC, Fragment, useCallback, useEffect, useState } from 'react';

import { CSSObject, jsx } from '@emotion/core';

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
  usePageLayoutResize,
} from '../src';

type SlotName =
  | 'Banner'
  | 'TopNavigation'
  | 'LeftPanel'
  | 'LeftSidebar'
  | 'Main'
  | 'RightSidebar'
  | 'RightPanel'
  | 'PageLayout';
type ToggleElProps = {
  onChange: () => void;
  value: boolean;
  name?: SlotName;
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
  isPageLayoutShown: boolean;
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
  // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for
  <label css={{ display: 'block', whiteSpace: 'nowrap' }}>
    <input
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
      checked={value}
    />
    Toggle fixed
  </label>
);

const ToggleShown = ({ onChange, value, name }: ToggleElProps) => (
  <label htmlFor="chckbx1" css={{ display: 'block' }}>
    <input
      id="chckbx1"
      type="checkbox"
      onChange={onChange}
      value={value.toString()}
    />
    {`${value ? 'Unmount' : 'Mount'} ${name}`}
  </label>
);

const ToggleScrollableContent = ({ onChange, value }: ToggleElProps) => (
  <Fragment>
    <label htmlFor="chckbx2" css={{ display: 'block', whiteSpace: 'nowrap' }}>
      <input
        id="chckbx2"
        data-toggle-scrollable
        type="checkbox"
        onChange={onChange}
        value={value.toString()}
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

const ExpandKeyboardShortcut: FC = () => {
  const {
    isLeftSidebarCollapsed,
    expandLeftSidebar,
    collapseLeftSidebar,
  } = usePageLayoutResize();

  const toggleSidebarCollapse = useCallback(() => {
    if (isLeftSidebarCollapsed) {
      expandLeftSidebar();
    } else {
      collapseLeftSidebar();
    }
  }, [isLeftSidebarCollapsed, expandLeftSidebar, collapseLeftSidebar]);

  useEffect(() => {
    const toggle = (event: KeyboardEvent) => {
      if (event.which === 219) {
        toggleSidebarCollapse();
      }
    };

    document.addEventListener('keydown', toggle);

    return () => {
      document.removeEventListener('keydown', toggle);
    };
  }, [toggleSidebarCollapse]);

  return null;
};

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
            <TopNavigation height={60} isFixed={gridState.isTopNavigationFixed}>
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
            <LeftPanel isFixed={gridState.isLeftPanelFixed} width={200}>
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
              <LeftSidebar
                testId="left-sidebar"
                id="left-sidebar"
                skipLinkTitle="Left sidebar"
                isFixed={gridState.isLeftSidebarFixed}
                onResizeStart={(state: LeftSidebarState) =>
                  console.log('onResizeStart', state)
                }
                onResizeEnd={(state: LeftSidebarState) =>
                  console.log('onResizeEnd', state)
                }
                onFlyoutExpand={() => console.log('onFlyoutExpand')}
                onFlyoutCollapse={() => console.log('onFlyoutCollapse')}
                overrides={{
                  ResizeButton: {
                    render: (Component, props) => (
                      <Tooltip
                        content={
                          props.isLeftSidebarCollapsed ? 'Expand' : 'Collapse'
                        }
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
                <Wrapper
                  noOutline
                  noHorizontalScrollbar
                  borderColor="darkgreen"
                >
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
                <ExpandKeyboardShortcut />
              </LeftSidebar>
            )}
            {gridState.isMainShown && (
              <Main id="main" skipLinkTitle="Main">
                <Wrapper noOutline borderColor="black">
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
        </PageLayout>
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
        <ToggleShown
          name="PageLayout"
          onChange={() => toggleShown('PageLayout')}
          value={gridState.isPageLayoutShown}
        />
      </div>
    </Fragment>
  );
};
export default BasicGrid;
