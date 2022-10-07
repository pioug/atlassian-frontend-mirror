import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';

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
  const results = mock.calls.filter((call) => call[0] !== 'error');
  return results;
};

const removedListeners = () => {
  //@ts-ignore
  const { mock } = global.window.removeEventListener as jest.Mock;
  const results = mock.calls.filter((call) => call[0] !== 'error');
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

  it('should maintain focus in select element after tabbing when open', async () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <React.Fragment>
        <PopupSelect
          options={OPTIONS}
          value={OPTIONS[0]}
          testId={'PopupSelect'}
          onChange={(value) => onChangeMock(value)}
          target={({ ref }) => (
            <button ref={ref} data-testid="select-trigger">
              Target
            </button>
          )}
        />
      </React.Fragment>,
    );

    const selectTrigger = getByText('Target');

    selectTrigger.click();

    await waitForExpect(() => {
      expect(selectTrigger).not.toHaveFocus();
      expect(
        document.body.querySelector('#react-select-2-input'),
      ).toHaveFocus();
    });

    userEvent.tab();

    await waitForExpect(() => {
      expect(selectTrigger).not.toHaveFocus();
      expect(
        document.body.querySelector('#react-select-2-input'),
      ).toHaveFocus();
    });
  });

  it('should return focus to trigger element on close', () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <React.Fragment>
        <PopupSelect
          options={OPTIONS}
          value={OPTIONS[0]}
          testId={'PopupSelect'}
          onChange={(value) => onChangeMock(value)}
          target={({ ref }) => (
            <button ref={ref} data-testid="select-trigger">
              Target
            </button>
          )}
        />
      </React.Fragment>,
    );

    const selectTrigger = getByText('Target');

    selectTrigger.click();

    getByText('1').click();

    expect(onChangeMock).toHaveBeenCalledWith({ label: '1', value: 'one' });
    expect(selectTrigger).toHaveFocus();
  });

  it('should return focus to trigger element on escape', () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <React.Fragment>
        <PopupSelect
          options={OPTIONS}
          value={OPTIONS[0]}
          testId={'PopupSelect'}
          onChange={(value) => onChangeMock(value)}
          target={({ ref }) => (
            <button ref={ref} data-testid="select-trigger">
              Target
            </button>
          )}
        />
      </React.Fragment>,
    );

    const selectTrigger = getByText('Target');

    selectTrigger.click();

    const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
    });

    document.dispatchEvent(escapeKeyDownEvent);

    expect(onChangeMock).not.toHaveBeenCalled();
    expect(selectTrigger).toHaveFocus();
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
    expect(removedListeners().length).toBe(1);
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
    expect(addedListeners().length).toBe(4);
    atlaskitSelectWrapper.unmount();
    expect(removedListeners().length).toBe(4);
  });

  test('triggers onMenuClose method when closed', async () => {
    const onMenuCloseMock = jest.fn();
    const { getByText } = render(
      <React.Fragment>
        <PopupSelect
          options={OPTIONS}
          value={OPTIONS[0]}
          testId={'PopupSelect'}
          onMenuClose={onMenuCloseMock}
          target={({ ref }) => (
            <button ref={ref} data-testid="select-trigger">
              Target
            </button>
          )}
        />
        <button data-testid="focus-decoy">Focus decoy</button>
      </React.Fragment>,
    );
    const selectTrigger = getByText('Target');
    selectTrigger.click();

    expect(getByText('Select...')).toBeTruthy();

    selectTrigger.click();
    expect(onMenuCloseMock).toHaveBeenCalled();
  });

  test('event listeners continue to work when stopPropagation is called in parent', async () => {
    const { getByText } = render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div onClick={(e) => e.stopPropagation()}>
        <PopupSelect
          options={OPTIONS}
          value={OPTIONS[0]}
          target={({ ref }) => <button ref={ref}>Target</button>}
        />
      </div>,
    );
    fireEvent.click(getByText('Target'));
    expect(getByText('Select...')).toBeTruthy();
  });

  const PopupSelectOpenTest = ({
    isOpen,
    defaultIsOpen,
  }: {
    isOpen?: boolean;
    defaultIsOpen?: boolean;
  }) => (
    <PopupSelect
      options={OPTIONS}
      value={OPTIONS[0]}
      isOpen={isOpen}
      defaultIsOpen={defaultIsOpen}
      classNamePrefix="popup-select"
      target={({ ref }) => (
        <button ref={ref} data-testid="target">
          Target
        </button>
      )}
    />
  );

  describe('isOpen prop', () => {
    it('should open and close the menu', () => {
      const { container, rerender } = render(<PopupSelectOpenTest />, {
        container: document.body,
      });

      // No prop is set, so initially the popup should be closed
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(0);

      // Change `isOpen` to `true`
      rerender(<PopupSelectOpenTest isOpen />);

      // Menu should be open
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(1);

      // Change `isOpen` to `false`
      rerender(<PopupSelectOpenTest isOpen={false} />);

      // Menu should be closed
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(0);
    });

    it('should not allow the popup to close when set to true', () => {
      const { container, getByTestId } = render(
        <>
          <PopupSelectOpenTest isOpen />
          <button data-testid="close-decoy">Close decoy</button>
        </>,
        { container: document.body },
      );

      // Click elsewhere to trigger close
      const closeDecoy = getByTestId('close-decoy');
      closeDecoy.click();

      // Popup should remain open
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(1);
    });

    it('should not allow the popup to open when set to false', () => {
      const { container, getByTestId } = render(
        <PopupSelectOpenTest isOpen={false} />,
        { container: document.body },
      );

      // Click target to trigger open
      const target = getByTestId('target');
      target.click();

      // Popup should remain closed
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(0);
    });

    it('should have preference over the `defaultIsOpen` prop', () => {
      const { container: closedContainer } = render(
        <PopupSelectOpenTest isOpen={false} defaultIsOpen />,
        { container: document.body },
      );

      // Popup should be closed
      expect(
        closedContainer.getElementsByClassName('popup-select__menu-list')
          .length,
      ).toBe(0);

      const { container: openContainer } = render(
        <PopupSelectOpenTest isOpen defaultIsOpen={false} />,
        { container: document.body },
      );

      // Popup should be open
      expect(
        openContainer.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(1);
    });
  });

  describe('defaultIsOpen prop', () => {
    it('should open the popup on mount when set to true', () => {
      const { container } = render(<PopupSelectOpenTest defaultIsOpen />, {
        container: document.body,
      });

      // Popup should be open
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(1);
    });

    it('should not open the popup on mount when set to false', () => {
      const { container } = render(
        <PopupSelectOpenTest defaultIsOpen={false} />,
        { container: document.body },
      );

      // Popup should be closed
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(0);
    });

    it('should not open the popup if set to true after mount', () => {
      const { container, rerender } = render(
        <PopupSelectOpenTest defaultIsOpen={false} />,
        {
          container: document.body,
        },
      );

      // Popup should be closed
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(0);

      rerender(<PopupSelectOpenTest defaultIsOpen />);

      // Popup should remain closed
      expect(
        container.getElementsByClassName('popup-select__menu-list').length,
      ).toBe(0);
    });
  });

  describe('trigger button', () => {
    const renderPopupSelect = () => {
      const renderResult = render(
        <PopupSelect
          options={OPTIONS}
          target={({ isOpen, ...triggerProps }) => (
            <button {...triggerProps}>Target</button>
          )}
        />,
      );

      return { ...renderResult, trigger: renderResult.getByText('Target') };
    };

    it('should have aria-haspopup attribute', () => {
      const { trigger } = renderPopupSelect();
      expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    });

    it('should have aria-expanded attribute', () => {
      const { trigger } = renderPopupSelect();

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(trigger);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('when open, should have aria-controls attribute which is equal to the popup container id', () => {
      const { trigger, container } = renderPopupSelect();

      expect(trigger.getAttribute('aria-controls')).toBeNull();
      // opens popup
      fireEvent.click(trigger);

      const controledId = trigger.getAttribute('aria-controls');
      expect(controledId).toBeDefined();

      const body = container.parentElement as HTMLBodyElement;

      const popupWrapper = body.querySelector(`#${controledId}`);
      expect(popupWrapper).toBeDefined();
    });
  });
});
