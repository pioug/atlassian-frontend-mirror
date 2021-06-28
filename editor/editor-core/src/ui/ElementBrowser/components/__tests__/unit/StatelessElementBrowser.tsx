import { mockCreateAnalyticsEvent } from '@atlaskit/editor-test-helpers/mock-analytics-next';
import { elementBrowserSelectors } from '../../../../../__tests__/__helpers/page-objects/_element-browser';

const mockGetWidth = jest.fn();

jest.mock('../../../hooks/use-container-width', () => {
  const originalHook = jest.requireActual('../../../hooks/use-container-width')
    .default;
  return (...args: any) => ({
    ...originalHook(...args),
    containerWidth: mockGetWidth(),
  });
});

import React from 'react';
import { ReactWrapper } from 'enzyme';
import { act } from '@testing-library/react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { replaceRaf } from 'raf-stub';
import { DEVICE_BREAKPOINT_NUMBERS } from '../../../constants';
import StatelessElementBrowser from '../../StatelessElementBrowser';

export const testProps = {
  items: [
    { name: 'item-1', title: 'Item 1', action: jest.fn() },
    { name: 'item-2', title: 'Item 2', action: jest.fn() },
    { name: 'item-3', title: 'Item 3', action: jest.fn() },
    { name: 'item-4', title: 'Item 4', action: jest.fn() },
    { name: 'item-5', title: 'Item 5', action: jest.fn() },
    { name: 'item-6', title: 'Item 6', action: jest.fn() },
    { name: 'item-7', title: 'Item 7', action: jest.fn() },
    { name: 'item-8', title: 'Item 8', action: jest.fn() },
    { name: 'item-9', title: 'Item 9', action: jest.fn() },
    { name: 'item-10', title: 'Item 10', action: jest.fn() },
  ],
  categories: [{ name: 'category-1', title: 'Category 1' }],
  selectedCategory: 'all',
  onSearch: jest.fn(),
  onSelectCategory: jest.fn(),
  onSelectItem: jest.fn(),
  onInsertItem: jest.fn(),
  onEnterKeyPress: jest.fn(),
  showSearch: true,
  showCategories: true,
  formatMessage: jest.fn(),
  setFocusedItemIndex: jest.fn(),
};

let wrapper: ReactWrapper;

replaceRaf();

describe('StatelessElementBrowser', () => {
  it('should render mobile components for width < 600', () => {
    mockGetWidth.mockReturnValue(DEVICE_BREAKPOINT_NUMBERS.small);
    wrapper = mountWithIntl(
      <StatelessElementBrowser {...testProps} mode="inline" />,
    );
    expect(wrapper.find('MobileBrowser')).toHaveLength(1);
    wrapper.unmount();
  });
  it('should not render desktop components on mobile', () => {
    mockGetWidth.mockReturnValue(DEVICE_BREAKPOINT_NUMBERS.small);
    wrapper = mountWithIntl(
      <StatelessElementBrowser {...testProps} mode="inline" />,
    );
    expect(wrapper.find('DesktopBrowser')).toHaveLength(0);
    wrapper.unmount();
  });
  it('should render desktop components for width >= 600', () => {
    mockGetWidth.mockReturnValue(DEVICE_BREAKPOINT_NUMBERS.medium);
    wrapper = mountWithIntl(
      <StatelessElementBrowser {...testProps} mode="full" />,
    );
    expect(wrapper.find('DesktopBrowser')).toHaveLength(1);
    wrapper.unmount();
  });
  it('should should not render mobile components on desktop', () => {
    mockGetWidth.mockReturnValue(DEVICE_BREAKPOINT_NUMBERS.medium);
    wrapper = mountWithIntl(
      <StatelessElementBrowser {...testProps} mode="full" />,
    );
    expect(wrapper.find('MobileBrowser')).toHaveLength(0);
    wrapper.unmount();
  });
  it('should not render a sidebar heading on mobile', () => {
    mockGetWidth.mockReturnValue(DEVICE_BREAKPOINT_NUMBERS.small);
    wrapper = mountWithIntl(
      <StatelessElementBrowser {...testProps} mode="inline" />,
    );
    expect(wrapper.find('SidebarHeading')).toHaveLength(0);
    wrapper.unmount();
  });
  it('should render a sidebar heading on desktop', () => {
    mockGetWidth.mockReturnValue(DEVICE_BREAKPOINT_NUMBERS.medium);
    wrapper = mountWithIntl(
      <StatelessElementBrowser {...testProps} mode="full" />,
    );
    expect(wrapper.find('SidebarHeading')).toHaveLength(1);
    wrapper.unmount();
  });

  describe('Analytics', () => {
    it('should fire an "open" event on mount', () => {
      mountWithIntl(<StatelessElementBrowser {...testProps} mode="full" />);

      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'opened',
        actionSubject: 'elementBrowser',
        attributes: {
          mode: 'full',
        },
        eventType: 'ui',
      });
    });

    it('should fire an "click" event on category item click', () => {
      const wrapper = mountWithIntl(
        <StatelessElementBrowser {...testProps} mode="full" />,
      );
      const categoryItems = wrapper.find(elementBrowserSelectors.categoryItem);
      mockCreateAnalyticsEvent.mockClear();
      categoryItems.first().simulate('click');
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'categoryButton',
        eventType: 'track',
      });
    });

    it('should fire an "close" event on unmount', () => {
      const wrapper = mountWithIntl(
        <StatelessElementBrowser {...testProps} mode="full" />,
      );

      wrapper.unmount();

      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'closed',
        actionSubject: 'elementBrowser',
        attributes: {
          mode: 'full',
        },
        eventType: 'ui',
      });
    });
  });
});

