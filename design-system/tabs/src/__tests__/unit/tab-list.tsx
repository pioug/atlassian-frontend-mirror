import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import { Tab, TabList } from '../../index';
import { TabListContext } from '../../internal/context';
import { TabListAttributesType } from '../../types';

afterEach(cleanup);

const tabList = (
  <TabList>
    <Tab>Tab 1 label</Tab>
    <Tab>Tab 2 label</Tab>
    <Tab>Tab 3 label</Tab>
  </TabList>
);

const renderTabList = (
  overridingValue: Partial<TabListAttributesType> = {},
) => (
  <TabListContext.Provider
    value={{
      selected: 0,
      tabsId: 'test',
      onChange: () => {},
      ...overridingValue,
    }}
  >
    <TabList>
      <Tab>Tab 1 label</Tab>
      <Tab>Tab 2 label</Tab>
      <Tab>Tab 3 label</Tab>
    </TabList>
  </TabListContext.Provider>
);

describe('@atlaskit/tabs', () => {
  describe('tab list', () => {
    it('should have role tablist', () => {
      const { queryByRole } = render(renderTabList());

      expect(queryByRole('tablist')).toBeTruthy();
    });

    it('should throw an error if context not provided', () => {
      /* eslint-disable no-console */
      const err = console.error;
      console.error = jest.fn();
      /* eslint-enable no-console */

      let errorMessage = '';
      try {
        render(tabList);
      } catch (e) {
        errorMessage = e.message;
      }

      expect(errorMessage).toBe(
        '@atlaskit/tabs: A TabList must have a Tabs parent.',
      );

      // Restore writing to stderr.
      // eslint-disable-next-line no-console
      console.error = err;
    });

    it('should render correctly if one of the children is not a react element', () => {
      const { getByText } = render(
        <TabListContext.Provider
          value={{
            selected: 0,
            tabsId: 'test',
            onChange: () => {},
          }}
        >
          <TabList>
            <Tab>Tab 1 label</Tab>
            <Tab>Tab 2 label</Tab>
            {''}
            <Tab>Tab 3 label</Tab>
          </TabList>
        </TabListContext.Provider>,
      );

      ['Tab 1 label', 'Tab 2 label', 'Tab 3 label'].forEach((label, index) => {
        const tab = getByText(label);
        const isSelected = index === 0;

        expect(tab.getAttribute('aria-controls')).toBe(`test-${index}-tab`);
        expect(tab.getAttribute('aria-posinset')).toBe(`${index + 1}`);
        expect(tab.getAttribute('aria-selected')).toBe(isSelected.toString());
        // If this fails it is including invalid children
        expect(tab.getAttribute('aria-setsize')).toBe('3');
        expect(tab.id).toBe(`test-${index}`);
        expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
      });
    });

    it('should map values from context correctly', () => {
      const { getByText } = render(
        renderTabList({ selected: 1, tabsId: 'hello' }),
      );

      ['Tab 1 label', 'Tab 2 label', 'Tab 3 label'].forEach((label, index) => {
        const tab = getByText(label);
        const isSelected = index === 1;

        expect(tab.getAttribute('aria-controls')).toBe(`hello-${index}-tab`);
        expect(tab.getAttribute('aria-posinset')).toBe(`${index + 1}`);
        expect(tab.getAttribute('aria-selected')).toBe(isSelected.toString());
        expect(tab.getAttribute('aria-setsize')).toBe('3');
        expect(tab.id).toBe(`hello-${index}`);
        expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
      });
    });

    it('should map values from context correctly when wrapped in a div', () => {
      const { getByText } = render(
        <TabListContext.Provider
          value={{
            selected: 1,
            tabsId: 'test',
            onChange: () => {},
          }}
        >
          <div>
            <TabList>
              <Tab>Tab 1 label</Tab>
              <Tab>Tab 2 label</Tab>
              <Tab>Tab 3 label</Tab>
            </TabList>
          </div>
        </TabListContext.Provider>,
      );

      ['Tab 1 label', 'Tab 2 label', 'Tab 3 label'].forEach((label, index) => {
        const tab = getByText(label);
        const isSelected = index === 1;

        expect(tab.getAttribute('aria-controls')).toBe(`test-${index}-tab`);
        expect(tab.getAttribute('aria-posinset')).toBe(`${index + 1}`);
        expect(tab.getAttribute('aria-selected')).toBe(isSelected.toString());
        expect(tab.getAttribute('aria-setsize')).toBe('3');
        expect(tab.id).toBe(`test-${index}`);
        expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
      });
    });

    it('should render each tab with the correct attributes after changing', () => {
      const { getByText, rerender } = render(renderTabList());

      rerender(renderTabList({ selected: 2 }));

      ['Tab 1 label', 'Tab 2 label', 'Tab 3 label'].forEach((label, index) => {
        const tab = getByText(label);
        const isSelected = index === 2;

        expect(tab.getAttribute('aria-controls')).toBe(`test-${index}-tab`);
        expect(tab.getAttribute('aria-posinset')).toBe(`${index + 1}`);
        expect(tab.getAttribute('aria-selected')).toBe(isSelected.toString());
        expect(tab.getAttribute('aria-setsize')).toBe('3');
        expect(tab.id).toBe(`test-${index}`);
        expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
      });
    });

    it('should fire onChange if a tab is clicked', () => {
      const spy = jest.fn();
      const { getByText } = render(
        renderTabList({ selected: 0, onChange: spy }),
      );

      getByText('Tab 2 label').click();

      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledWith(1);
    });

    describe('can navigate via keyboard', () => {
      it('pressing HOME fires onChange for the first tab', () => {
        const spy = jest.fn();
        const { getByText } = render(
          renderTabList({ selected: 2, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 3 label'), { key: 'Home' });

        expect(spy).toHaveBeenCalledWith(0);
      });

      it('pressing END fires onChange for the first tab', () => {
        const spy = jest.fn();
        const { getByText } = render(
          renderTabList({ selected: 2, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 1 label'), { key: 'End' });

        expect(spy).toHaveBeenCalledWith(2);
      });

      it('pressing LEFT arrow fires onChange for the first tab', () => {
        const spy = jest.fn();
        const { getByText } = render(
          renderTabList({ selected: 1, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 2 label'), { key: 'ArrowLeft' });

        expect(spy).toHaveBeenCalledWith(0);
      });

      it('pressing the RIGHT arrow fires onChange for the last tab', () => {
        const spy = jest.fn();
        const { getByText } = render(
          renderTabList({ selected: 1, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 2 label'), { key: 'ArrowRight' });

        expect(spy).toHaveBeenCalledWith(2);
      });

      it('pressing the LEFT arrow when on the first tab fires onChange for the last tab', () => {
        const spy = jest.fn();
        const { getByText } = render(
          renderTabList({ selected: 0, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 1 label'), { key: 'ArrowLeft' });

        expect(spy).toHaveBeenCalledWith(2);
      });

      it('pressing the RIGHT arrow when on the last tab fires onChange for the first tab', () => {
        const spy = jest.fn();
        const { getByText } = render(
          renderTabList({ selected: 2, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 3 label'), { key: 'ArrowRight' });

        expect(spy).toHaveBeenCalledWith(0);
      });

      it('navigating by keyboard still works after adding a tab', () => {
        const spy = jest.fn();
        const { getByText, rerender } = render(
          renderTabList({ selected: 1, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 2 label'), { key: 'ArrowRight' });
        rerender(renderTabList({ selected: 2, onChange: spy }));

        rerender(
          <TabListContext.Provider
            value={{ selected: 2, tabsId: 'test', onChange: spy }}
          >
            <TabList>
              <Tab>Tab 1 label</Tab>
              <Tab>Tab 2 label</Tab>
              <Tab>Tab 3 label</Tab>
              <Tab>Tab 4 label</Tab>
            </TabList>
          </TabListContext.Provider>,
        );
        fireEvent.keyDown(getByText('Tab 3 label'), { key: 'ArrowRight' });

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenLastCalledWith(3);
      });

      it('navigating by keyboard still works after removing a tab', () => {
        const spy = jest.fn();
        const { getByText, rerender } = render(
          renderTabList({ selected: 2, onChange: spy }),
        );

        fireEvent.keyDown(getByText('Tab 3 label'), { key: 'ArrowLeft' });
        rerender(renderTabList({ selected: 1, onChange: spy }));

        rerender(
          <TabListContext.Provider
            value={{ selected: 2, tabsId: 'test', onChange: spy }}
          >
            <TabList>
              <Tab>Tab 1 label</Tab>
              <Tab>Tab 2 label</Tab>
            </TabList>
          </TabListContext.Provider>,
        );
        fireEvent.keyDown(getByText('Tab 2 label'), { key: 'ArrowLeft' });

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenLastCalledWith(0);
      });
    });
  });
});
