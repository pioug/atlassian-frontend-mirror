import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';

import { Popup, PopupContent, PopupTrigger } from '../../compositional/popup';
import type { TriggerProps } from '../../types';

describe('Popup with composable API', () => {
  it('should render correctly when popup is closed', () => {
    render(
      <Popup>
        <PopupTrigger>
          {(triggerProps) => (
            <button type="button" {...triggerProps}>
              trigger
            </button>
          )}
        </PopupTrigger>
        <PopupContent>{() => <div>content</div>}</PopupContent>
      </Popup>,
    );

    const trigger = screen.getByText('trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('should render correctly when popup is open', () => {
    render(
      <Popup isOpen>
        <PopupTrigger>
          {(triggerProps) => (
            <button type="button" {...triggerProps}>
              trigger
            </button>
          )}
        </PopupTrigger>
        <PopupContent>{() => <div>content</div>}</PopupContent>
      </Popup>,
    );

    const trigger = screen.getByText('trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('should call onClose when clicking outside the popup', async () => {
    const onClose = jest.fn();
    render(
      <Popup isOpen>
        <PopupTrigger>
          {(triggerProps) => (
            <button type="button" {...triggerProps}>
              trigger
            </button>
          )}
        </PopupTrigger>
        <PopupContent onClose={onClose}>
          {() => <div>content</div>}
        </PopupContent>
      </Popup>,
    );

    await userEvent.click(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when pressing ESC key', async () => {
    const onClose = jest.fn();
    render(
      <Popup isOpen>
        <PopupTrigger>
          {(triggerProps) => (
            <button type="button" {...triggerProps}>
              trigger
            </button>
          )}
        </PopupTrigger>
        <PopupContent onClose={onClose}>
          {() => <div>content</div>}
        </PopupContent>
      </Popup>,
    );

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking on trigger', async () => {
    const onClose = jest.fn();
    render(
      <Popup isOpen>
        <PopupTrigger>
          {(triggerProps) => (
            <button type="button" onClick={onClose} {...triggerProps}>
              trigger
            </button>
          )}
        </PopupTrigger>
        <PopupContent onClose={onClose}>
          {() => <div>content</div>}
        </PopupContent>
      </Popup>,
    );

    await userEvent.click(screen.getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe('`aria-controls`', () => {
    it('should be set if no `id` provided', () => {
      render(
        <Popup isOpen>
          <PopupTrigger>
            {(triggerProps) => (
              <button type="button" {...triggerProps}>
                trigger
              </button>
            )}
          </PopupTrigger>
          <PopupContent testId="popup-container">
            {() => <div>content</div>}
          </PopupContent>
        </Popup>,
      );

      const triggerAriaControlsValue = screen
        .getByText('trigger')
        .getAttribute('aria-controls');

      expect(triggerAriaControlsValue).toBeTruthy();

      // They should match
      expect(screen.getByTestId('popup-container')).toHaveAttribute(
        'id',
        triggerAriaControlsValue,
      );
    });

    it('should be set with the provided `id`', () => {
      const id = 'id';

      render(
        <Popup id={id} isOpen>
          <PopupTrigger>
            {(triggerProps) => (
              <button type="button" {...triggerProps}>
                trigger
              </button>
            )}
          </PopupTrigger>
          <PopupContent testId="popup-container">
            {() => <div>content</div>}
          </PopupContent>
        </Popup>,
      );

      expect(screen.getByText('trigger')).toHaveAttribute('aria-controls', id);

      expect(screen.getByTestId('popup-container')).toHaveAttribute('id', id);
    });
  });

  it('should throw an error when PopupContent is not a child of Popup', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(__noop);

    expect(() => {
      render(<PopupContent>{() => <div>content</div>}</PopupContent>);
    }).toThrowError();

    consoleError.mockRestore();
  });

  it('should throw an error when PopupTrigger is not a child of Popup', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(__noop);

    expect(() => {
      render(<PopupTrigger>{() => <div>trigger</div>}</PopupTrigger>);
    }).toThrowError();

    consoleError.mockRestore();
  });

  it('should render the popup inside the parent when shouldRenderToParent is true', () => {
    render(
      <div data-testid="parent">
        <Popup isOpen>
          <PopupTrigger>
            {(triggerProps) => (
              <button type="button" {...triggerProps}>
                trigger
              </button>
            )}
          </PopupTrigger>
          <PopupContent shouldRenderToParent>
            {() => <div>content</div>}
          </PopupContent>
        </Popup>
      </div>,
    );

    const parent = screen.getByTestId('parent');
    const popup = screen.getByText('content');

    expect(parent).toContainElement(popup);
  });

  it('should not render the popup inside the parent when shouldRenderToParent is false', () => {
    render(
      <div data-testid="parent">
        <Popup isOpen>
          <PopupTrigger>
            {(triggerProps) => (
              <button type="button" {...triggerProps}>
                trigger
              </button>
            )}
          </PopupTrigger>
          <PopupContent shouldRenderToParent={false}>
            {() => <div>content</div>}
          </PopupContent>
        </Popup>
      </div>,
    );

    const parent = screen.getByTestId('parent');
    const popup = screen.queryByText('content');

    expect(popup).toBeInTheDocument();
    expect(parent).not.toContainElement(popup);
  });

  it('does not re-render the trigger unnecessarily', () => {
    const triggerRender = jest.fn();
    const contentRender = jest.fn();

    const trigger = (props: TriggerProps) => {
      triggerRender();
      return (
        <button
          type="button"
          ref={props.ref}
          aria-expanded={props['aria-expanded']}
        >
          trigger
        </button>
      );
    };

    const content = () => {
      contentRender();
      return <div>content</div>;
    };

    const { rerender } = render(
      <Popup>
        <PopupTrigger>{trigger}</PopupTrigger>
        <PopupContent>{content}</PopupContent>
      </Popup>,
    );

    expect(triggerRender).toHaveBeenCalledTimes(1);

    rerender(
      <Popup isOpen>
        <PopupTrigger>{trigger}</PopupTrigger>
        <PopupContent>{content}</PopupContent>
      </Popup>,
    );

    expect(triggerRender).toHaveBeenCalledTimes(2);

    rerender(
      <Popup isOpen>
        <PopupTrigger>{trigger}</PopupTrigger>
        <PopupContent>{content}</PopupContent>
      </Popup>,
    );
  });
});
