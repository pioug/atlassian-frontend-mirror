import { render, RenderResult, fireEvent } from '@testing-library/react';
import React from 'react';
import { browser } from '@atlaskit/editor-common/utils';
import { PanelTextInput } from '@atlaskit/editor-common/ui';

const noop = () => {};

describe('@atlaskit/editor-core/ui/PanelTextInput', () => {
  let panel: RenderResult;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (panel) {
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
    panel = render(<PanelTextInput onSubmit={onSubmitHandler} />);

    const input = panel.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'http://atlassian.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    expect(onSubmitHandler).toHaveBeenCalledWith('http://atlassian.com');
  });

  it('should prevent KeyDown event if ENTER key is pressed', () => {
    const onSubmitHandler = jest.fn();
    const eventSpy = jest.spyOn(KeyboardEvent.prototype, 'preventDefault');
    panel = render(<PanelTextInput onSubmit={onSubmitHandler} />);

    const input = panel.getByRole('textbox');
    expect(eventSpy).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });

    expect(eventSpy).toHaveBeenCalledTimes(1);
  });

  it('should not prevent KeyDown event if any other key is pressed', () => {
    const eventSpy = jest.spyOn(KeyboardEvent.prototype, 'preventDefault');
    panel = render(<PanelTextInput onSubmit={noop} />);

    const input = panel.getByRole('textbox');
    expect(eventSpy).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(input, {
      key: 'a',
      code: 'a',
      keyCode: 65,
    });

    expect(eventSpy).toHaveBeenCalledTimes(0);
  });

  it('should call onCancel when ESC key is pressed', () => {
    const onCancelHandler = jest.fn();
    panel = render(<PanelTextInput onCancel={onCancelHandler} />);

    const input = panel.getByRole('textbox');

    fireEvent.keyDown(input, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
    });

    expect(onCancelHandler).toHaveBeenCalled();
  });

  it('should call onKeyDown when a key is pressed', () => {
    const onKeyDownHandler = jest.fn();
    panel = render(<PanelTextInput onKeyDown={onKeyDownHandler} />);

    const input = panel.getByRole('textbox');
    fireEvent.keyDown(input, {
      key: 'a',
      code: 'a',
      keyCode: 65,
    });

    expect(onKeyDownHandler).toHaveBeenCalled();
  });

  describe('given', () => {
    let onUndoSpy: jest.Mock, onRedoSpy: jest.Mock;
    beforeEach(() => {
      onUndoSpy = jest.fn();
      onRedoSpy = jest.fn();
      panel = render(<PanelTextInput onUndo={onUndoSpy} onRedo={onRedoSpy} />);
    });

    describe('on win platform', () => {
      it('on ctrl+z calls onUndo handler', () => {
        const input = panel.getByRole('textbox');

        fireEvent.keyDown(input, {
          key: 'z',
          code: 'z',
          keyCode: 90,
          ctrlKey: true,
        });
        expect(onUndoSpy).toHaveBeenCalled();
      });

      it('on ctrl+y calls onRedo handler', () => {
        const input = panel.getByRole('textbox');

        fireEvent.keyDown(input, {
          key: 'y',
          code: 'y',
          keyCode: 89,
          ctrlKey: true,
        });
        expect(onRedoSpy).toHaveBeenCalled();
      });
    });

    describe('on mac platform', () => {
      beforeEach(() => {
        browser.mac = true;
      });

      it('on cmd+z calls onUndo handler', () => {
        const input = panel.getByRole('textbox');

        fireEvent.keyDown(input, {
          key: 'z',
          code: 'z',
          keyCode: 90,
          metaKey: true,
        });
        expect(onUndoSpy).toHaveBeenCalled();
      });

      it('on cmd+shift+z calls onRedo handler', () => {
        const input = panel.getByRole('textbox');

        fireEvent.keyDown(input, {
          key: 'z',
          code: 'z',
          keyCode: 90,
          metaKey: true,
          shiftKey: true,
        });
        expect(onRedoSpy).toHaveBeenCalled();
      });

      it('should not undo if cmd+z is pressed with shift', () => {
        const input = panel.getByRole('textbox');

        fireEvent.keyDown(input, {
          key: 'z',
          code: 'z',
          keyCode: 90,
          metaKey: true,
          shiftKey: true,
        });
        expect(onUndoSpy).not.toHaveBeenCalled();
      });
    });
  });

  it('should focus input if autoFocus prop set to true', () => {
    panel = render(<PanelTextInput autoFocus />);
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, 'focus');
    jest.runAllTimers();
    expect(focusSpy).toHaveBeenCalledWith({});
  });

  it('should focus input passing through focus options if autoFocus prop set to options', () => {
    panel = render(<PanelTextInput autoFocus={{ preventScroll: true }} />);
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, 'focus');
    jest.runAllTimers();
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('should update the value if the default value is changed', () => {
    panel = render(<PanelTextInput defaultValue="first" />);
    const input = panel.getByRole('textbox');
    expect(input).toHaveValue('first');
    panel.rerender(<PanelTextInput defaultValue="second" />);
    expect(input).toHaveValue('second');
  });
});
