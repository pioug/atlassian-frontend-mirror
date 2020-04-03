import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { mount } from 'enzyme';

import { PopupSelect, OptionsType } from '../../..';

const OPTIONS: OptionsType = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

const addedListeners = () => {
  //@ts-ignore
  const { mock } = global.window.addEventListener as jest.Mock;
  const results = mock.calls.filter(call => call[0] !== 'error');
  return results;
};

const removedListeners = () => {
  //@ts-ignore
  const { mock } = global.window.removeEventListener as jest.Mock;
  const results = mock.calls.filter(call => call[0] !== 'error');
  return results;
};

describe('Popup Select', () => {
  beforeEach(() => {
    //@ts-ignore
    jest.spyOn(global.window, 'addEventListener');
    //@ts-ignore
    jest.spyOn(global.window, 'removeEventListener');
  });

  afterEach(() => {
    //@ts-ignore
    global.window.addEventListener.mockRestore();
    //@ts-ignore
    global.window.removeEventListener.mockRestore();
  });

  it('stays open when cleared', () => {
    const atlaskitSelectWrapper = mount<PopupSelect>(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isClearable
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );
    atlaskitSelectWrapper.setState({ isOpen: true });
    // Check ClearIndicator exists
    expect(atlaskitSelectWrapper.find('ClearIndicator').exists()).toBeTruthy();
    // @ts-ignore typescript is not able to infer props
    atlaskitSelectWrapper.find('ClearIndicator').prop('clearValue')();
    // Menu should still be open
    expect(atlaskitSelectWrapper.find('Menu').exists()).toBeTruthy();
  });

  it('cleans up event listeners', () => {
    const atlaskitSelectWrapper = mount(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isClearable
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );

    expect(addedListeners().length).toBe(1);
    atlaskitSelectWrapper.unmount();
    expect(removedListeners().length).toBe(2);
  });

  it('cleans up event listeners added after being opened', () => {
    const atlaskitSelectWrapper = mount(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isClearable
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );

    atlaskitSelectWrapper.setState({ isOpen: true });
    expect(addedListeners().length).toBe(3);
    atlaskitSelectWrapper.unmount();
    expect(removedListeners().length).toBe(4);
  });

  test('renders a read only input when isSearchable is false', async () => {
    const { container, getByText } = render(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isSearchable={false}
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );
    const body = container.parentElement as HTMLBodyElement;
    fireEvent.click(getByText('Target'));
    // popup renders in a portal outside the container
    const input = body.querySelector('input') as HTMLElement;
    expect(input.hasAttribute('readonly')).toBe(true);
  });
});
