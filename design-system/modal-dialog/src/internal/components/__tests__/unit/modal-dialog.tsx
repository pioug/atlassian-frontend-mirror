import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import ModalDialog, { ModalTransition } from '../../../../index';
import { WIDTH_ENUM } from '../../../constants';
import { dialogHeight, dialogWidth } from '../../../styles/modal';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

const noop = () => {};
const MyContent = () => <div data-testid="test-content">Hello</div>;

test('should render a modal dialog with content', () => {
  const { queryByTestId } = render(
    <ModalTransition>
      <ModalDialog onClose={noop} testId="modal">
        <MyContent />
      </ModalDialog>
    </ModalTransition>,
  );

  const content = queryByTestId('test-content');
  expect(content).not.toBeNull();
});

describe('components body', () => {
  afterEach(cleanup);

  it('should mount only once', () => {
    const mock = jest.fn();
    const CountContent = () => {
      mock();
      return <div>Hello</div>;
    };
    const Body = React.forwardRef<
      HTMLDivElement,
      React.AllHTMLAttributes<HTMLDivElement>
    >((props, ref) => <div ref={ref}>{props.children}</div>);

    render(
      <ModalTransition>
        <ModalDialog onClose={noop} components={{ Body }}>
          <CountContent />
        </ModalDialog>
      </ModalTransition>,
    );
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should be rendered correctly without attaching ref on its DOM element', () => {
    const Body = React.forwardRef<
      HTMLDivElement,
      React.AllHTMLAttributes<HTMLDivElement>
    >((props, ref) => <div>{props.children}</div>);

    const wrapper = render(
      <ModalTransition>
        <ModalDialog onClose={noop} components={{ Body }}>
          <MyContent />
        </ModalDialog>
      </ModalTransition>,
    );

    expect(wrapper.queryByTestId('test-content')).not.toBeNull();
    cleanup();

    const deprecatedWrapper = render(
      <ModalTransition>
        <ModalDialog onClose={noop} body={Body}>
          <MyContent />
        </ModalDialog>
      </ModalTransition>,
    );

    expect(deprecatedWrapper.queryByTestId('test-content')).not.toBeNull();
  });
});

