import React, { useContext } from 'react';

import { act, cleanup, fireEvent, render } from '@testing-library/react';

import {
  IS_SIDEBAR_COLLAPSING,
  PAGE_LAYOUT_LS_KEY,
} from '../../common/constants';
import { Content, LeftSidebar, Main, PageLayout } from '../../components';
import { getDimension } from '../../components/__tests__/unit/__utils__/get-dimension';
import * as raf from '../../components/__tests__/unit/__utils__/raf';
import { triggerTransitionEnd } from '../../components/__tests__/unit/__utils__/transition-end';
import { SidebarResizeContext } from '../sidebar-resize-context';

const completeAnimations = () => {
  act(() => raf.flush());
  act(() => jest.runAllTimers());
};
export const ResizeControlledConsumer = () => {
  const {
    isLeftSidebarCollapsed,
    expandLeftSidebar,
    collapseLeftSidebar,
    leftSidebarState,
    setLeftSidebarState,
  } = useContext(SidebarResizeContext);

  const setWidth = (event: any) => {
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
  beforeEach(() => {
    jest.useFakeTimers();
    raf.replace();
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
    cleanup();
  });

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

  it('should call correct callback for collapse after initial render', () => {
    const collapseFn = jest.fn();
    const expandFn = jest.fn();
    const { getByTestId } = render(
      <PageLayout
        testId="grid"
        onLeftSidebarCollapse={collapseFn}
        onLeftSidebarExpand={expandFn}
      >
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
    triggerTransitionEnd(getByTestId('left-sidebar'));
    expect(collapseFn).toBeCalledTimes(1);
    expect(expandFn).toBeCalledTimes(0);
  });

  it('should call correct callback for expand after initial render', () => {
    const collapseFn = jest.fn();
    const expandFn = jest.fn();
    const { getByTestId } = render(
      <PageLayout
        testId="grid"
        onLeftSidebarCollapse={collapseFn}
        onLeftSidebarExpand={expandFn}
      >
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
    triggerTransitionEnd(getByTestId('left-sidebar'));
    expect(collapseFn).toBeCalledTimes(0);
    expect(expandFn).toBeCalledTimes(1);
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

  it('should set LeftSidebar width when width >= 240', async () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <Content>
          <LeftSidebar testId="left-sidebar" width={400}>
            LeftSidebar
            <ResizeControlledConsumer />
          </LeftSidebar>
          <Main testId="content">Main</Main>
        </Content>
      </PageLayout>,
    );

    expect(getByTestId('leftSidebar').innerText).toBe('400');
  });

  it('should set LeftSidebar collapsed when collapsedState="collapsed"', async () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <Content>
          <LeftSidebar testId="left-sidebar" collapsedState="collapsed">
            LeftSidebar
            <ResizeControlledConsumer />
          </LeftSidebar>
          <Main testId="content">Main</Main>
        </Content>
      </PageLayout>,
    );

    expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
      expect.objectContaining({ isLeftSidebarCollapsed: true }),
    );
    expect(getByTestId('leftSidebar').innerText).toBe('20');
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
    expect(
      getByTestId('component').firstElementChild!.nextSibling,
    ).toHaveStyleDeclaration('width', 'var(--leftSidebarFlyoutWidth,240px)');
    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--leftSidebarWidth:20px;}'),
    );

    act(() => {
      fireEvent.click(getByTestId('expand'));
      completeAnimations();
    });

    expect(getByTestId('component')).toHaveStyleDeclaration(
      'width',
      'var(--leftSidebarWidth,0px)',
    );
    expect(
      getByTestId('component').firstElementChild!.nextSibling,
    ).toHaveStyleDeclaration('width', 'var(--leftSidebarWidth,0px)');
    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--leftSidebarWidth:240px;}'),
    );
  });

  describe('prefers-reduced-motion', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
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
        value: jest.fn().mockImplementation((query) => ({
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
      expect(fn).toHaveBeenCalledWith({
        isFlyoutOpen: false,
        isLeftSidebarCollapsed: false,
        isResizing: false,
        lastLeftSidebarWidth: 240,
        leftSidebarWidth: 240,
        flyoutLockCount: 0,
      });
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
      expect(fn).toHaveBeenCalledWith({
        isFlyoutOpen: false,
        isLeftSidebarCollapsed: true,
        isResizing: false,
        lastLeftSidebarWidth: 240,
        leftSidebarWidth: 20,
        flyoutLockCount: 0,
      });
    });
  });
});
