import { mount, ReactWrapper } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';

import { browser } from '../../../browser';
import PanelTextInput from '../../../ui/PanelTextInput';

const noop = () => {};

describe('<PanelTextInput />', () => {
  let panel: ReactWrapper;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (panel && panel.length) {
      panel.unmount();
    }
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should call onSubmit when ENTER key is pressed', () => {
    const onSubmitHandler = jest.fn();
    const onChangeHandler = jest.fn();
    panel = mount(
      <PanelTextInput
        name="test"
        value=""
        onSubmit={onSubmitHandler}
        onChange={onChangeHandler}
      />,
    );

    const input = panel.find('input');
    (input.getDOMNode() as any).value = 'http://atlassian.com';
    input.simulate('keydown', { which: 'enter', keyCode: 13 });

    expect(onSubmitHandler).toHaveBeenCalledWith('http://atlassian.com');
  });

  it('should prevent KeyDown event if ENTER key is pressed', () => {
    const onSubmitHandler = jest.fn();
    const preventDefault = jest.fn();
    const onChangeHandler = jest.fn();
    panel = mount(
      <PanelTextInput
        name="test"
        value=""
        onSubmit={onSubmitHandler}
        onChange={onChangeHandler}
      />,
    );

    const input = panel.find('input');
    input.simulate('keydown', { which: 'enter', keyCode: 13, preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should not prevent KeyDown event if any other key is pressed', () => {
    const preventDefault = jest.fn();
    const onChangeHandler = jest.fn();
    panel = mount(
      <PanelTextInput
        value=""
        name="test"
        onSubmit={noop}
        onChange={onChangeHandler}
      />,
    );

    const input = panel.find('input');
    input.simulate('keydown', { which: 'a', keyCode: 65, preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('should call onKeyDown when a key is pressed', () => {
    const onKeyDownHandler = jest.fn();
    const onChangeHandler = jest.fn();
    panel = mount(
      <PanelTextInput
        name="test"
        value=""
        onKeyDown={onKeyDownHandler}
        onChange={onChangeHandler}
      />,
    );

    const input = panel.find('input');
    input.simulate('keydown', { which: 'a', keyCode: 65 });

    expect(onKeyDownHandler).toHaveBeenCalled();
  });

  describe('given', () => {
    let onUndoSpy: jest.Mock, onRedoSpy: jest.Mock, onChangeSpy: jest.Mock;
    beforeEach(() => {
      onUndoSpy = jest.fn();
      onRedoSpy = jest.fn();
      onChangeSpy = jest.fn();

      panel = mount(
        <PanelTextInput
          name="test"
          value=""
          onUndo={onUndoSpy}
          onRedo={onRedoSpy}
          onChange={onChangeSpy}
        />,
      );
    });

    describe('on win platform', () => {
      it('on ctrl+z calls onUndo handler', () => {
        const event: KeyboardEvent = {
          keyCode: 90,
          ctrlKey: true,
        } as KeyboardEvent;
        panel.find('input').simulate('keydown', event);
        expect(onUndoSpy).toHaveBeenCalled();
      });

      it('on ctrl+y calls onRedo handler', () => {
        const event: KeyboardEvent = {
          keyCode: 89,
          ctrlKey: true,
        } as KeyboardEvent;
        panel.find('input').simulate('keydown', event);
        expect(onRedoSpy).toHaveBeenCalled();
      });
    });

    describe('on mac platform', () => {
      beforeEach(() => {
        browser.mac = true;
      });

      it('on cmd+z calls onUndo handler', () => {
        panel.find('input').simulate('keydown', {
          keyCode: 90,
          metaKey: true,
        });
        expect(onUndoSpy).toHaveBeenCalled();
      });

      it('on cmd+shift+z calls onRedo handler', () => {
        panel.find('input').simulate('keydown', {
          keyCode: 90,
          shiftKey: true,
          metaKey: true,
        });
        expect(onRedoSpy).toHaveBeenCalled();
      });

      it('should not undo if cmd+z is pressed with shift', () => {
        panel.find('input').simulate('keydown', {
          keyCode: 90,
          shiftKey: true,
          metaKey: true,
        });
        expect(onUndoSpy).not.toHaveBeenCalled();
      });
    });
  });

  it('should focus input if autoFocus prop set to true', () => {
    const onChangeHandler = jest.fn();

    const { getByTestId } = render(
      <PanelTextInput
        testId="link-url"
        value=""
        name="test"
        autoFocus
        onChange={onChangeHandler}
      />,
    );

    expect(getByTestId('link-url')).toHaveFocus();
  });

  it('should not focus input if autoFocus prop is not provided', () => {
    const onChangeHandler = jest.fn();

    const { getByTestId } = render(
      <PanelTextInput
        testId="link-url"
        value=""
        name="test"
        onChange={onChangeHandler}
      />,
    );

    expect(getByTestId('link-url')).not.toHaveFocus();
  });
});
