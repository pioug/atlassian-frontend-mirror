import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { browser } from '../../link-picker/browser';
import TextInput, { TextInputProps, testIds } from '.';

describe('TextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (props?: Partial<TextInputProps>) => {
    render(<TextInput testId="link-url" name="test" value="" {...props} />);

    return {
      input: screen.getByRole('textbox'),
    };
  };

  it('should call `onKeyDown` when a key is pressed', () => {
    const onKeyDown = jest.fn();
    const { input } = setup({ onKeyDown });

    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
    });

    Object.assign(event, {
      preventDefault: jest.fn(),
    });

    fireEvent(input, event);
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('should not `preventDefault` on KeyDown event when key is pressed', () => {
    const { input } = setup();

    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
    });

    Object.assign(event, {
      preventDefault: jest.fn(),
    });

    fireEvent(input, event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  describe('undo/redo', () => {
    describe('on win platform', () => {
      it('on ctrl+z calls `onUndo` handler', async () => {
        const onUndo = jest.fn();
        const { input } = setup({ onUndo });

        const event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 90,
          ctrlKey: true,
        });

        Object.assign(event, {
          preventDefault: jest.fn(),
        });

        fireEvent(input, event);

        expect(onUndo).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('on ctrl+y calls `onRedo` handler', async () => {
        const onRedo = jest.fn();
        const { input } = setup({ onRedo });

        const event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 89,
          ctrlKey: true,
        });

        Object.assign(event, {
          preventDefault: jest.fn(),
        });

        fireEvent(input, event);

        expect(onRedo).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('on mac platform', () => {
      beforeEach(() => {
        browser.mac = true;
      });

      it('on cmd+z calls `onUndo` handler', async () => {
        const onUndo = jest.fn();
        const { input } = setup({ onUndo });

        const event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 90,
          metaKey: true,
        });

        Object.assign(event, {
          preventDefault: jest.fn(),
        });

        fireEvent(input, event);

        expect(onUndo).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('on cmd+shift+z calls onRedo handler', () => {
        const onRedo = jest.fn();
        const { input } = setup({ onRedo });

        const event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 90,
          shiftKey: true,
          metaKey: true,
        });

        Object.assign(event, {
          preventDefault: jest.fn(),
        });

        fireEvent(input, event);

        expect(onRedo).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not undo if cmd+z is pressed with shift', () => {
        const onUndo = jest.fn();
        const { input } = setup({ onUndo });

        const event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 90,
          shiftKey: true,
          metaKey: true,
        });

        Object.assign(event, {
          preventDefault: jest.fn(),
        });

        fireEvent(input, event);

        expect(onUndo).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  it('should not focus input if `autoFocus` prop is not provided', () => {
    const { input } = setup();

    expect(input).not.toHaveFocus();
  });

  it('should focus input if `autoFocus` prop set to true', () => {
    const { input } = setup({ autoFocus: true });

    expect(input).toHaveFocus();
  });

  it('should stop propagation of the event when clear button is activated', async () => {
    setup({ value: 'XYZ' });

    const clearButton = screen.getByTestId(testIds.clearUrlButton);
    clearButton.focus();

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.assign(event, {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });

    // Click on clear button
    fireEvent(clearButton, event);
    // Prevent default should have been called
    expect(event.preventDefault).toHaveBeenCalled();
    // Stop propagation should have been called
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
