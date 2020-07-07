import React, { MouseEvent } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Tooltip from '@atlaskit/tooltip';

import {
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  IS_SIDEBAR_COLLAPSING,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  PAGE_LAYOUT_LS_KEY,
} from '../../../common/constants';
import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  usePageLayoutResize,
} from '../../../index';

import { getDimension } from './__utils__/get-dimension';
import * as raf from './__utils__/raf';
import { triggerTransitionEnd } from './__utils__/transition-end';

describe('Left sidebar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    raf.replace();
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  const completeAnimations = () => {
    act(() => raf.flush());
    act(() => jest.runAllTimers());
  };

  const ResizeControlledConsumer = () => {
    const {
      isLeftSidebarCollapsed,
      expandLeftSidebar,
      collapseLeftSidebar,
      leftSidebarState,
      setLeftSidebarState,
    } = usePageLayoutResize();

    const setWidth = (event: MouseEvent) => {
      setLeftSidebarState({
        ...leftSidebarState,
        leftSidebarWidth: Number((event.target as HTMLInputElement).value),
      });
    };

    return (
      <>
        <button data-testid="collapse" onClick={collapseLeftSidebar} />
        <button data-testid="expand" onClick={expandLeftSidebar} />
        <p data-testid="isLeftSidebarCollapsed">
          {String(isLeftSidebarCollapsed)}
        </p>
        <p data-testid="leftSidebar">
          {String(leftSidebarState.leftSidebarWidth)}
        </p>
        <p data-testid="lastLeftSidebarWidth">
          {String(leftSidebarState.lastLeftSidebarWidth)}
        </p>
        <input data-testid="setLeftSidebarWidth" onClick={setWidth} />
      </>
    );
  };

  describe('SidebarResizeController', () => {
    it('should return the correct "isLeftSidebarCollapsed" state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
        completeAnimations();
      });
      expect(getByTestId('isLeftSidebarCollapsed').innerText).toBe('true');

      act(() => {
        fireEvent.click(getByTestId('expand'));
        completeAnimations();
      });
      expect(getByTestId('isLeftSidebarCollapsed').innerText).toBe('false');
    });

    it('should not go into inconsistent state when expanded and collapsed quickly', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
      });
      act(() => {
        fireEvent.click(getByTestId('expand'));
      });
      triggerTransitionEnd(getByTestId('left-sidebar'));

      expect(
        document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING),
      ).toEqual(null);

      act(() => {
        fireEvent.click(getByTestId('collapse'));
      });
      act(() => {
        fireEvent.click(getByTestId('expand'));
      });
      act(() => {
        fireEvent.click(getByTestId('collapse'));
      });
      triggerTransitionEnd(getByTestId('left-sidebar'));

      expect(
        document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING),
      ).toEqual(null);
    });

    it('should add the correct data attributes while expanding and collapsing', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
      });
      expect(
        document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING),
      ).toEqual('true');

      triggerTransitionEnd(getByTestId('left-sidebar'));

      act(() => {
        fireEvent.click(getByTestId('expand'));
      });
      expect(
        document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING),
      ).toEqual(null);
    });

    it('should expand LeftSidebar when "collapseLeftSidebar" is called', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
        completeAnimations();
      });
      expect(getDimension('leftSidebarWidth')).toEqual('20px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: true }),
      );
    });

    it('should expand LeftSidebar when "expandLeftSidebar" is called', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('expand'));
        completeAnimations();
      });
      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: false }),
      );
    });

    it('should return LeftSidebar width', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getByTestId('leftSidebar').innerText).toBe('240');
      expect(getDimension('leftSidebarWidth')).toEqual('240px');
    });

    it('should set LeftSidebar width', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        (getByTestId('setLeftSidebarWidth') as HTMLInputElement).value = '349';
        fireEvent.click(getByTestId('setLeftSidebarWidth'));
      });

      expect(getByTestId('leftSidebar').innerText).toBe('349');
    });

    it('should reset flyout when expandLeftSidebar is called', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={240}>
              Contents
              <ResizeControlledConsumer />
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
        completeAnimations();
      });

      triggerTransitionEnd(getByTestId('component'));

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        completeAnimations();
      });

      expect(getByTestId('component')).toHaveStyleDeclaration('width', '20px');
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarFlyoutWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining('--leftSidebarFlyoutWidth:240px;'),
      );

      act(() => {
        fireEvent.click(getByTestId('expand'));
        completeAnimations();
      });

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
    });

    describe('prefers-reduced-motion', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: jest.fn().mockImplementation(query => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          })),
        });
      });

      afterEach(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          })),
        });
      });

      it('should expand LeftSidebar when "collapseLeftSidebar" is called', () => {
        const { getByTestId } = render(
          <PageLayout testId="grid">
            <Content>
              <LeftSidebar testId="left-sidebar" width={200}>
                LeftSidebar
                <ResizeControlledConsumer />
              </LeftSidebar>
              <Main testId="content">Main</Main>
            </Content>
          </PageLayout>,
        );

        act(() => {
          fireEvent.click(getByTestId('collapse'));
        });
        expect(getDimension('leftSidebarWidth')).toEqual('20px');
        expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
          expect.objectContaining({ isLeftSidebarCollapsed: true }),
        );
      });

      it('should collapse LeftSidebar when "expandLeftSidebar" is called', () => {
        const { getByTestId } = render(
          <PageLayout testId="grid">
            <Content>
              <LeftSidebar testId="left-sidebar" width={200}>
                LeftSidebar
                <ResizeControlledConsumer />
              </LeftSidebar>
              <Main testId="content">Main</Main>
            </Content>
          </PageLayout>,
        );

        act(() => {
          fireEvent.click(getByTestId('expand'));
        });
        expect(getDimension('leftSidebarWidth')).toEqual('240px');
        expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
          expect.objectContaining({ isLeftSidebarCollapsed: false }),
        );
      });

      it('should call onExpand callback LeftSidebar is expanded', () => {
        const fn = jest.fn();
        const { getByTestId } = render(
          <PageLayout testId="grid" onLeftSidebarExpand={fn}>
            <Content>
              <LeftSidebar testId="left-sidebar" width={200}>
                LeftSidebar
                <ResizeControlledConsumer />
              </LeftSidebar>
              <Main testId="content">Main</Main>
            </Content>
          </PageLayout>,
        );

        act(() => {
          fireEvent.click(getByTestId('collapse'));
        });
        completeAnimations();
        act(() => {
          fireEvent.click(getByTestId('expand'));
        });
        completeAnimations();

        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should call onCollapse callback when LeftSidebar is collapsed', () => {
        const fn = jest.fn();
        const { getByTestId } = render(
          <PageLayout testId="grid" onLeftSidebarCollapse={fn}>
            <Content>
              <LeftSidebar testId="left-sidebar" width={200}>
                LeftSidebar
                <ResizeControlledConsumer />
              </LeftSidebar>
              <Main testId="content">Main</Main>
            </Content>
          </PageLayout>,
        );

        act(() => {
          fireEvent.click(getByTestId('collapse'));
        });

        expect(fn).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Resize button', () => {
    it('should collapse the LeftSidebar when ResizeButton is clicked in expanded state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('20px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: true }),
      );
    });

    it('should call onCollapse callback when ResizeButton is clicked', () => {
      const fn = jest.fn();
      const { getByTestId } = render(
        <PageLayout testId="grid" onLeftSidebarCollapse={fn}>
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      triggerTransitionEnd(getByTestId('left-sidebar'));

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should expand the LeftSidebar when ResizeButton is clicked in collapsed state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={240}>
              LeftSidebar
            </LeftSidebar>
            <ResizeControlledConsumer />
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
      });
      completeAnimations();

      act(() => {
        fireEvent.click(getByTestId('left-sidebar-resize-button'));
      });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: false }),
      );
    });

    it('should call onExpand callback when ResizeButton is clicked in collapsed state', () => {
      const fn = jest.fn();
      const { getByTestId } = render(
        <PageLayout testId="grid" onLeftSidebarExpand={fn}>
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <ResizeControlledConsumer />
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('collapse'));
      });
      completeAnimations();

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      triggerTransitionEnd(getByTestId('left-sidebar'));

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should render the button within an override if given', () => {
      const { getByTestId, queryByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              overrides={{
                ResizeButton: {
                  render: (Component, props) => (
                    <Tooltip
                      content="Expand"
                      hideTooltipOnClick
                      position="right"
                      testId="tooltip"
                    >
                      <Component {...props} />
                    </Tooltip>
                  ),
                },
              }}
              width={200}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(queryByTestId('tooltip')).toBeNull();
      fireEvent.mouseOver(getByTestId('left-sidebar-resize-button'));
      completeAnimations();
      expect(getByTestId('tooltip').textContent).toBe('Expand');
    });

    // Investigate why the test fails but works fine in the browser
    it('should collapse the LeftSidebar when GrabArea is clicked in expanded state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-grab-area'));
      completeAnimations();

      // Add test to see main is animating
      expect(getDimension('leftSidebarWidth')).toEqual('20px');
    });

    it('should move the LeftSidebar when GrabArea is clicked and moved in expanded state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.mouseDown(handle, { clientX: 200 });
      fireEvent.mouseMove(document, {
        clientX: 250,
        clientY: 0,
      });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('290px');

      fireEvent.mouseUp(handle);
      completeAnimations();
    });

    it('it should call resizeStart and resizeEnd events when GrabArea is clicked and moved', () => {
      const resizeStart = jest.fn();
      const resizeEnd = jest.fn();
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={200}
              onResizeStart={resizeStart}
              onResizeEnd={resizeEnd}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.mouseDown(handle, { clientX: 200 });
      fireEvent.mouseMove(document, {
        clientX: 250,
        clientY: 0,
      });
      completeAnimations();
      expect(resizeStart).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(handle);
      completeAnimations();
      expect(resizeEnd).toHaveBeenCalledTimes(1);
    });

    it('should not move the LeftSidebar when GrabArea is clicked to the right', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      // Click 10px to the right of the the left sidebar
      fireEvent.mouseDown(handle, { clientX: 210 });
      fireEvent.mouseMove(document, {
        clientX: 210,
        clientY: 0,
      });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('240px');

      fireEvent.mouseUp(handle);
      completeAnimations();
    });

    it('should move the LeftSidebar when GrabArea is clicked to the right and moved in expanded state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      // Click 10px to the right of the the left sidebar
      fireEvent.mouseDown(handle, { clientX: 210 });
      fireEvent.mouseMove(document, {
        clientX: 210,
        clientY: 0,
      });
      fireEvent.mouseMove(document, {
        clientX: 250,
        clientY: 0,
      });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('280px');

      fireEvent.mouseUp(handle);
      completeAnimations();
    });

    it('should collapse LeftSidebar when the width is below the threshold', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={240}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.mouseDown(handle, { clientX: 240 });
      fireEvent.mouseMove(document, {
        clientX: 190,
        clientY: 0,
      });
      completeAnimations();
      fireEvent.mouseUp(handle);
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('20px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: true }),
      );
    });

    it('should expand LeftSidebar when the width is between the threshold and flyout width', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={240}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.mouseDown(handle, { clientX: 240 });
      fireEvent.mouseMove(document, {
        clientX: 220,
        clientY: 0,
      });
      completeAnimations();
      fireEvent.mouseUp(handle);
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: false }),
      );
    });

    it('should not expand LeftSidebar more than half the width of the page when moving the mouse', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.mouseDown(handle, { clientX: 200 });
      fireEvent.mouseMove(document, {
        clientX: 570,
        clientY: 0,
      });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('552px');

      fireEvent.mouseUp(handle);
      completeAnimations();
    });

    it('should not allow you to expand more than half the width of the page after a mouse movement', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );
      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.mouseDown(handle, { clientX: 200 });
      fireEvent.mouseMove(document, {
        clientX: 570,
        clientY: 0,
      });
      completeAnimations();
      fireEvent.mouseUp(handle);
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('552px');
    });

    it('should update leftSidebarWidth in localStorage on collapse', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200} shouldPersistWidth>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(20);
    });

    it('should update leftSidebarWidth in localStorage on expand', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200} shouldPersistWidth>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      // TODO: set up by setting up the local storage state
      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(20);

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(240);
    });

    it('should update leftSideBar collapsed state in localStorage when collapsed', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('left-sidebar-resize-button'));
        completeAnimations();
      });

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(true);
    });

    it('should update leftSideBar collapsed state in localStorage when expanded', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(true);

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(false);
    });

    it('should mount in collapsed state if LS is corrupt and "isLeftSidebarCollapsed: true" and "leftSidebarWidth > 20"', () => {
      localStorage.clear();
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: true,
          gridState: {
            leftSidebarWidth: 356,
          },
        }),
      );

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getDimension('leftSidebarWidth')).toEqual('20px');
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
    });

    it('should mount in expanded state if LS is corrupt and "isLeftSidebarCollapsed: false" and "leftSidebarWidth < 20"', () => {
      localStorage.clear();
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: false,
          gridState: {
            leftSidebarWidth: 20,
          },
        }),
      );

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
    });

    it('should mount in expanded state if LS is corrupt and "isLeftSidebarCollapsed: false" and gridState is absent', () => {
      localStorage.clear();
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: false,
        }),
      );

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
    });

    it('should mount in collapsed state if LS is corrupt and "isLeftSidebarCollapsed: true" and gridState is absent', () => {
      localStorage.clear();
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: true,
        }),
      );

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getDimension('leftSidebarWidth')).toEqual('20px');
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
    });

    it('should mount in collapsed state if LS is corrupt and "isLeftSidebarCollapsed: true" and "leftSidebarFlyoutWidth < 20"', () => {
      localStorage.clear();
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: true,
          gridState: {
            leftSidebarFlyoutWidth: 20,
          },
        }),
      );

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getDimension('leftSidebarWidth')).toEqual('20px');
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
    });

    it('should mount in expanded state if LS is corrupt and "isLeftSidebarCollapsed: false" and "leftSidebarFlyoutWidth < 20"', () => {
      localStorage.clear();
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: false,
          gridState: {
            leftSidebarFlyoutWidth: 20,
          },
        }),
      );

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
    });

    it('should mount in collapsed state if it was unmounted while collapsed', () => {
      const { getByTestId, unmount } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(true);
      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(20);

      unmount();

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(true);
    });

    it('should mount in expanded state if it was unmounted while expanded', () => {
      const { unmount } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" shouldPersistWidth width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      unmount();

      render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" shouldPersistWidth width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(false);
      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(240);
    });
  });

  describe('Flyout', () => {
    beforeEach(() => {
      document.documentElement.setAttribute(
        'data-is-sidebar-collapsed',
        'true',
      );
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: true,
        }),
      );
    });

    it('should call onFlyoutExpand and onFlyoutCollapse callbacks', () => {
      const onFlyoutExpand = jest.fn();
      const onFlyoutCollapse = jest.fn();
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar
              testId="component"
              width={200}
              onFlyoutExpand={onFlyoutExpand}
              onFlyoutCollapse={onFlyoutCollapse}
            >
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });
      expect(onFlyoutExpand).toHaveBeenCalledTimes(1);

      act(() => {
        fireEvent.mouseLeave(getByTestId('component'));
        jest.runAllTimers();
      });
      expect(onFlyoutCollapse).toHaveBeenCalledTimes(1);
    });

    // Investigate why the test fails but works fine in the browser
    it.skip('should expand flyout to passed in width when mouse enters the LeftSidebar which has not been resized yet', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={200}>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });
      expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
      expect(getByTestId('component')).toHaveStyleDeclaration('width', '20px');
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarFlyoutWidth)',
      );
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('200px');
    });

    it('should expand flyout to preferred width when mouse enters the LeftSidebar which has been resized', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="component" width={200}>
              Contents
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main>main</Main>
          </Content>
        </PageLayout>,
      );

      act(() => {
        fireEvent.click(getByTestId('expand'));
      });

      act(() => {
        (getByTestId('setLeftSidebarWidth') as HTMLInputElement).value = '349';
        fireEvent.click(getByTestId('setLeftSidebarWidth'));
      });

      act(() => {
        fireEvent.click(getByTestId('collapse'));
        completeAnimations();
      });

      triggerTransitionEnd(getByTestId('component'));

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        completeAnimations();
      });

      expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarFlyoutWidth)',
      );
      expect(getDimension('leftSidebarFlyoutWidth')).toEqual('349px');
    });

    // Investigate why the test fails but works fine in the browser
    it.skip('should collapse flyout when mouse leaves the LeftSidebar', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={200}>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });
      expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
      expect(getByTestId('component')).toHaveStyleDeclaration('width', '20px');
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarFlyoutWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining('--leftSidebarFlyoutWidth:240px;'),
      );

      act(() => {
        fireEvent.mouseLeave(getByTestId('component'));
        jest.runAllTimers();
      });

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(getByTestId('component').firstElementChild).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(getDimension('leftSidebarWidth')).toBe('20px');
    });

    // Investigate why the test fails but works fine in the browser
    it.skip('should expand flyout when mouse enters the LeftSidebar when isFixed is false', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar isFixed={false} testId="component" width={200}>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });
      expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarFlyoutWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining('--leftSidebarFlyoutWidth:240px;'),
      );
    });

    // Investigate why the test fails but works fine in the browser
    it.skip('should collapse flyout when mouse leaves the LeftSidebar when isFixed is false', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar isFixed={false} testId="component" width={200}>
              Contents
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });
      expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarFlyoutWidth)',
      );
      expect(document.head.innerHTML).toEqual(
        expect.stringContaining('--leftSidebarFlyoutWidth:240px;'),
      );

      act(() => {
        fireEvent.mouseLeave(getByTestId('component'));
        jest.runAllTimers();
      });

      expect(getByTestId('component')).toHaveStyleDeclaration(
        'width',
        'var(--leftSidebarWidth)',
      );
      expect(getDimension('leftSidebarWidth')).toBe('20px');
    });

    it('should show the contents of left sidebar when flyout is open', async () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar testId="component" width={200}>
              <div>Contents</div>
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });

      expect(
        getComputedStyle(
          getByTestId('component').firstElementChild!.firstElementChild!,
        ).opacity,
      ).toBe('1');
    });

    it('should show the contents of left sidebar when flyout is open and isFixed is false', async () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Main>
            <LeftSidebar isFixed={false} testId="component" width={200}>
              <div>Contents</div>
            </LeftSidebar>
          </Main>
        </PageLayout>,
      );

      act(() => {
        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
      });

      expect(
        getComputedStyle(
          getByTestId('component').firstElementChild!.firstElementChild!,
        ).opacity,
      ).toBe('1');
    });
  });

  describe('Accessibility features', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      raf.replace();
    });

    afterEach(() => {
      jest.useRealTimers();
      localStorage.clear();
    });

    it('should have all accessibility data-attrs', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      expect(handle.hasAttribute('role')).toEqual(true);
      expect(handle.hasAttribute('aria-label')).toEqual(true);
      expect(handle.hasAttribute('aria-valuenow')).toEqual(true);
      expect(handle.hasAttribute('aria-valuemin')).toEqual(true);
      expect(handle.hasAttribute('aria-valuemax')).toEqual(true);
      expect(handle.hasAttribute('aria-expanded')).toEqual(true);
    });

    it('should change step by 10px on arrow left-top/right-bottom push', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={LEFT_SIDEBAR_FLYOUT_WIDTH}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.focus(handle);
      fireEvent.keyDown(handle, { keyCode: 39 });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${LEFT_SIDEBAR_FLYOUT_WIDTH + 10}px`,
      );

      fireEvent.keyDown(handle, { keyCode: 37 });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${LEFT_SIDEBAR_FLYOUT_WIDTH}px`,
      );

      fireEvent.keyDown(handle, { keyCode: 40 });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${LEFT_SIDEBAR_FLYOUT_WIDTH + 10}px`,
      );

      fireEvent.keyDown(handle, { keyCode: 38 });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${LEFT_SIDEBAR_FLYOUT_WIDTH}px`,
      );
    });

    it('should expand to maximum and minimum widths on arrow left-top/right-bottom push with a modifier', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={LEFT_SIDEBAR_FLYOUT_WIDTH}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');
      const maxWidth = 512;

      //Meta key
      fireEvent.focus(handle);
      fireEvent.keyDown(handle, { keyCode: 39, metaKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

      fireEvent.keyDown(handle, { keyCode: 37, metaKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );

      //Shift key
      fireEvent.keyDown(handle, { keyCode: 39, shiftKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

      fireEvent.keyDown(handle, { keyCode: 38, shiftKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );

      // alt key
      fireEvent.focus(handle);
      fireEvent.keyDown(handle, { keyCode: 39, altKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

      fireEvent.keyDown(handle, { keyCode: 37, altKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );

      // ctrl key
      fireEvent.focus(handle);
      fireEvent.keyDown(handle, { keyCode: 39, ctrlKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

      fireEvent.keyDown(handle, { keyCode: 37, ctrlKey: true });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );
    });

    it(`should not change width of navbar on min ${LEFT_SIDEBAR_FLYOUT_WIDTH}px limit`, () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={LEFT_SIDEBAR_FLYOUT_WIDTH}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.keyDown(handle, { keyCode: 37 });

      expect(getDimension('leftSidebarWidth')).toEqual(
        `${LEFT_SIDEBAR_FLYOUT_WIDTH}px`,
      );
    });

    it(`should not change width of navbar on max ${Math.round(
      window.innerWidth / 2,
    ) - +getDimension('leftPanelWidth')}px limit`, () => {
      const maxWidth =
        Math.round(window.innerWidth / 2) - +getDimension('leftPanelWidth');
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: false,
          gridState: {
            leftSidebarWidth: maxWidth,
            leftSidebarFlyoutWidth: maxWidth,
          },
        }),
      );
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={maxWidth}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.keyDown(handle, { keyCode: 39 });

      expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);
    });

    it('should collapse navbar on line Enter, Space or Click (that the same)', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={LEFT_SIDEBAR_FLYOUT_WIDTH}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

      fireEvent.click(handle);

      expect(handle.getAttribute('aria-expanded')).toEqual('false');
    });

    it('should make the grab area non-interactive when left sidebar is collapsed', () => {
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: true,
          gridState: {},
        }),
      );

      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={LEFT_SIDEBAR_FLYOUT_WIDTH}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getByTestId('left-sidebar-grab-area')).toHaveAttribute('disabled');
    });

    it('should make the grab area interactive when left sidebar is expanded', () => {
      localStorage.setItem(
        'DS_PAGE_LAYOUT_UI_STATE',
        JSON.stringify({
          isLeftSidebarCollapsed: false,
          gridState: {},
        }),
      );

      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar
              testId="left-sidebar"
              width={LEFT_SIDEBAR_FLYOUT_WIDTH}
            >
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getByTestId('left-sidebar-grab-area')).not.toHaveAttribute(
        'disabled',
      );
    });
  });
});
