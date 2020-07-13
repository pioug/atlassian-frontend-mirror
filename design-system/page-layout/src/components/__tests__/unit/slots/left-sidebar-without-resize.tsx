import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { LeftSidebarWithoutResize, Main, PageLayout } from '../../../index';
import { getDimension } from '../__utils__/get-dimension';

describe('<LeftSidebarWithoutResize />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.documentElement.removeAttribute('data-is-sidebar-collapsed');
    localStorage.setItem(
      'DS_PAGE_LAYOUT_UI_STATE',
      JSON.stringify({
        isLeftSidebarCollapsed: true,
      }),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
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

    expect(document.documentElement.dataset.isSidebarCollapsed).toBeUndefined();
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
    expect(document.documentElement.dataset.isSidebarCollapsed).toBeUndefined();
    expect(document.documentElement.dataset.isFlyoutOpen).toBeUndefined();

    fireEvent.mouseLeave(getByTestId('component'));
    jest.runAllTimers();
    expect(document.documentElement.dataset.isSidebarCollapsed).toBeUndefined();
    expect(document.documentElement.dataset.isFlyoutOpen).toBeUndefined();
  });
});
