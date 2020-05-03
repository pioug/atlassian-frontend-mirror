import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  Banner,
  Content,
  LeftPanel,
  LeftSidebar,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  RightSidebar,
  TopNavigation,
} from '../../index';

import { getDimension } from './__utils__/get-dimension';

const emptyGridState = {};
describe('<PageLayout />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // This is no longer a requirement?
  it('should reset localStorage when it is unmounted', () => {
    const { unmount } = render(
      <PageLayout testId="grid">
        <Banner testId="component" isFixed height={50}>
          Contents
        </Banner>
        <TopNavigation testId="component" height={50}>
          Contents
        </TopNavigation>
        <LeftPanel width={300}>Left Panel</LeftPanel>
        <Content>
          <RightSidebar testId="component" width={200}>
            Contents
          </RightSidebar>
          <Main>Main content</Main>
          <LeftSidebar testId="component" width={200}>
            Contents
          </LeftSidebar>
        </Content>
        <RightPanel width={300}>Right Panel</RightPanel>
      </PageLayout>,
    );
    unmount();

    expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
      JSON.stringify({
        isLeftSidebarCollapsed: false,
        expandedLeftSidebarWidth: 200,
      }),
    );
  });

  describe('<Banner />', () => {
    it('should render with the height passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Banner testId="component" height={50}>
            Contents
          </Banner>
        </PageLayout>,
      );

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'height',
        'var(--bannerHeight)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--bannerHeight:50px;}'),
      );
    });

    it('should hydrate with the the height passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Banner testId="component" height={50}>
            Contents
          </Banner>
        </PageLayout>,
        { hydrate: true },
      );

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'height',
        'var(--bannerHeight)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--bannerHeight:50px;}'),
      );
    });

    it('should be "fixed" when isFixed prop is passed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Banner testId="component" isFixed height={50}>
            Contents
          </Banner>
        </PageLayout>,
      );

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'position',
        'fixed',
      );
    });

    it('should store the width in localStorage on mount', () => {
      render(
        <PageLayout testId="grid">
          <Banner testId="component" isFixed height={50}>
            Contents
          </Banner>
        </PageLayout>,
      );

      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({
          gridState: {
            bannerHeight: 50,
          },
        }),
      );
    });

    it('should remove the height in localStorage on unmount', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <Banner testId="component" isFixed height={50}>
            Contents
          </Banner>
        </PageLayout>,
      );

      unmount();
      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({ ...emptyGridState }),
      );
    });

    it('should respect the shouldPersistWidth prop', () => {
      const { rerender } = render(
        <PageLayout testId="grid">
          <Banner testId="component" isFixed height={200} shouldPersistHeight>
            Contents
          </Banner>
        </PageLayout>,
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--bannerHeight:200px;}'),
      );

      rerender(
        <PageLayout testId="grid">
          <Banner testId="component" isFixed height={50} shouldPersistHeight>
            Contents
          </Banner>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--bannerHeight:200px;}'),
      );
    });
  });

  describe('<TopNavigation />', () => {
    it('should render with the height passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <TopNavigation testId="component" height={50}>
            Contents
          </TopNavigation>
        </PageLayout>,
      );

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'height',
        'var(--topNavigationHeight)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--topNavigationHeight:50px;}'),
      );
    });

    it('should hydrate with the the height passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <TopNavigation testId="component" height={50}>
            Contents
          </TopNavigation>
        </PageLayout>,
        { hydrate: true },
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'height',
        'var(--topNavigationHeight)',
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--topNavigationHeight:50px;}'),
      );
    });

    it('should be "fixed" when isFixed prop is passed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <TopNavigation isFixed testId="component" height={50}>
            Contents
          </TopNavigation>
        </PageLayout>,
      );

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'position',
        'fixed',
      );
    });

    it('should store the height in localStorage on mount', () => {
      render(
        <PageLayout testId="grid">
          <TopNavigation testId="component" isFixed height={50}>
            Contents
          </TopNavigation>
        </PageLayout>,
      );

      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({
          gridState: {
            topNavigationHeight: 50,
          },
        }),
      );
    });

    it('should remove the height in localStorage on unmount', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <TopNavigation testId="component" isFixed height={50}>
            Contents
          </TopNavigation>
        </PageLayout>,
      );

      unmount();
      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({ ...emptyGridState }),
      );
    });

    it('should respect the shouldPersistWidth prop', () => {
      const { rerender } = render(
        <PageLayout testId="grid">
          <TopNavigation
            testId="component"
            isFixed
            height={200}
            shouldPersistHeight
          >
            Contents
          </TopNavigation>
        </PageLayout>,
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--topNavigationHeight:200px;}'),
      );

      rerender(
        <PageLayout testId="grid">
          <TopNavigation
            testId="component"
            isFixed
            height={50}
            shouldPersistHeight
          >
            Contents
          </TopNavigation>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--topNavigationHeight:200px;}'),
      );
    });
  });

  describe('<LeftPanel />', () => {
    it('should render with the width passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <LeftPanel testId="component" width={200}>
            Contents
          </LeftPanel>
        </PageLayout>,
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'grid-area',
        'left-panel',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftPanelWidth:200px;}'),
      );
    });

    it('should hydrate with the width passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <LeftPanel testId="component" width={200}>
            Contents
          </LeftPanel>
        </PageLayout>,
        { hydrate: true },
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'grid-area',
        'left-panel',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftPanelWidth:200px;}'),
      );
    });

    it('should be "fixed" when isFixed prop is passed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <LeftPanel isFixed testId="component" width={200}>
            Contents
          </LeftPanel>
        </PageLayout>,
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'position',
        'fixed',
      );
    });

    it('should store the width in localStorage on mount', () => {
      render(
        <PageLayout testId="grid">
          <LeftPanel testId="component" isFixed width={50}>
            Contents
          </LeftPanel>
        </PageLayout>,
      );

      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({
          gridState: {
            leftPanelWidth: 50,
          },
        }),
      );
    });

    it('should remove the height in localStorage on unmount', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <LeftPanel testId="component" isFixed width={50}>
            Contents
          </LeftPanel>
        </PageLayout>,
      );

      unmount();
      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({ ...emptyGridState }),
      );
    });

    it('should respect the shouldPersistWidth prop', () => {
      const { rerender } = render(
        <PageLayout testId="grid">
          <LeftPanel testId="component" isFixed width={200}>
            Contents
          </LeftPanel>
        </PageLayout>,
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftPanelWidth:200px;}'),
      );

      rerender(
        <PageLayout testId="grid">
          <LeftPanel testId="component" isFixed width={50} shouldPersistWidth>
            Contents
          </LeftPanel>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftPanelWidth:200px;}'),
      );
    });

    // TODO add test for flyout behaviour DST-266
  });

  describe('<RightPanel />', () => {
    it('should render with width passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <RightPanel testId="component" width={200}>
            Contents
          </RightPanel>
        </PageLayout>,
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'grid-area',
        'right-panel',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightPanelWidth:200px;}'),
      );
    });

    it('should hydrate with the width passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <RightPanel testId="component" width={200}>
            Contents
          </RightPanel>
        </PageLayout>,
        { hydrate: true },
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'grid-area',
        'right-panel',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightPanelWidth:200px;}'),
      );
    });

    it('should be "fixed" when isFixed prop is passed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <RightPanel isFixed testId="component" width={200}>
            Contents
          </RightPanel>
        </PageLayout>,
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'position',
        'fixed',
      );
    });

    it('should store the width in localStorage on mount', () => {
      render(
        <PageLayout testId="grid">
          <RightPanel testId="component" isFixed width={50}>
            Contents
          </RightPanel>
        </PageLayout>,
      );

      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({
          gridState: {
            rightPanelWidth: 50,
          },
        }),
      );
    });

    it('should remove the height in localStorage on unmount', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <RightPanel testId="component" isFixed width={50}>
            Contents
          </RightPanel>
        </PageLayout>,
      );

      unmount();
      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({ ...emptyGridState }),
      );
    });

    it('should respect the shouldPersistWidth prop', () => {
      const { rerender } = render(
        <PageLayout testId="grid">
          <RightPanel testId="component" isFixed width={200}>
            Contents
          </RightPanel>
        </PageLayout>,
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightPanelWidth:200px;}'),
      );

      rerender(
        <PageLayout testId="grid">
          <RightPanel testId="component" isFixed width={50} shouldPersistWidth>
            Contents
          </RightPanel>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightPanelWidth:200px;}'),
      );
    });
  });

  describe('<LeftSidebar />', () => {
    describe('flyout behaviour', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        document.documentElement.removeAttribute('data-is-flyout-open');
        document.documentElement.removeAttribute('data-is-sidebar-collapsed');
        localStorage.setItem(
          'PAGE_LAYOUT_UI_STATE',
          JSON.stringify({
            isLeftSidebarCollapsed: true,
          }),
        );
      });

      it('should NOT mount the LeftSidebarWithoutResize in collapsed mode if already collapsed previously', () => {
        render(
          <PageLayout testId="grid">
            <Main>
              <LeftSidebarWithoutResize testId="component" width={200}>
                Contents
              </LeftSidebarWithoutResize>
            </Main>
          </PageLayout>,
        );

        expect(
          document.documentElement.dataset.isSidebarCollapsed,
        ).toBeUndefined();
        expect(getDimension('leftSidebarWidth')).toBe('200px');
      });

      it('should NOT bind any mouse events to LeftSidebarWithoutResize', () => {
        const { getByTestId } = render(
          <PageLayout testId="grid">
            <Main>
              <LeftSidebarWithoutResize testId="component" width={200}>
                Contents
              </LeftSidebarWithoutResize>
            </Main>
          </PageLayout>,
        );

        fireEvent.mouseEnter(getByTestId('component'));
        jest.runAllTimers();
        expect(
          document.documentElement.dataset.isSidebarCollapsed,
        ).toBeUndefined();
        expect(document.documentElement.dataset.isFlyoutOpen).toBeUndefined();

        fireEvent.mouseLeave(getByTestId('component'));
        jest.runAllTimers();
        expect(
          document.documentElement.dataset.isSidebarCollapsed,
        ).toBeUndefined();
        expect(document.documentElement.dataset.isFlyoutOpen).toBeUndefined();
      });

      it('should mount the LeftSidebar in collapsed mode if already collapsed previously', () => {
        render(
          <PageLayout testId="grid">
            <Main>
              <LeftSidebar testId="component" width={200}>
                Contents
              </LeftSidebar>
            </Main>
          </PageLayout>,
        );

        expect(document.documentElement.dataset.isSidebarCollapsed).toBe(
          'true',
        );
        expect(getDimension('leftSidebarWidth')).toBe('20px');
      });

      it('should expand flyout when mouse enters the LeftSidebar', () => {
        const { getByTestId } = render(
          <PageLayout testId="grid">
            <Main>
              <LeftSidebar testId="component" width={200}>
                Contents
              </LeftSidebar>
            </Main>
          </PageLayout>,
        );

        fireEvent.mouseEnter(getByTestId('component'));
        jest.runAllTimers();
        expect(document.documentElement.dataset.isSidebarCollapsed).toBe(
          'true',
        );
        expect(document.documentElement.dataset.isFlyoutOpen).toBe('true');
      });

      it('should collapse flyout when mouse leaves the LeftSidebar', () => {
        const { getByTestId } = render(
          <PageLayout testId="grid">
            <Main>
              <LeftSidebar testId="component" width={200}>
                Contents
              </LeftSidebar>
            </Main>
          </PageLayout>,
        );

        fireEvent.mouseEnter(getByTestId('component'));
        jest.runAllTimers();
        expect(document.documentElement.dataset.isSidebarCollapsed).toBe(
          'true',
        );
        expect(document.documentElement.dataset.isFlyoutOpen).toBe('true');

        fireEvent.mouseLeave(getByTestId('component'));
        jest.runAllTimers();
        expect(document.documentElement.dataset.isSidebarCollapsed).toBe(
          'true',
        );
        expect(document.documentElement.dataset.isFlyoutOpen).toBeUndefined();
      });
    });

    // Will be added as part of https://product-fabric.atlassian.net/browse/DST-368
    /* it('should call onFlyoutExpand and onFlyoutCollapse callbacks', () => { */
    /*   const onFlyoutExpand = jest.fn(); */
    /*   const onFlyoutCollapse = jest.fn(); */
    /*   const { getByTestId } = render( */
    /*     <PageLayout testId="grid"> */
    /*       <Main> */
    /*         <LeftSidebar */
    /*           testId="component" */
    /*           width={200} */
    /*           onFlyoutExpand={onFlyoutExpand} */
    /*           onFlyoutCollapse={onFlyoutCollapse} */
    /*         > */
    /*           Contents */
    /*         </LeftSidebar> */
    /*       </Main> */
    /*     </PageLayout>, */
    /*   ); */

    /*   fireEvent.mouseEnter(getByTestId('component')); */
    /*   jest.runAllTimers(); */
    /*   expect(onFlyoutExpand).toHaveBeenCalledTimes(1); */

    /*   fireEvent.mouseLeave(getByTestId('component')); */
    /*   jest.runAllTimers(); */
    /*   expect(onFlyoutCollapse).toHaveBeenCalledTimes(1); */
    /* }); */

    it('should render with the width that was passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={200}>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftSidebarWidth:200px;}'),
      );
    });

    it('should hydrate with the width that was passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={200}>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
        { hydrate: true },
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftSidebarWidth:200px;}'),
      );
    });

    it('should be "fixed" when isFixed prop is passed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={200} isFixed>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'position',
        'fixed',
      );
    });

    it('should store the width in localStorage on mount', () => {
      render(
        <PageLayout testId="grid">
          <LeftSidebar testId="component" isFixed width={50}>
            Contents
          </LeftSidebar>
        </PageLayout>,
      );

      expect(JSON.parse(localStorage.getItem('PAGE_LAYOUT_UI_STATE')!)).toEqual(
        {
          gridState: {
            leftSidebarWidth: 50,
          },
          isLeftSidebarCollapsed: false,
          expandedLeftSidebarWidth: 50,
        },
      );
    });

    it('should remove the height in localStorage on unmount', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <LeftSidebar testId="component" isFixed width={50}>
            Contents
          </LeftSidebar>
        </PageLayout>,
      );

      unmount();
      expect(JSON.parse(localStorage.getItem('PAGE_LAYOUT_UI_STATE')!)).toEqual(
        {
          ...emptyGridState,
          isLeftSidebarCollapsed: false,
          expandedLeftSidebarWidth: 50,
        },
      );
    });

    it('should respect the shouldPersistWidth prop', () => {
      const { rerender } = render(
        <PageLayout testId="grid">
          <LeftSidebar testId="component" isFixed width={200}>
            Contents
          </LeftSidebar>
        </PageLayout>,
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftSidebarWidth:200px;}'),
      );

      rerender(
        <PageLayout testId="grid">
          <LeftSidebar testId="component" isFixed width={50} shouldPersistWidth>
            Contents
          </LeftSidebar>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftSidebarWidth:200px;}'),
      );
    });
  });

  describe('<RightSidebar />', () => {
    it('should respect the shouldPersistWidth prop', () => {
      const { rerender } = render(
        <PageLayout testId="grid">
          <RightSidebar testId="component" isFixed width={200}>
            Contents
          </RightSidebar>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
      );

      rerender(
        <PageLayout testId="grid">
          <RightSidebar
            testId="component"
            isFixed
            width={50}
            shouldPersistWidth
          >
            Contents
          </RightSidebar>
        </PageLayout>,
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
      );
    });

    it('should render with the width that was passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <RightSidebar testId="component" width={200}>
              Contents
            </RightSidebar>
          </Main>
        </PageLayout>,
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--rightSidebarWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
      );
    });

    it('should hydrate with the width that was passed to it', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <RightSidebar testId="component" width={200}>
              Contents
            </RightSidebar>
          </Main>
        </PageLayout>,
        { hydrate: true },
      );
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--rightSidebarWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
      );
    });

    it('should be "fixed" when isFixed prop is passed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <RightSidebar testId="component" width={200} isFixed>
              Contents
            </RightSidebar>
          </Main>
        </PageLayout>,
      );
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'position',
        'fixed',
      );
    });

    it('should store the width in localStorage on mount', () => {
      render(
        <PageLayout testId="grid">
          <RightSidebar testId="component" isFixed width={50}>
            Contents
          </RightSidebar>
        </PageLayout>,
      );

      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({
          gridState: {
            rightSidebarWidth: 50,
          },
        }),
      );
    });

    it('should remove the height in localStorage on unmount', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <RightSidebar testId="component" isFixed width={50}>
            Contents
          </RightSidebar>
        </PageLayout>,
      );

      unmount();
      expect(localStorage.getItem('PAGE_LAYOUT_UI_STATE')).toEqual(
        JSON.stringify({ ...emptyGridState }),
      );
    });
  });

  describe('<Main />', () => {
    it('should take up all space between the sidebars', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left" width={200}>
              Contents
            </LeftSidebar>
            <Main testId="main">Main content</Main>
            <RightSidebar testId="right" width={200}>
              Contents
            </RightSidebar>
          </Content>
        </PageLayout>,
      );

      expect(getByTestId('main')).toHaveStyleDeclaration('flex-grow', '1');
      expect(getByTestId('left')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(getByTestId('right')).toHaveStyleDeclaration(
        'width',
        'var(--rightSidebarWidth)',
      );
    });
  });

  describe('<Content />', () => {
    it('should take up all space between the panels', () => {
      render(
        <PageLayout testId="grid">
          <Content testId="content">
            <LeftPanel width={200}>left panel</LeftPanel>
            <Main testId="main">Main</Main>
            <RightPanel width={200}>Right panel</RightPanel>
          </Content>
        </PageLayout>,
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(
          'grid-template-columns:var(--leftPanelWidth) minmax(0,1fr) var(--rightPanelWidth);',
        ),
      );

      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--leftPanelWidth:200px;}'),
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining(':root{--rightPanelWidth:200px;}'),
      );
    });
  });
});