describe('modal-dialog children', () => {
  afterEach(cleanup);

  it('should mount only once', () => {
    const mock = jest.fn();
    const CountContent = () => {
      mock();
      return <div>Hello</div>;
    };

    render(
      <ModalTransition>
        <ModalDialog onClose={noop}>
          <CountContent />
        </ModalDialog>
      </ModalTransition>,
    );
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

describe('modal-dialog', () => {
  afterEach(cleanup);

  describe('props', () => {
    describe('height', () => {
      it('should be passed to Dialog', () => {
        const { getByTestId } = render(
          <ModalDialog onClose={noop} height="42%" testId="modal" />,
        );

        const dialog = getByTestId('modal');
        expect(dialog).toHaveStyleDeclaration('height', '42%');
      });

      it('should return px if number', () => {
        expect(dialogHeight({ heightValue: 42 })).toBe('42px');
      });

      it('should return raw value if string', () => {
        expect(dialogHeight({ heightValue: '42%' })).toBe('42%');
        expect(dialogHeight({ heightValue: '42em' })).toBe('42em');
        expect(dialogHeight({ heightValue: 'initial' })).toBe('initial');
      });

      it('should return "auto" if not supplied', () => {
        expect(dialogHeight({})).toBe('auto');
      });
    });
    describe('width', () => {
      it('should return px if number', () => {
        expect(dialogWidth({ widthValue: 42 })).toBe('42px');
      });

      it('should return raw value if string', () => {
        expect(dialogWidth({ widthValue: '42%' })).toBe('42%');
        expect(dialogWidth({ widthValue: '42em' })).toBe('42em');
        expect(dialogWidth({ widthValue: 'auto' })).toBe('auto');
      });

      it('should return "auto" if not supplied', () => {
        expect(dialogWidth({})).toBe('auto');
      });

      Object.entries(WIDTH_ENUM.widths).forEach(([widthName, widthValue]) => {
        it(`width = "${widthName}" is applied uniquely`, () => {
          const { getByTestId } = render(
            <ModalDialog width={widthName} onClose={noop} testId="modal" />,
          );

          const dialog = getByTestId('modal--positioner');
          expect(dialog).toHaveStyleDeclaration('width', `${widthValue}px`);
        });
      });
    });

    describe('container', () => {
      it('should render element set via components prop', () => {
        const { getByTestId } = render(
          <ModalDialog
            onClose={noop}
            testId="modal"
            components={{ Container: 'form' }}
          />,
        );

        const content = getByTestId('modal');
        const form = content.querySelector('form');

        expect(form).not.toBeNull();
      });
    });

    describe('header', () => {
      it('should render when set via components prop', () => {
        const node = <span data-testid="custom-header">My header</span>;
        const { queryByTestId } = render(
          <ModalDialog components={{ Header: () => node }} onClose={noop} />,
        );

        expect(queryByTestId('custom-header')).not.toBeNull();
      });
      it('should render when set via (deprecated) header prop', () => {
        const node = <span data-testid="custom-header">My header</span>;
        const { queryByTestId } = render(
          <ModalDialog header={() => node} onClose={noop} />,
        );

        expect(queryByTestId('custom-header')).not.toBeNull();
        expect(warnOnce).toHaveBeenCalled();
      });
      it('should prefer the components prop over header prop ', () => {
        const node = <span data-testid="custom-header">My header</span>;
        const nodeDeprecated = (
          <span data-testid="custom-deprecated-header">
            My deprecated header
          </span>
        );

        const { queryByTestId } = render(
          <ModalDialog
            header={() => nodeDeprecated}
            components={{ Header: () => node }}
            onClose={noop}
          />,
        );

        expect(queryByTestId('custom-header')).not.toBeNull();
        expect(queryByTestId('custom-deprecated-header')).toBeNull();
        expect(warnOnce).toHaveBeenCalled();
      });
    });

    describe('footer', () => {
      it('should render when set via components prop', () => {
        const node = <span data-testid="custom-footer">My footer</span>;
        const { queryByTestId } = render(
          <ModalDialog components={{ Footer: () => node }} onClose={noop} />,
        );

        expect(queryByTestId('custom-footer')).not.toBeNull();
      });
      it('should render when set via (deprecated) footer prop', () => {
        const node = <span data-testid="custom-footer">My footer</span>;
        const { queryByTestId } = render(
          <ModalDialog footer={() => node} onClose={noop} />,
        );

        expect(queryByTestId('custom-footer')).not.toBeNull();
        expect(warnOnce).toHaveBeenCalled();
      });
      it('should prefer the components prop over footer prop ', () => {
        const node = <span data-testid="custom-footer">My footer</span>;
        const nodeDeprecated = (
          <span data-testid="custom-deprecated-footer">
            My deprecated footer
          </span>
        );

        const { queryByTestId } = render(
          <ModalDialog
            footer={() => nodeDeprecated}
            components={{ Footer: () => node }}
            onClose={noop}
          />,
        );

        expect(queryByTestId('custom-footer')).not.toBeNull();
        expect(queryByTestId('custom-deprecated-footer')).toBeNull();
        expect(warnOnce).toHaveBeenCalled();
      });
    });

    describe('body', () => {
      it('should render when set via components prop', () => {
        const Node = React.forwardRef((_, ref: any) => {
          return (
            <span data-testid="custom-body" ref={ref}>
              My body
            </span>
          );
        });

        const { queryByTestId } = render(
          <ModalDialog components={{ Body: Node }} onClose={noop} />,
        );

        expect(queryByTestId('custom-body')).not.toBeNull();
      });

      it('should render when set via (deprecated) body prop', () => {
        const node = React.forwardRef((_, ref: any) => (
          <span data-testid="custom-body" ref={ref}>
            My body
          </span>
        ));

        const { queryByTestId } = render(
          <ModalDialog body={node} onClose={noop} />,
        );

        expect(queryByTestId('custom-body')).not.toBeNull();
        expect(warnOnce).toHaveBeenCalled();
      });

      it('should prefer the components prop over body prop ', () => {
        const node = React.forwardRef((_, ref: any) => {
          return (
            <span data-testid="custom-body" ref={ref}>
              My body
            </span>
          );
        });

        const nodeDeprecated = (
          <span data-testid="custom-deprecated-body">My body</span>
        );

        const { queryByTestId } = render(
          <ModalDialog
            body={() => nodeDeprecated}
            components={{ Body: node }}
            onClose={noop}
          />,
        );

        expect(queryByTestId('custom-body')).not.toBeNull();
        expect(queryByTestId('custom-deprecated-body')).toBeNull();
        expect(warnOnce).toHaveBeenCalled();
      });
    });

    describe('children', () => {
      it('should render when set', () => {
        const { queryByTestId } = render(
          <ModalDialog onClose={noop}>
            <form data-testid="custom-form">
              This is <strong>my</strong> form
            </form>
          </ModalDialog>,
        );

        expect(queryByTestId('custom-form')).not.toBeNull();
      });
    });

    describe('onClose', () => {
      it('should trigger when blanket clicked', () => {
        const spy = jest.fn();
        const { getByTestId } = render(
          <ModalDialog onClose={spy} testId="modal" />,
        );

        const blanket = getByTestId('modal--blanket');
        fireEvent.click(blanket);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should not trigger when modal content is clicked', () => {
        const spy = jest.fn();
        const { getByTestId } = render(
          <ModalDialog onClose={spy}>
            <MyContent />
          </ModalDialog>,
        );

        const content = getByTestId('test-content');
        fireEvent.click(content);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should close the modal when Escape is pressed', () => {
        const spy = jest.fn();
        render(
          <ModalDialog onClose={spy}>
            <MyContent />
          </ModalDialog>,
        );

        // The regular escape event
        const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
        });

        document.dispatchEvent(escapeKeyDownEvent);
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('set blanket as hidden', () => {
    const { getByTestId } = render(
      <ModalDialog isBlanketHidden={true} onClose={noop} testId="modal" />,
    );

    const blanket = getByTestId('modal--blanket');
    expect(blanket).toHaveStyle('opacity: 0');
  });

  describe('chromeless', () => {
    it('header should not render if dialog is chromeless', () => {
      const MyHeader = () => <span data-testid="custom-header">My header</span>;
      const { queryByTestId } = render(
        <ModalDialog
          isChromeless
          components={{ Header: MyHeader }}
          onClose={noop}
        />,
      );

      const header = queryByTestId('custom-header');
      expect(header).toBeNull();
    });

    it('footer should not render if dialog is chromeless', () => {
      const MyFooter = () => <span data-testid="custom-footer">My footer</span>;
      const { queryByTestId } = render(
        <ModalDialog
          isChromeless
          components={{ Footer: MyFooter }}
          onClose={noop}
        />,
      );

      const footer = queryByTestId('custom-footer');
      expect(footer).toBeNull();
    });
  });
});

describe('multiple modals', () => {
  afterEach(cleanup);

  it('should position a modal dialog behind two others', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(getByTestId('back-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '2',
    );
  });

  it('should position a modal dialog in between two others', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(getByTestId('middle-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '1',
    );
  });

  it('should position a modal dialog infront of two others', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(getByTestId('front-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '0',
    );
  });

  it('should render a modal dialog inside another modal dialog and be posistioned in the front', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog>back</ModalDialog>
        <ModalDialog>
          middle
          <ModalDialog testId="front">front</ModalDialog>
        </ModalDialog>
      </>,
    );

    expect(getByTestId('front-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '0',
    );
  });

  it('should move a modal behind a freshly mounted modal', () => {
    const { getByTestId, rerender } = render(
      <>
        {false}
        <ModalDialog testId="first">first</ModalDialog>
      </>,
    );

    rerender(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        <ModalDialog testId="first">first</ModalDialog>
      </>,
    );

    expect(getByTestId('first-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '1',
    );
  });

  it('should move a modal to the front a freshly unmounted modal', () => {
    const { getByTestId, rerender } = render(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        <ModalDialog testId="first">first</ModalDialog>
      </>,
    );

    rerender(
      <>
        {false}
        <ModalDialog testId="first">first</ModalDialog>
      </>,
    );

    expect(getByTestId('first-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '0',
    );
  });

  it('shold force a position in the stack', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        {/* Force stack index of 1 instead of 0 */}
        <ModalDialog stackIndex={1} testId="first">
          first
        </ModalDialog>
      </>,
    );

    expect(getByTestId('first-dialog-content')).toHaveAttribute(
      'data-modal-stack',
      '1',
    );
  });

  it('should not callback if the position has not changed', () => {
    const callback = jest.fn();
    const { rerender } = render(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        <ModalDialog onStackChange={callback} testId="first">
          first
        </ModalDialog>
      </>,
    );

    rerender(
      <>
        {false}
        <ModalDialog onStackChange={callback} testId="first">
          first
        </ModalDialog>
      </>,
    );

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('should callback on stack change when going to the front', () => {
    const callback = jest.fn();
    const { rerender } = render(
      <>
        <ModalDialog onStackChange={callback} testId="second">
          second
        </ModalDialog>
        <ModalDialog testId="first">first</ModalDialog>
      </>,
    );

    rerender(
      <>
        <ModalDialog onStackChange={callback} testId="second">
          second
        </ModalDialog>
        {false}
      </>,
    );

    expect(callback).toHaveBeenLastCalledWith(0);
  });

  it('should callback on stack change when going to the back', () => {
    const callback = jest.fn();
    const { rerender } = render(
      <>
        {false}
        <ModalDialog onStackChange={callback} testId="first">
          first
        </ModalDialog>
      </>,
    );

    rerender(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        <ModalDialog onStackChange={callback} testId="first">
          first
        </ModalDialog>
      </>,
    );

    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

test('no animation is applied to the active modal after stack shift has finished', () => {
  const { getByTestId, rerender } = render(
    <>
      <ModalDialog testId="back">back</ModalDialog>
      <ModalDialog testId="front">front</ModalDialog>
    </>,
  );

  // This transform is applied to animate during a stack shift.
  // 8px is the vertical offset for one modal during a stack shift.
  expect(getByTestId('back--positioner')).toHaveStyleDeclaration(
    'transform',
    'translateY(8px)',
  );

  expect(getByTestId('front--positioner')).toHaveStyleDeclaration(
    'transform',
    'none',
  );

  rerender(
    <>
      <ModalDialog testId="back">back</ModalDialog>
      {false}
    </>,
  );

  // Now that the modal has shifted to the front and is active,
  // it should set transform back to 'none'.
  expect(getByTestId('back--positioner')).toHaveStyleDeclaration(
    'transform',
    'none',
  );
});

describe('ModalDialog', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();

    cleanup();
  });

  it('should mount without errors', () => {
    render(<ModalDialog onClose={noop} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