describe('KeyboardNavigation for item listSize 10', () => {
  type KeySimuationOptions = {
    mobile: boolean;
  };
  const MainContent = (mobile: boolean) =>
    wrapper.find(mobile ? 'MobileElementBrowserContainer' : 'MainContent');
  const keySimulation: any = {
    arrowDown: ({ mobile }: KeySimuationOptions) => {
      MainContent(mobile).simulate('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
      });
    },
    arrowRight: ({ mobile }: KeySimuationOptions) => {
      MainContent(mobile).simulate('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
        which: 39,
      });
    },
    arrowLeft: ({ mobile }: KeySimuationOptions) => {
      MainContent(mobile).simulate('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        keyCode: 37,
        which: 37,
      });
    },
    arrowUp: ({ mobile }: KeySimuationOptions) => {
      MainContent(mobile).simulate('keydown', {
        key: 'ArrowUp',
        code: 'ArrowUp',
        keyCode: 38,
        which: 38,
      });
    },
    slash: ({ mobile }: KeySimuationOptions) => {
      MainContent(mobile).simulate('keydown', {
        key: '/',
        code: 'Slash',
        keyCode: 191,
        which: 191,
      });
    },
    enter: ({ mobile }: KeySimuationOptions) => {
      MainContent(mobile).simulate('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
      });
    },
  };

  type ExpectedState = {
    focusOnSearch: boolean;
    selectedItemIndex: number;
    focusedItemIndex?: number;
  };

  const testKeyCombination = (
    keys: string[],
    expectedState: ExpectedState,
    /** Arrow key stepper is dynamic now,
     * the exact widths won't be the same as defined constants.
     * Hence, setting it to 660px, where manually tested, is the default for a 3 column / 3 step count.
     **/
    breakpointWidth: number = 660,
  ) => {
    const focusSearchMessage =
      (expectedState.focusOnSearch ? 'should' : "shouldn't") +
      ' focus on search';

    const selectedItemMessage = `select item index: ${expectedState.selectedItemIndex}`;

    const focusItemMessage =
      expectedState.focusedItemIndex == null
        ? "shouldn't focus on items"
        : `focus on item index: ${expectedState.focusedItemIndex}`;

    it(`${focusSearchMessage}, ${selectedItemMessage}, and ${focusItemMessage} for combination [${keys.toString()}]`, () => {
      mockGetWidth.mockReturnValue(breakpointWidth);

      wrapper = mountWithIntl(
        <StatelessElementBrowser {...testProps} mode="full" />,
      );

      const isMobile = breakpointWidth < DEVICE_BREAKPOINT_NUMBERS.medium;
      const options = {
        mobile: isMobile,
      };

      keys.forEach((key: string) => {
        act(() => {
          keySimulation[key](options);
          // @ts-ignore using raf-stub, this method will exist for this scope.
          requestAnimationFrame.step();
        });
        wrapper.update();
      });

      const {
        focusOnSearch,
        selectedItemIndex,
        focusedItemIndex,
      } = wrapper
        .find(isMobile ? 'MobileBrowser' : 'DesktopBrowser')
        .props() as any;

      expect(focusOnSearch).toBe(expectedState.focusOnSearch);
      expect(selectedItemIndex).toBe(expectedState.selectedItemIndex);
      expect(focusedItemIndex).toBe(expectedState.focusedItemIndex);
    });

    if (keys.find((k) => k === 'enter')) {
      it(`calls back onInsertItem with selected item at index: ${expectedState.selectedItemIndex}`, () => {
        expect(testProps.onInsertItem).toHaveBeenCalledWith(
          testProps.items[expectedState.selectedItemIndex],
        );
      });
    }
  };

  const enterKeySuite = (columns: number, breakpointWidth: number) => {
    describe('Enter key press', () => {
      testKeyCombination(
        ['arrowDown', 'arrowDown', 'enter'],
        {
          focusOnSearch: false,
          selectedItemIndex: columns,
          focusedItemIndex: columns,
        },
        breakpointWidth,
      );
      testKeyCombination(
        ['arrowDown', 'arrowDown', 'arrowLeft', 'arrowUp', 'enter'],
        {
          focusOnSearch: true,
          selectedItemIndex: columns - 1,
          focusedItemIndex: undefined,
        },
        breakpointWidth,
      );
    });
  };

  const arrowKeysWithcolumnSuite = (
    columns: number,
    breakpointWidth: number,
  ) => {
    testKeyCombination(
      ['arrowDown', 'arrowDown'],
      {
        focusOnSearch: false,
        selectedItemIndex: columns,
        focusedItemIndex: columns,
      },
      breakpointWidth,
    );
    testKeyCombination(
      ['arrowDown', 'arrowDown', 'arrowRight'],
      {
        focusOnSearch: false,
        selectedItemIndex: columns + 1,
        focusedItemIndex: columns + 1,
      },
      breakpointWidth,
    );
    testKeyCombination(
      ['arrowDown', 'arrowDown', 'arrowRight', 'arrowUp', 'arrowLeft'],
      {
        focusOnSearch: false,
        selectedItemIndex: 0,
        focusedItemIndex: 0,
      },
      breakpointWidth,
    );
    testKeyCombination(
      ['arrowDown', 'arrowDown', 'arrowLeft', 'arrowUp'],
      {
        focusOnSearch: true,
        selectedItemIndex: columns - 1,
        focusedItemIndex: undefined,
      },
      breakpointWidth,
    );
  };

  describe('key combo', () => {
    testKeyCombination([], {
      focusOnSearch: true,
      selectedItemIndex: 0,
      focusedItemIndex: undefined,
    });
    testKeyCombination(['arrowDown'], {
      focusOnSearch: false,
      selectedItemIndex: 0,
      focusedItemIndex: 0,
    });
    testKeyCombination(['arrowDown', 'arrowRight'], {
      focusOnSearch: false,
      selectedItemIndex: 1,
      focusedItemIndex: 1,
    });
    testKeyCombination(['arrowDown', 'arrowRight', 'arrowLeft'], {
      focusOnSearch: false,
      selectedItemIndex: 0,
      focusedItemIndex: 0,
    });
    testKeyCombination(['arrowDown', 'arrowRight', 'slash'], {
      focusOnSearch: true,
      selectedItemIndex: 1,
      focusedItemIndex: undefined,
    });
    testKeyCombination(['arrowDown', 'arrowDown', 'arrowRight', 'slash'], {
      focusOnSearch: true,
      selectedItemIndex: 4,
      focusedItemIndex: undefined,
    });
  });
  describe('Up/Down arrows with columns', () => {
    describe('Columns = 1 (ContainerWidth: 350px)', () => {
      arrowKeysWithcolumnSuite(1, 350);
      enterKeySuite(1, 350);
    });
    describe('Columns = 2 (ContainerWidth: 601)', () => {
      arrowKeysWithcolumnSuite(2, 601);
      enterKeySuite(2, 601);
    });
    describe('Columns = 3 (ContainerWidth: 750)', () => {
      arrowKeysWithcolumnSuite(3, 750);
      enterKeySuite(3, 750);
    });
    describe('Columns = 4 (ContainerWidth: 1024px)', () => {
      arrowKeysWithcolumnSuite(4, 1024);
      enterKeySuite(4, 1024);
    });
  });
});
