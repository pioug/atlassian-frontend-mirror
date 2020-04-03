import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { browser } from '@atlaskit/editor-common';
import PanelTextInput from '../../../ui/PanelTextInput';

const noop = () => {};

describe('@atlaskit/editor-core/ui/PanelTextInput', () => {
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
    panel = mount(<PanelTextInput onSubmit={onSubmitHandler} />);

    const input = panel.find('input');
    (input.getDOMNode() as any).value = 'http://atlassian.com';
    input.simulate('keydown', { which: 'enter', keyCode: 13 });

    expect(onSubmitHandler).toHaveBeenCalledWith('http://atlassian.com');
  });

  it('should prevent KeyDown event if ENTER key is pressed', () => {
    const onSubmitHandler = jest.fn();
    const preventDefault = jest.fn();
    panel = mount(<PanelTextInput onSubmit={onSubmitHandler} />);

    const input = panel.find('input');
    input.simulate('keydown', { which: 'enter', keyCode: 13, preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should not prevent KeyDown event if any other key is pressed', () => {
    const preventDefault = jest.fn();
    panel = mount(<PanelTextInput onSubmit={noop} />);

    const input = panel.find('input');
    input.simulate('keydown', { which: 'a', keyCode: 65, preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('should call onCancel when ESC key is pressed', () => {
    const onCancelHandler = jest.fn();
    panel = mount(<PanelTextInput onCancel={onCancelHandler} />);

    const input = panel.find('input');
    input.simulate('keydown', { which: 'esc', keyCode: 27 });

    expect(onCancelHandler).toHaveBeenCalled();
  });

  it('should call onKeyDown when a key is pressed', () => {
    const onKeyDownHandler = jest.fn();
    panel = mount(<PanelTextInput onKeyDown={onKeyDownHandler} />);

    const input = panel.find('input');
    input.simulate('keydown', { which: 'a', keyCode: 65 });

    expect(onKeyDownHandler).toHaveBeenCalled();
  });

  describe('given', () => {
    let onUndoSpy: jest.Mock, onRedoSpy: jest.Mock;
    beforeEach(() => {
      onUndoSpy = jest.fn();
      onRedoSpy = jest.fn();
      panel = mount(<PanelTextInput onUndo={onUndoSpy} onRedo={onRedoSpy} />);
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
    panel = mount(<PanelTextInput autoFocus />);
    const inputNode: any = panel.find('input').instance();
    jest.spyOn(inputNode, 'focus');
    jest.runAllTimers();
    expect(inputNode.focus).toHaveBeenCalled();
  });

  it('should focus input passing through focus options if autoFocus prop set to options', () => {
    panel = mount(<PanelTextInput autoFocus={{ preventScroll: true }} />);
    const inputNode: any = panel.find('input').instance();
    jest.spyOn(inputNode, 'focus');
    jest.runAllTimers();
    expect(inputNode.focus).toHaveBeenCalledWith({ preventScroll: true });
  });
});
