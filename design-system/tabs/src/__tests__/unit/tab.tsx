import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/react';

import Tabs, { Tab, TabList, TabPanel, useTab } from '../../index';
import { TabContext } from '../../internal/context';

afterEach(cleanup);

const CustomTab = ({ label }: { label: string }) => {
  const tabAttributes = useTab();

  // In this example custom tab we have added an onFocus call
  return (
    <span {...tabAttributes} onFocus={() => {}}>
      {label}
    </span>
  );
};

const noop = () => {};

describe('@atlaskit/tabs', () => {
  describe('tab', () => {
    it('should error without a context provider', () => {
      /* eslint-disable no-console */
      const err = console.error;
      console.error = jest.fn();
      /* eslint-enable no-console */

      let errorMessage = '';
      try {
        render(<Tab>Label 1</Tab>);
      } catch (e) {
        errorMessage = e.message;
      }

      expect(errorMessage).toBe(
        '@atlaskit/tabs: A Tab must have a TabList parent.',
      );

      // Restore writing to stderr.
      // eslint-disable-next-line no-console
      console.error = err;
    });

    describe('context', () => {
      const onClick = jest.fn();
      const onMouseDown = jest.fn();
      const onKeyDown = jest.fn();
      let wrapper: RenderResult;

      beforeEach(() => {
        wrapper = render(
          <TabContext.Provider
            value={{
              onClick,
              id: '1',
              'aria-controls': '0-1-tab',
              'aria-posinset': 2,
              'aria-selected': true,
              'aria-setsize': 4,
              onMouseDown,
              onKeyDown,
              role: 'tab',
              tabIndex: 0,
            }}
          >
            <Tab>Label 1</Tab>
          </TabContext.Provider>,
        );
      });

      afterEach(() => {
        onClick.mockClear();
        onMouseDown.mockClear();
        onKeyDown.mockClear();
        wrapper.unmount();
      });

      it('should map context to aria attributes correctly', () => {
        const tab = wrapper.getByRole('tab');
        expect(tab.getAttribute('aria-controls')).toBe('0-1-tab');
        expect(tab.getAttribute('aria-posinset')).toBe('2');
        expect(tab.getAttribute('aria-selected')).toBe('true');
        expect(tab.getAttribute('aria-setsize')).toBe('4');
        expect(tab.getAttribute('tabIndex')).toBe('0');

        // Test methods
        expect(onClick).not.toBeCalled();
        tab.click();
        expect(onClick).toBeCalled();

        expect(onMouseDown).not.toBeCalled();
        fireEvent.mouseDown(tab);
        expect(onMouseDown).toBeCalled();

        expect(onKeyDown).not.toBeCalled();
        fireEvent.keyDown(tab, { key: 'ArrowRight' });
        expect(onKeyDown).toBeCalled();
      });

      it('should call onClick when clicked', () => {
        const tab = wrapper.getByRole('tab');

        // Test methods
        expect(onClick).not.toBeCalled();
        tab.click();
        expect(onClick).toBeCalled();

        expect(onMouseDown).not.toBeCalled();
        fireEvent.mouseDown(tab);
        expect(onMouseDown).toBeCalled();

        expect(onKeyDown).not.toBeCalled();
        fireEvent.keyDown(tab, { key: 'ArrowRight' });
        expect(onKeyDown).toBeCalled();
      });

      it('should call onMouseDown when mouse down', () => {
        const tab = wrapper.getByRole('tab');

        expect(onMouseDown).not.toBeCalled();
        fireEvent.mouseDown(tab);
        expect(onMouseDown).toBeCalled();
      });

      it('should call onKeyDown when key down', () => {
        const tab = wrapper.getByRole('tab');

        expect(onKeyDown).not.toBeCalled();
        fireEvent.keyDown(tab, { key: 'ArrowRight' });
        expect(onKeyDown).toBeCalled();
      });
    });

    it('should receive context even if wrapped in a div', () => {
      const { getByRole } = render(
        <TabContext.Provider
          value={{
            onClick: noop,
            id: '1',
            'aria-controls': '0-1-tab',
            'aria-posinset': 2,
            'aria-selected': true,
            'aria-setsize': 4,
            onMouseDown: noop,
            onKeyDown: noop,
            role: 'tab',
            tabIndex: 0,
          }}
        >
          <div role="presentation">
            <Tab>Label 1</Tab>
          </div>
        </TabContext.Provider>,
      );

      const tab = getByRole('tab');
      expect(tab.getAttribute('aria-controls')).toBe('0-1-tab');
      expect(tab.getAttribute('aria-posinset')).toBe('2');
      expect(tab.getAttribute('aria-selected')).toBe('true');
      expect(tab.getAttribute('aria-setsize')).toBe('4');
      expect(tab.getAttribute('tabIndex')).toBe('0');
    });
  });

  it('should accept any react node as a child', () => {
    const { getByTestId } = render(
      <TabContext.Provider
        value={{
          onClick: noop,
          id: '1',
          'aria-controls': '0-1-tab',
          'aria-posinset': 2,
          'aria-selected': true,
          'aria-setsize': 4,
          onMouseDown: noop,
          onKeyDown: noop,
          role: 'tab',
          tabIndex: 0,
        }}
      >
        <Tab>
          <div data-testid="label-1">Label 1</div>
        </Tab>{' '}
      </TabContext.Provider>,
    );

    expect(getByTestId('label-1')).toBeTruthy();
  });

  describe('Custom tab using useTab', () => {
    it('can be used to create a custom tab', () => {
      const onClick = jest.fn();
      const onMouseDown = jest.fn();
      const onKeyDown = jest.fn();
      const { getByRole } = render(
        <TabContext.Provider
          value={{
            onClick,
            id: '1',
            'aria-controls': '0-1-tab',
            'aria-posinset': 2,
            'aria-selected': true,
            'aria-setsize': 4,
            onMouseDown,
            onKeyDown,
            role: 'tab',
            tabIndex: 0,
          }}
        >
          <CustomTab label="Tab 1" />
        </TabContext.Provider>,
      );

      const tab = getByRole('tab');
      expect(tab.getAttribute('aria-controls')).toBe('0-1-tab');
      expect(tab.getAttribute('aria-posinset')).toBe('2');
      expect(tab.getAttribute('aria-selected')).toBe('true');
      expect(tab.getAttribute('aria-setsize')).toBe('4');
      expect(tab.getAttribute('tabIndex')).toBe('0');

      // Test methods
      expect(onClick).not.toBeCalled();
      tab.click();
      expect(onClick).toBeCalled();

      expect(onMouseDown).not.toBeCalled();
      fireEvent.mouseDown(tab);
      expect(onMouseDown).toBeCalled();

      expect(onKeyDown).not.toBeCalled();
      fireEvent.keyDown(tab, { key: 'ArrowRight' });
      expect(onKeyDown).toBeCalled();
    });

    it('should change the custom tab when clicked', () => {
      const spy = jest.fn();

      const { getByText } = render(
        <Tabs onChange={spy} id="test">
          <TabList>
            <CustomTab label="Tab 1 label" />
            <CustomTab label="Tab 2 label" />
          </TabList>
          <TabPanel>Tab 1 panel</TabPanel>
          <TabPanel>Tab 2 panel</TabPanel>
        </Tabs>,
      );

      const tab2 = getByText('Tab 2 label');
      tab2.click();

      expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
      expect(getByText('Tab 1 label').getAttribute('aria-selected')).toBe(
        'false',
      );
      expect(tab2.getAttribute('aria-selected')).toBe('true');
    });

    it('should change the custom tab when using the right key', () => {
      const spy = jest.fn();

      const { getByText } = render(
        <Tabs onChange={spy} id="test">
          <TabList>
            <CustomTab label="Tab 1 label" />
            <CustomTab label="Tab 2 label" />
          </TabList>
          <TabPanel>Tab 1 panel</TabPanel>
          <TabPanel>Tab 2 panel</TabPanel>
        </Tabs>,
      );

      const tab1 = getByText('Tab 1 label');
      const tab2 = getByText('Tab 2 label');
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
      expect(tab1.getAttribute('aria-selected')).toBe('false');
      expect(tab2.getAttribute('aria-selected')).toBe('true');
    });
  });
});
