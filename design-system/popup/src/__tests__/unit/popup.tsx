import React, {
  type Dispatch,
  forwardRef,
  Fragment,
  type SetStateAction,
  useRef,
  useState,
} from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { replaceRaf } from 'raf-stub';

import Button from '@atlaskit/button/new';

import { Popup } from '../../popup';
import {
  type ContentProps,
  type PopupComponentProps,
  type TriggerProps,
} from '../../types';

// override requestAnimationFrame letting us execute it when we need
replaceRaf();

const NestedPopup = ({ index = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <Button>Create project</Button>
      <Button>View all projects</Button>
      <Popup
        isOpen={isOpen}
        placement="right-start"
        onClose={() => setIsOpen(false)}
        content={() => <NestedPopup index={index + 1} />}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            isSelected={isOpen}
            testId={`popup-trigger-${index}`}
            onClick={(e) => {
              setIsOpen(true);
              e.stopPropagation();
            }}
          >
            More actions
          </Button>
        )}
      />
    </Fragment>
  );
};

const PopupNested = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => <NestedPopup />}
      placement="bottom-start"
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          testId="popup-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          Actions
        </Button>
      )}
    />
  );
};

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

  describe('should close nested popup correctly', () => {
    render(<PopupNested />);

    const popupTrigger = screen.getByTestId('popup-trigger');
    fireEvent.click(popupTrigger);
    const popupTrigger0 = screen.getByTestId('popup-trigger-0');
    fireEvent.click(popupTrigger0);
    const popupTrigger1 = screen.getByTestId('popup-trigger-1');
    fireEvent.click(popupTrigger1);
    expect(screen.getByTestId('popup-trigger-2')).toBeInTheDocument();
  });

  describe('with iframe', () => {
    const Iframe = ({ title = 'outerIframe' }: { title?: string }) => (
      <iframe width="100px" height="100px" title={title} />
    );
    it('should call onClose on iframe click if iframe is outside popup', () => {
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
      expect(popupWrapper).toHaveAttribute('data-ds--level');
      fireEvent.click(screen.getByTitle('outerIframe'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

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

  describe('`aria-controls`', () => {
    it('should be set if no `id` provided', () => {
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
      render(
        <Popup
          {...defaultProps}
          isOpen={true}
          trigger={trigger}
          testId="popup-container"
        />,
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

      render(
        <Popup
          {...defaultProps}
          id={id}
          isOpen={true}
          trigger={trigger}
          testId="popup-container"
        />,
      );

      expect(screen.getByText('trigger')).toHaveAttribute('aria-controls', id);

      expect(screen.getByTestId('popup-container')).toHaveAttribute('id', id);
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

  it('does not call onClose after pressing escape when the popup is not open', () => {
    const onClose = jest.fn();
    render(<Popup {...defaultProps} isOpen={false} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose after pressing escape when the popup is open', () => {
    const onClose = jest.fn();
    render(<Popup {...defaultProps} isOpen onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

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
    render(
      <Popup
        {...defaultProps}
        isOpen
        onClose={onClose}
        trigger={() => <button type="button">trigger</button>}
      />,
    );

    fireEvent.click(screen.getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking on the trigger when the popup is opened', () => {
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

    fireEvent.click(screen.getByText('trigger'));

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

    fireEvent.click(screen.getByText('x'));

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

    fireEvent.click((await screen.findAllByText('Popup content'))[0]);

    expect((await screen.findAllByText('Popup content'))[1]).toBeDefined();
  });

  it('popup stays open when clicked element (which is inside content) is removed from the DOM', () => {
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

    fireEvent.click(screen.getByText('Button content'));

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('popup renders inside parent when the shouldRenderToParent is passed', () => {
    render(<Popup {...defaultProps} isOpen shouldRenderToParent />);
    const popupEl = screen.getByText('content');
    const triggerEl = screen.getByText('trigger');
    const triggerParent = triggerEl.parentElement as HTMLElement;
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(triggerParent).toContainElement(popupEl);
  });

  it('popup renders outside parent when the shouldRenderToParent is not passed', () => {
    render(<Popup {...defaultProps} isOpen />);
    const popupEl = screen.getByText('content');
    const triggerEl = screen.getByText('trigger');
    const triggerParent = triggerEl.parentElement as HTMLElement;
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(triggerParent).not.toContainElement(popupEl);
  });

  it('popup renders position fixed by default', () => {
    render(<Popup {...defaultProps} isOpen />);
    const popupEl = screen.getByText('content');
    const popupParent = popupEl.parentElement as HTMLElement;
    expect(popupParent).toHaveStyle('position: fixed');
  });

  it('popup renders position absolute when specified', () => {
    render(<Popup {...defaultProps} isOpen strategy="absolute" />);
    const popupEl = screen.getByText('content');
    const popupParent = popupEl.parentElement as HTMLElement;
    expect(popupParent).toHaveStyle('position: absolute');
  });

  it('popup renders position fixed when specified', () => {
    render(<Popup {...defaultProps} isOpen strategy="fixed" />);
    const popupEl = screen.getByText('content');
    const popupParent = popupEl.parentElement as HTMLElement;
    expect(popupParent).toHaveStyle('position: fixed');
  });
});
