import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  IS_SIDEBAR_COLLAPSING,
  PAGE_LAYOUT_LS_KEY,
} from '../../common/constants';
import { triggerTransitionEnd } from '../../components/__tests__/unit/__utils__/transition-end';
import LeftSidebar from '../../components/slots/left-sidebar';
import { usePageLayoutResize } from '../sidebar-resize-context';
import { SidebarResizeController } from '../sidebar-resize-controller';

jest.useFakeTimers();

const FakeComponent = () => {
  const {
    isLeftSidebarCollapsed,
    expandLeftSidebar,
    collapseLeftSidebar,
  } = usePageLayoutResize();

  return (
    <div>
      <button data-testid="expand" onClick={expandLeftSidebar}>
        Expand
      </button>
      <button data-testid="collapse" onClick={collapseLeftSidebar}>
        Collapse
      </button>
      <span data-testid="value">{isLeftSidebarCollapsed.toString()}</span>
    </div>
  );
};

const ProviderProps = {
  onLeftSidebarExpand: jest.fn(),
  onLeftSidebarCollapse: jest.fn(),
};

describe('Sidebar resize controller', () => {
  it('should collapse sidebar', () => {
    localStorage.setItem(
      PAGE_LAYOUT_LS_KEY,
      '{"isLeftSidebarCollapsed": false}',
    );

    const tree = (
      <SidebarResizeController {...ProviderProps}>
        <LeftSidebar testId="left-sidebar" width={200}>
          ...
        </LeftSidebar>
        <FakeComponent />
      </SidebarResizeController>
    );

    const { getByTestId } = render(tree);

    fireEvent.click(getByTestId('collapse'));

    expect(
      document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING),
    ).toEqual('true');

    triggerTransitionEnd(getByTestId('left-sidebar'));

    expect(ProviderProps.onLeftSidebarCollapse).toHaveBeenCalled();
    expect(getByTestId('value').innerText).toEqual('true');

    expect(
      document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING),
    ).toEqual(null);
  });

  it('should expand sidebar', async () => {
    const tree = (
      <SidebarResizeController {...ProviderProps}>
        <LeftSidebar testId="left-sidebar" width={200}>
          ...
        </LeftSidebar>
        <FakeComponent />
      </SidebarResizeController>
    );

    const { getByTestId } = render(tree);

    fireEvent.click(getByTestId('expand'));

    triggerTransitionEnd(getByTestId('left-sidebar'));

    expect(ProviderProps.onLeftSidebarExpand).toHaveBeenCalled();

    expect(getByTestId('value').innerText).toEqual('false');
  });
});
