import React, { MouseEvent } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Tooltip from '@atlaskit/tooltip';

import { PAGE_LAYOUT_LS_KEY } from '../../../common/constants';
import {
  Content,
  LeftPanel,
  LeftSidebar,
  Main,
  PageLayout,
  usePageLayoutResize,
} from '../../../index';

import { getDimension } from './__utils__/get-dimension';
import * as raf from './__utils__/raf';

describe('Left sidebar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  const completeAnimations = () => {
    act(() => raf.step());
    act(() => jest.runAllTimers());
  };

  describe('SidebarResizeController', () => {
    const ResizeControlledConsumer = () => {
      const {
        isLeftSidebarCollapsed,
        expandLeftSidebar,
        collapseLeftSidebar,
        getLeftPanelWidth,
        getLeftSidebarWidth,
        setLeftSidebarWidth,
      } = usePageLayoutResize();

      const setWidth = (event: MouseEvent) => {
        setLeftSidebarWidth(Number((event.target as HTMLInputElement).value));
      };

      return (
        <>
          <button data-testid="collapse" onClick={collapseLeftSidebar} />
          <button data-testid="expand" onClick={expandLeftSidebar} />
          <p data-testid="isLeftSidebarCollapsed">
            {String(isLeftSidebarCollapsed)}
          </p>
          <p data-testid="leftSidebar">{getLeftSidebarWidth()}</p>
          <p data-testid="leftPanel">{getLeftPanelWidth()}</p>
          <input data-testid="setLeftSidebarWidth" onClick={setWidth} />
        </>
      );
    };

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
        jest.runAllTimers();
        completeAnimations();
      });
      expect(getByTestId('isLeftSidebarCollapsed').innerText).toBe('true');

      act(() => {
        fireEvent.click(getByTestId('expand'));
        jest.runAllTimers();
        completeAnimations();
      });
      expect(getByTestId('isLeftSidebarCollapsed').innerText).toBe('false');
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
        jest.runAllTimers();
        completeAnimations();
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
        jest.runAllTimers();
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

      expect(getByTestId('leftSidebar').innerText).toBe('200');
      expect(getDimension('leftSidebarWidth')).toEqual('200px');
    });

    it('should return LeftPanel width', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <LeftPanel width={500}>panel</LeftPanel>
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControlledConsumer />
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(getByTestId('leftPanel').innerText).toBe('500');
      expect(getDimension('leftPanelWidth')).toEqual('500px');
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
      expect(getDimension('leftSidebarWidth')).toEqual('349px');
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
        jest.runAllTimers();
        completeAnimations();

        fireEvent.mouseOver(getByTestId('component'));
        jest.runAllTimers();
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
        jest.runAllTimers();
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
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200} onCollapse={fn}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should expand the LeftSidebar when ResizeButton is clicked in collapsed state', () => {
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

      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: false }),
      );
      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('240px');
      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: false }),
      );
    });

    it('should call onExpand callback when ResizeButton is clicked in collapsed state', () => {
      const fn = jest.fn();
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200} onExpand={fn}>
              LeftSidebar
            </LeftSidebar>
            <Main testId="content">Main</Main>
          </Content>
        </PageLayout>,
      );

      expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
        expect.objectContaining({ isLeftSidebarCollapsed: false }),
      );
      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

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

      expect(getDimension('leftSidebarWidth')).toEqual('250px');

      fireEvent.mouseUp(handle);
      completeAnimations();
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

      expect(getDimension('leftSidebarWidth')).toEqual('250px');

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

      expect(getDimension('leftSidebarWidth')).toEqual('200px');

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

      expect(getDimension('leftSidebarWidth')).toEqual('240px');

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
        clientX: 550,
        clientY: 0,
      });
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('512px');

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
        clientX: 550,
        clientY: 0,
      });
      completeAnimations();
      fireEvent.mouseUp(handle);
      completeAnimations();

      expect(getDimension('leftSidebarWidth')).toEqual('512px');
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

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(false);

      fireEvent.click(getByTestId('left-sidebar-resize-button'));
      completeAnimations();

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
      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(20);
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

      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)
          .isLeftSidebarCollapsed,
      ).toBe(false);
      expect(
        JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState
          .leftSidebarWidth,
      ).toBe(200);

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
      ).toBe(200);
    });
  });

  describe('Flyout', () => {
    beforeEach(() => {
      document.documentElement.setAttribute(
        'data-is-sidebar-collapsed',
        'true',
      );
      localStorage.setItem(
        'PAGE_LAYOUT_UI_STATE',
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

    it('should expand flyout when mouse enters the LeftSidebar when isFixed is false', () => {
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

    it('should collapse flyout when mouse leaves the LeftSidebar when isFixed is false', () => {
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
});
