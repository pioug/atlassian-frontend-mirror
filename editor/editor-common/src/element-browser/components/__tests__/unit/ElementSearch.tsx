const mockGetWidth = jest.fn();
jest.mock('../../../hooks/use-container-width', () => {
  const originalHook = jest.requireActual(
    '../../../hooks/use-container-width',
  ).default;
  return (...args: any) => ({
    ...originalHook(...args),
    containerWidth: mockGetWidth(),
  });
});
import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { replaceRaf } from 'raf-stub';
import { IntlProvider } from 'react-intl-next';

import StatelessElementBrowser from '../../StatelessElementBrowser';
const commonProps = {
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
export const testPropsWithoutItems = {
  items: [],
  ...commonProps,
};
export const testPropsWithItems = {
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
  ...commonProps,
};
replaceRaf();
describe('StatelessElementBrowser', () => {
  it('should render assistive text with nothing found', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <StatelessElementBrowser {...testPropsWithoutItems} mode="inline" />
      </IntlProvider>,
    );
    const searchedElement = container.querySelector('#search-assistive');
    let text = searchedElement?.textContent;
    expect(text).toBe('Nothing matches your search');
  });
});
describe('KeyboardNavigation for item listSize 10', () => {
  type ExpectedState = {
    focusOnSearch: boolean;
    selectedItemIndex?: number;
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
    it('should render assistive text with 10 found', () => {
      mockGetWidth.mockReturnValue(660); // adjust this value as needed
      const { container } = render(
        <IntlProvider locale="en">
          <StatelessElementBrowser {...testPropsWithItems} mode="inline" />
        </IntlProvider>,
      );
      const element = container.querySelector('[data-testid="main-content"]');
      if (element) {
        fireEvent.keyPress(element, {
          key: 'Enter',
          code: 'Enter',
          charCode: 13,
        });
        const searchedElement = container.querySelector('#search-assistive');
        let text = searchedElement?.textContent;
        expect(text).toBe('10 suggestions available for typed text.');
      }
    });
  };
  const enterKeySuite = (columns: number, breakpointWidth: number) => {
    describe('Enter key press', () => {
      testKeyCombination(
        ['enter'],
        {
          focusOnSearch: false,
          selectedItemIndex: columns,
          focusedItemIndex: columns,
        },
        breakpointWidth,
      );
    });
  };
  describe('Up/Down arrows with columns', () => {
    describe('Columns = 1 (ContainerWidth: 350px)', () => {
      enterKeySuite(1, 350);
    });
  });
});
