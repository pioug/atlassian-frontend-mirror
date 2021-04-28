import React, { ReactNode } from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import Tabs, { Tab, TabList, TabPanel, useTabPanel } from '../../index';
import { TabPanelContext } from '../../internal/context';

afterEach(cleanup);

const CustomTabPanel = ({ children }: { children: ReactNode }) => {
  const context = useTabPanel();
  return (
    <span {...context} onFocus={() => {}}>
      {children}
    </span>
  );
};

const noop = () => {};

describe('@atlaskit/tabs', () => {
  describe('tab panel', () => {
    it('should throw an error if context not provided', () => {
      /* eslint-disable no-console */
      const err = console.error;
      console.error = jest.fn();
      /* eslint-enable no-console */

      let errorMessage = '';
      try {
        render(<TabPanel>Tab Panel</TabPanel>);
      } catch (e) {
        errorMessage = e.message;
      }

      expect(errorMessage).toBe(
        '@atlaskit/tabs:  A TabPanel must have a Tabs parent.',
      );

      // Restore writing to stderr.
      // eslint-disable-next-line no-console
      console.error = err;
    });

    it('should accept any react node as a child', () => {
      const { getByTestId } = render(
        <TabPanelContext.Provider
          value={{
            role: 'tabpanel',
            id: '0-1-tab',
            hidden: false,
            'aria-labelledby': '1',
            tabIndex: 0,
            onMouseDown: noop,
          }}
        >
          <TabPanel>
            <div data-testid="panel-1">Tab Panel</div>
          </TabPanel>
        </TabPanelContext.Provider>,
      );

      expect(getByTestId('panel-1')).toBeTruthy();
    });

    it('should map props in context correctly', () => {
      const { getByRole } = render(
        <TabPanelContext.Provider
          value={{
            role: 'tabpanel',
            id: '0-1-tab',
            hidden: false,
            'aria-labelledby': '1',
            tabIndex: 0,
            onMouseDown: noop,
          }}
        >
          <TabPanel>Label 1</TabPanel>
        </TabPanelContext.Provider>,
      );

      const tabPanel = getByRole('tabpanel');
      expect(tabPanel.getAttribute('aria-labelledby')).toBe('1');
      expect(tabPanel.id).toBe('0-1-tab');
      expect(tabPanel.hidden).toBe(false);
      expect(tabPanel.tabIndex).toBe(0);
    });

    it('should map onMouseDown in context correctly', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <TabPanelContext.Provider
          value={{
            role: 'tabpanel',
            id: '0-1-tab',
            hidden: false,
            'aria-labelledby': '1',
            tabIndex: 0,
            onMouseDown: spy,
          }}
        >
          <TabPanel>Label 1</TabPanel>
        </TabPanelContext.Provider>,
      );

      const tabPanel = getByRole('tabpanel');
      fireEvent.mouseDown(tabPanel);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Custom tab panel using useTabPanel', () => {
    it('will reflect changes in the TabPanelContext and render correctly', () => {
      const { getByRole } = render(
        <TabPanelContext.Provider
          value={{
            role: 'tabpanel',
            'aria-labelledby': '1',
            id: '1-1-tab',
            tabIndex: 0,
            onMouseDown: noop,
          }}
        >
          <CustomTabPanel>Panel 1</CustomTabPanel>
        </TabPanelContext.Provider>,
      );

      const tabPanel = getByRole('tabpanel');
      expect(tabPanel.getAttribute('aria-labelledby')).toBe('1');
      expect(tabPanel.id).toBe('1-1-tab');
      expect(tabPanel.hidden).toBe(false);
      expect(tabPanel.tabIndex).toBe(0);
    });

    it('will reflect changes in the TabPanelContext when wrapped in a div', () => {
      const { getByRole } = render(
        <TabPanelContext.Provider
          value={{
            role: 'tabpanel',
            'aria-labelledby': '1',
            id: '1-1-tab',
            tabIndex: 0,
            onMouseDown: noop,
          }}
        >
          <div>
            <CustomTabPanel>Panel 1</CustomTabPanel>
          </div>
        </TabPanelContext.Provider>,
      );

      const tabPanel = getByRole('tabpanel');
      expect(tabPanel.getAttribute('aria-labelledby')).toBe('1');
      expect(tabPanel.id).toBe('1-1-tab');
      expect(tabPanel.hidden).toBe(false);
      expect(tabPanel.tabIndex).toBe(0);
    });

    it('should not unmount a custom TabPanel when changed', () => {
      const { getByText, queryByText, getAllByRole } = render(
        <Tabs id="test">
          <TabList>
            <Tab>Tab 1 label</Tab>
            <Tab>Tab 2 label</Tab>
          </TabList>
          <CustomTabPanel>Tab 1 panel</CustomTabPanel>
          <CustomTabPanel>Tab 2 panel</CustomTabPanel>
        </Tabs>,
      );

      getByText('Tab 2 label').click();

      expect(getAllByRole('tabpanel').length).toBe(2);
      expect(getByText('Tab 1 panel')).toBeTruthy();
      expect(getByText('Tab 2 panel')).toBeTruthy();
      expect(queryByText('Tab 3 panel')).not.toBeTruthy();

      expect(getByText('Tab 1 panel').hidden).toBe(true);
      expect(getByText('Tab 2 panel').hidden).toBe(false);
    });
  });
});
