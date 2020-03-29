import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import {
  PageLayout,
  Main,
  Content,
  LeftSidebar,
  ResizeControl,
} from '../../../';
import { PAGE_LAYOUT_LS_KEY } from '../../../common/constants';
import * as raf from './__utils__/raf';
import { getDimension } from './__utils__/get-dimension';

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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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

    it('should collapse the LeftSidebar when GrabArea is clicked in expanded state', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200}>
              LeftSidebar
              <ResizeControl testId="left-sidebar" />
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

    it('should update leftSidebarWidth in localStorage on collapse', () => {
      const { getByTestId } = render(
        <PageLayout testId="grid">
          <Content>
            <LeftSidebar testId="left-sidebar" width={200} shouldPersistWidth>
              LeftSidebar
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
              <ResizeControl testId="left-sidebar" />
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
