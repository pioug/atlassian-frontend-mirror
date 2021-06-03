import React, { Dispatch, forwardRef, SetStateAction, useRef } from 'react';

import { fireEvent, render } from '@testing-library/react';
import { replaceRaf } from 'raf-stub';

import { Popup } from '../../Popup';
import { ContentProps, PopupComponentProps, TriggerProps } from '../../types';

// override requestAnimationFrame letting us execute it when we need
replaceRaf();

describe('Popup', () => {
  const defaultProps = {
    content: () => <div>content</div>,
    isOpen: false,
    trigger: (props: TriggerProps) => (
      <button
        {...props}
        // @ts-ignore
        ref={props.ref}
      >
        trigger
      </button>
    ),
  };

  it('renders the trigger correctly when the popup is not open', () => {
    const trigger = (props: TriggerProps) => (
      <button
        {...props}
        // @ts-ignore
        ref={props.ref}
      >
        trigger
      </button>
    );
    const { getByText } = render(
      <Popup {...defaultProps} isOpen={false} trigger={trigger} />,
    );

    const triggerEl = getByText('trigger');

    expect({
      'aria-expanded': triggerEl.getAttribute('aria-expanded'),
      'aria-haspopup': triggerEl.getAttribute('aria-haspopup'),
    }).toEqual({
      'aria-expanded': 'false',
      'aria-haspopup': 'true',
    });
  });

  it('renders the trigger correctly when the popup is open', () => {
    const trigger = (props: TriggerProps) => (
      <button
        {...props}
        // @ts-ignore
        ref={props.ref}
      >
        trigger
      </button>
    );
    const { getByText } = render(
      <Popup {...defaultProps} isOpen trigger={trigger} />,
    );

    const triggerEl = getByText('trigger');

    expect({
      'aria-expanded': triggerEl.getAttribute('aria-expanded'),
      'aria-haspopup': triggerEl.getAttribute('aria-haspopup'),
    }).toEqual({
      'aria-expanded': 'true',
      'aria-haspopup': 'true',
    });
  });

  it('does not render the content when the popup is not open', () => {
    const { queryByText } = render(
      <Popup
        {...defaultProps}
        content={() => <div>content</div>}
        isOpen={false}
      />,
    );
    expect(queryByText('content')).not.toBeInTheDocument();
  });

  it('renders the content correctly when the popup is open', () => {
    const { queryByText } = render(
      <Popup {...defaultProps} content={() => <div>content</div>} isOpen />,
    );
    expect(queryByText('content')).toBeInTheDocument();
  });

  it('renders the content correctly when the popup is opened', () => {
    const content = () => <div>content</div>;
    const { queryByText, rerender } = render(
      <Popup {...defaultProps} content={content} isOpen={false} />,
    );
    rerender(<Popup {...defaultProps} content={content} isOpen />);

    expect(queryByText('content')).toBeInTheDocument();
  });

  it('does not render the custom popup when the popup is not open', () => {
    const { queryByText } = render(
      <Popup
        {...defaultProps}
        isOpen={false}
        popupComponent={forwardRef<HTMLDivElement, PopupComponentProps>(
          ({ children, ...props }, ref) => (
            <div ref={ref} {...props}>
              popup component
              <div>{children}</div>
            </div>
          ),
        )}
      />,
    );

    expect(queryByText('popup component')).not.toBeInTheDocument();
  });

  it('renders the custom popup and its content correctly when the popup is open', () => {
    const { queryByText } = render(
      <Popup
        {...defaultProps}
        content={() => <div>content</div>}
        isOpen
        popupComponent={forwardRef<HTMLDivElement, PopupComponentProps>(
          ({ children, ...props }, ref) => (
            <div ref={ref} {...props}>
              popup component
              <div>{children}</div>
            </div>
          ),
        )}
      />,
    );

    expect(queryByText('popup component')).toBeInTheDocument();
    expect(queryByText('content')).toBeInTheDocument();
  });

  it('renders the custom popup and its content correctly when the popup is opened', () => {
    const props = {
      content: () => <div>content</div>,
      popupComponent: forwardRef<HTMLDivElement, PopupComponentProps>(
        ({ children, ...props }, ref) => (
          <div ref={ref} {...props}>
            popup component
            <div>{children}</div>
          </div>
        ),
      ),
    };

    const { queryByText, rerender } = render(
      <Popup {...defaultProps} {...props} isOpen={false} />,
    );

    rerender(<Popup {...defaultProps} {...props} isOpen />);

    expect(queryByText('popup component')).toBeInTheDocument();
    expect(queryByText('content')).toBeInTheDocument();
  });

  it('does not re-render the trigger unnecessarily', () => {
    const triggerRender = jest.fn();
    const contentRender = jest.fn();

    const trigger = (props: TriggerProps) => {
      triggerRender();
      return (
        <button
          {...props}
          // @ts-ignore
          ref={props.ref}
        >
          trigger
        </button>
      );
    };

    const content = () => {
      contentRender();
      return <div>content</div>;
    };

    const props = {
      trigger: trigger,
      content: content,
    };

    const { rerender } = render(
      <Popup {...defaultProps} {...props} isOpen={false} />,
    );

    expect(triggerRender).toHaveBeenCalledTimes(1);
    expect(contentRender).toHaveBeenCalledTimes(0);

    rerender(<Popup {...defaultProps} {...props} isOpen />);

    expect(triggerRender).toHaveBeenCalledTimes(3);
    expect(contentRender).toHaveBeenCalledTimes(3);
  });

  it('does not call onClose after pressing escape when the popup is not open', () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );

    fireEvent.keyDown(baseElement, { key: 'Escape', code: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose after pressing escape when the popup is open', () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen onClose={onClose} />,
    );

    fireEvent.keyDown(baseElement, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after pressing escape when the popup is opened', () => {
    const onClose = jest.fn();
    const { baseElement, rerender } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );

    rerender(<Popup {...defaultProps} isOpen onClose={onClose} />);

    fireEvent.keyDown(baseElement, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking on the trigger when the popup is open', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Popup
        {...defaultProps}
        isOpen
        onClose={onClose}
        trigger={() => <button>trigger</button>}
      />,
    );

    fireEvent.click(getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking on the trigger when the popup is opened', () => {
    const onClose = jest.fn();
    const trigger = () => <button>trigger</button>;
    const { getByText, rerender } = render(
      <Popup
        {...defaultProps}
        isOpen={false}
        onClose={onClose}
        trigger={trigger}
      />,
    );

    rerender(
      <Popup {...defaultProps} isOpen onClose={onClose} trigger={trigger} />,
    );

    fireEvent.click(getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking outside of the popup when the popup is open', () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen onClose={onClose} />,
    );

    fireEvent.click(baseElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking outside of the popup when the popup is opened', () => {
    const onClose = jest.fn();
    const { baseElement, rerender } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );
    rerender(<Popup {...defaultProps} isOpen onClose={onClose} />);

    fireEvent.click(baseElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when calling onClose within the content', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Popup
        {...defaultProps}
        content={({ onClose: onClick }) => <button onClick={onClick}>x</button>}
        isOpen
        onClose={onClose}
      />,
    );

    fireEvent.click(getByText('x'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not focus the content when the popup is open', () => {
    const { getByText } = render(
      <Popup {...defaultProps} content={() => <div>content</div>} isOpen />,
    );

    expect(getByText('content')).not.toHaveFocus();
  });

  it('does not focus the content when the popup is opened', () => {
    const content = () => <div>content</div>;
    const { getByText, rerender } = render(
      <Popup {...defaultProps} content={content} isOpen={false} />,
    );
    rerender(<Popup {...defaultProps} content={content} isOpen />);

    expect(getByText('content')).not.toHaveFocus();
  });

  it('focuses the specified element inside of the content when the popup is open', () => {
    const { getByText } = render(
      <Popup
        {...defaultProps}
        content={({ setInitialFocusRef }) => (
          <button
            ref={
              setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>
            }
          >
            focused content
          </button>
        )}
        isOpen
      />,
    );

    //@ts-ignore
    requestAnimationFrame.step();
    //@ts-ignore
    requestAnimationFrame.step();

    expect(getByText('focused content')).toHaveFocus();
  });

  it('focuses the specified element inside of the content when the popup is opened', () => {
    const content = ({ setInitialFocusRef }: ContentProps) => (
      <button
        ref={setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>}
      >
        focused content
      </button>
    );

    const { getByText, rerender } = render(
      <Popup {...defaultProps} content={content} isOpen={false} />,
    );

    rerender(<Popup {...defaultProps} content={content} isOpen />);

    //@ts-ignore
    requestAnimationFrame.step();
    //@ts-ignore
    requestAnimationFrame.step();

    expect(getByText('focused content')).toHaveFocus();
  });

  it('popup stays open if propagation is stopped on an event before it reaches window', async () => {
    const content = () => (
      <button
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        Popup content
      </button>
    );

    const { findAllByText } = render(
      <div>
        <Popup {...defaultProps} content={content} isOpen />
        <Popup {...defaultProps} content={content} isOpen />
      </div>,
    );

    fireEvent.click((await findAllByText('Popup content'))[0]);

    expect((await findAllByText('Popup content'))[1]).toBeDefined();
  });

  it('popup stays open when clicked element (which is inside content) is removed from the DOM', () => {
    const onClose = jest.fn();
    const Component = () => {
      const ref = useRef<HTMLButtonElement | null>(null);

      return (
        <button ref={ref} onClick={() => ref.current && ref.current.remove()}>
          Button content
        </button>
      );
    };

    const { getByText } = render(
      <Popup
        {...defaultProps}
        onClose={onClose}
        content={() => <Component />}
        isOpen
      />,
    );

    fireEvent.click(getByText('Button content'));

    expect(onClose).toHaveBeenCalledTimes(0);
  });
});
