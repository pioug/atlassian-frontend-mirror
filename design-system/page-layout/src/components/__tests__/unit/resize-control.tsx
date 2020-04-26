import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Tooltip from '@atlaskit/tooltip';

import { PAGE_LAYOUT_LS_KEY } from '../../../common/constants';
import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  ResizeControl,
} from '../../../index';

import { getDimension } from './__utils__/get-dimension';
import * as raf from './__utils__/raf';

describe('<ResizeControl />', () => {
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

  describe('Resize button', () => {
    it('should collapse the LeftSidebar when ResizeButton is clicked in expanded state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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

    it('should expand the LeftSidebar when ResizeButton is clicked in collapsed state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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

    it('should render the button within an override if given', () => {
      const { getByTestId, queryByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControl
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
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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

    it('should not move the LeftSidebar when GrabArea is clicked to the right', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
              <ResizeControl
                testId="left-sidebar"
                resizeButtonLabel="Toggle navigation"
              />
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
});
