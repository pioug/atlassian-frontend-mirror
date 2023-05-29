import React, { Dispatch, forwardRef, SetStateAction, useRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { replaceRaf } from 'raf-stub';

import { Popup } from '../../popup';
import { ContentProps, PopupComponentProps, TriggerProps } from '../../types';

// override requestAnimationFrame letting us execute it when we need
replaceRaf();
const user = userEvent.setup();

describe('Popup', () => {
  const defaultProps = {
    content: () => <div>content</div>,
    isOpen: false,
    trigger: (props: TriggerProps) => (
      <button
        {...props}
        type="button"
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
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...props}
        type="button"
        // @ts-ignore
        ref={props.ref}
      >
        trigger
      </button>
    );
    render(<Popup {...defaultProps} isOpen={false} trigger={trigger} />);

    const triggerEl = screen.getByText('trigger');

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
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...props}
        type="button"
        // @ts-ignore
        ref={props.ref}
      >
        trigger
      </button>
    );
    render(<Popup {...defaultProps} isOpen trigger={trigger} />);

    const triggerEl = screen.getByText('trigger');

    expect({
      'aria-expanded': triggerEl.getAttribute('aria-expanded'),
      'aria-haspopup': triggerEl.getAttribute('aria-haspopup'),
    }).toEqual({
      'aria-expanded': 'true',
      'aria-haspopup': 'true',
    });
  });

  it('does not render the content when the popup is not open', () => {
    render(
      <Popup
        {...defaultProps}
        content={() => <div>content</div>}
        isOpen={false}
      />,
    );
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('renders the content correctly when the popup is open', () => {
    render(
      <Popup {...defaultProps} content={() => <div>content</div>} isOpen />,
    );
    expect(screen.queryByText('content')).toBeInTheDocument();
  });

  it('renders the content correctly when the popup is opened', () => {
    const content = () => <div>content</div>;
    const { rerender } = render(
      <Popup {...defaultProps} content={content} isOpen={false} />,
    );
    rerender(<Popup {...defaultProps} content={content} isOpen />);

    expect(screen.queryByText('content')).toBeInTheDocument();
  });

  it('does not render the custom popup when the popup is not open', () => {
    render(
      <Popup
        {...defaultProps}
        isOpen={false}
        popupComponent={forwardRef<HTMLDivElement, PopupComponentProps>(
          ({ children, ...props }, ref) => (
            <div {...props} ref={ref}>
              popup component
              <div>{children}</div>
            </div>
          ),
        )}
      />,
    );

    expect(screen.queryByText('popup component')).not.toBeInTheDocument();
  });

  it('renders the custom popup and its content correctly when the popup is open', () => {
    render(
      <Popup
        {...defaultProps}
        content={() => <div>content</div>}
        isOpen
        popupComponent={forwardRef<HTMLDivElement, PopupComponentProps>(
          ({ children, ...props }, ref) => (
            <div {...props} ref={ref}>
              popup component
              <div>{children}</div>
            </div>
          ),
        )}
      />,
    );

    expect(screen.queryByText('popup component')).toBeInTheDocument();
    expect(screen.queryByText('content')).toBeInTheDocument();
  });

  it('renders the custom popup and its content correctly when the popup is opened', () => {
    const props = {
      content: () => <div>content</div>,
      popupComponent: forwardRef<HTMLDivElement, PopupComponentProps>(
        ({ children, ...props }, ref) => (
          <div {...props} ref={ref}>
            popup component
            <div>{children}</div>
          </div>
        ),
      ),
    };

    const { rerender } = render(
      <Popup {...defaultProps} {...props} isOpen={false} />,
    );

    rerender(<Popup {...defaultProps} {...props} isOpen />);

    expect(screen.queryByText('popup component')).toBeInTheDocument();
    expect(screen.queryByText('content')).toBeInTheDocument();
  });

  it('does not re-render the trigger unnecessarily', () => {
    const triggerRender = jest.fn();
    const contentRender = jest.fn();

    const trigger = (props: TriggerProps) => {
      triggerRender();
      return (
        <button
          // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
          {...props}
          type="button"
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

  it('does not call onClose after pressing escape when the popup is not open', async () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );

    await user.click(baseElement);
    await user.keyboard('Escape');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose after pressing escape when the popup is open', async () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen onClose={onClose} />,
    );

    await user.click(baseElement);
    await user.keyboard('Escape');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after pressing escape when the popup is opened', async () => {
    const onClose = jest.fn();
    const { baseElement, rerender } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );

    rerender(<Popup {...defaultProps} isOpen onClose={onClose} />);

    await user.click(baseElement);
    await user.keyboard('Escape');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking on the trigger when the popup is open', async () => {
    const onClose = jest.fn();
    render(
      <Popup
        {...defaultProps}
        isOpen
        onClose={onClose}
        trigger={() => <button type="button">trigger</button>}
      />,
    );

    await user.click(screen.getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking on the trigger when the popup is opened', async () => {
    const onClose = jest.fn();
    const trigger = () => <button type="button">trigger</button>;
    const { rerender } = render(
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

    await user.click(screen.getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking outside of the popup when the popup is open', async () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen onClose={onClose} />,
    );

    await user.click(baseElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking outside of the popup when the popup is opened', async () => {
    const onClose = jest.fn();
    const { baseElement, rerender } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );
    rerender(<Popup {...defaultProps} isOpen onClose={onClose} />);

    await user.click(baseElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when calling onClose within the content', async () => {
    const onClose = jest.fn();
    render(
      <Popup
        {...defaultProps}
        content={({ onClose: onClick }) => (
          <button type="button" onClick={onClick}>
            x
          </button>
        )}
        isOpen
        onClose={onClose}
      />,
    );

    await user.click(screen.getByText('x'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not focus the content when the popup is open', () => {
    render(
      <Popup {...defaultProps} content={() => <div>content</div>} isOpen />,
    );

    expect(screen.getByText('content')).not.toHaveFocus();
  });

  it('does not focus the content when the popup is opened', () => {
    const content = () => <div>content</div>;
    const { rerender } = render(
      <Popup {...defaultProps} content={content} isOpen={false} />,
    );
    rerender(<Popup {...defaultProps} content={content} isOpen />);

    expect(screen.getByText('content')).not.toHaveFocus();
  });

  it('focuses the specified element inside of the content when the popup is open', () => {
    render(
      <Popup
        {...defaultProps}
        content={({ setInitialFocusRef }) => (
          <button
            type="button"
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

    expect(screen.getByText('focused content')).toHaveFocus();
  });

  it('focuses the specified element inside of the content when the popup is opened', () => {
    const content = ({ setInitialFocusRef }: ContentProps) => (
      <button
        type="button"
        ref={setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>}
      >
        focused content
      </button>
    );

    const { rerender } = render(
      <Popup {...defaultProps} content={content} isOpen={false} />,
    );

    rerender(<Popup {...defaultProps} content={content} isOpen />);

    //@ts-ignore
    requestAnimationFrame.step();
    //@ts-ignore
    requestAnimationFrame.step();

    expect(screen.getByText('focused content')).toHaveFocus();
  });

  it('popup stays open if propagation is stopped on an event before it reaches window', async () => {
    const content = () => (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        Popup content
      </button>
    );

    render(
      <div>
        <Popup {...defaultProps} content={content} isOpen />
        <Popup {...defaultProps} content={content} isOpen />
      </div>,
    );

    await user.click((await screen.findAllByText('Popup content'))[0]);

    expect((await screen.findAllByText('Popup content'))[1]).toBeDefined();
  });

  it('popup stays open when clicked element (which is inside content) is removed from the DOM', async () => {
    const onClose = jest.fn();
    const Component = () => {
      const ref = useRef<HTMLButtonElement | null>(null);

      return (
        <button
          type="button"
          ref={ref}
          onClick={() => ref.current && ref.current.remove()}
        >
          Button content
        </button>
      );
    };

    render(
      <Popup
        {...defaultProps}
        onClose={onClose}
        content={() => <Component />}
        isOpen
      />,
    );

    await user.click(screen.getByText('Button content'));

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  describe('with iframe', () => {
    const Iframe = ({ title = 'outerIframe' }: { title?: string }) => (
      <iframe width="100px" height="100px" title={title} />
    );

    it('should call onClose on iframe click if iframe is outside popup', async () => {
      const onClose = jest.fn();

      render(
        <div>
          <Popup
            {...defaultProps}
            onClose={onClose}
            content={() => <div>content</div>}
            trigger={() => <button type="button">trigger</button>}
            testId="popup"
            isOpen
          />
          <Iframe />
        </div>,
      );

      const popupWrapper = screen.getByTestId('popup');
      expect(popupWrapper).toBeInTheDocument();
      expect(popupWrapper).toHaveAttribute('data-ds--popup', 'true');

      await user.click(screen.getByTitle('outerIframe'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose on iframe click if iframe is inside popup', async () => {
      const onClose = jest.fn();

      render(
        <div>
          <Popup
            {...defaultProps}
            onClose={onClose}
            content={() => <Iframe title="innerIframe" />}
            trigger={() => <button type="button">trigger</button>}
            isOpen
          />
          <Iframe />
        </div>,
      );

      const nestedIframe = screen.getByTitle('innerIframe');
      expect(nestedIframe).toBeInTheDocument();
      await user.click(nestedIframe);
      expect(onClose).toHaveBeenCalledTimes(0);

      await user.click(screen.getByTitle('outerIframe'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
