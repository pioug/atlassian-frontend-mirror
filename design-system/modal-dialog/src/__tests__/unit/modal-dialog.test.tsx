import React, { useCallback, useState } from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/new';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import noop from '@atlaskit/ds-lib/noop';
import Portal from '@atlaskit/portal';
import { UNSAFE_BREAKPOINTS_CONFIG } from '@atlaskit/primitives';
import { layers } from '@atlaskit/theme/constants';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { width } from '../../internal/constants';
import ModalBody from '../../modal-body';
import ModalTransition from '../../modal-transition';
import ModalDialog from '../../modal-wrapper';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

const MyContent = () => <div data-testid="test-content">Hello</div>;
const LayeredModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div data-testid="container">
      <Button appearance="primary" onClick={open} testId="open-modal">
        Open modal
      </Button>

      {isOpen && (
        <ModalDialog onClose={close} testId="modal" autoFocus={false}>
          <ModalBody>
            <DropdownMenu
              testId="dropdown-menu"
              trigger="I'm a dropdown menu, click me!"
            >
              <DropdownItemGroup>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Share</DropdownItem>
                <DropdownItem>Move</DropdownItem>
              </DropdownItemGroup>
            </DropdownMenu>
          </ModalBody>
        </ModalDialog>
      )}
    </div>
  );
};

describe('<ModalDialog />', () => {
  describe('should close popup correctly when escape is pressed', () => {
    ffTest(
      'platform.design-system-team.layering_qmiw3',
      () => {
        render(<LayeredModal />);

        const openModalBtn = screen.getByTestId('open-modal');
        fireEvent.click(openModalBtn);
        const modal = screen.getByTestId('modal');
        const dropdownTrigger = screen.getByTestId('dropdown-menu--trigger');
        expect(dropdownTrigger).toBeInTheDocument();
        expect(modal).toBeInTheDocument();
        expect(
          screen.queryByTestId('dropdown-menu--content'),
        ).not.toBeInTheDocument();

        fireEvent.click(dropdownTrigger);
        expect(
          screen.getByTestId('dropdown-menu--content'),
        ).toBeInTheDocument();
        fireEvent.keyDown(dropdownTrigger, {
          key: 'Escape',
          code: 'Escape',
        });
        expect(
          screen.queryByTestId('dropdown-menu--content'),
        ).not.toBeInTheDocument();
        expect(modal).toBeInTheDocument();
      },
      () => {
        render(<LayeredModal />);

        const openModalBtn = screen.getByTestId('open-modal');
        fireEvent.click(openModalBtn);
        const modal = screen.getByTestId('modal');
        const dropdownTrigger = screen.getByTestId('dropdown-menu--trigger');
        expect(dropdownTrigger).toBeInTheDocument();
        expect(modal).toBeInTheDocument();
        expect(
          screen.queryByTestId('dropdown-menu--content'),
        ).not.toBeInTheDocument();
      },
    );
  });
  it('should be a section element', () => {
    render(<ModalDialog testId="test" onClose={noop} />);

    const element = screen.getByTestId('test');
    expect(element.tagName).toBe('SECTION');
  });

  it('should set aria modal attribute to the modal to trap the virtual cursor', () => {
    render(<ModalDialog testId="test" onClose={noop} />);

    const element = screen.queryByTestId('test')!;
    expect(element).not.toBeNull();

    expect(element).toHaveAttribute('aria-modal', 'true');
  });

  describe('container', () => {
    it('should render custom container around the modal children', () => {
      render(
        <ModalDialog onClose={noop} testId="modal">
          <form>
            <ModalBody>I'm a modal body!</ModalBody>
          </form>
        </ModalDialog>,
      );

      const modalBody = screen.getByTestId('modal--body');
      const content = screen.getByTestId('modal');
      const form = content.querySelector('form');

      expect(form).not.toBeNull();
      expect(form?.contains(modalBody)).toBe(true);
    });
  });

  describe('children', () => {
    it('should render correctly when using a custom child', () => {
      render(
        <ModalDialog onClose={noop} testId="modal">
          <div data-testid="custom-child" />
        </ModalDialog>,
      );

      const child = screen.queryByTestId('custom-child');
      expect(child).toBeInTheDocument();
    });

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

  describe('height', () => {
    it('should set height in px if a number is passed', () => {
      render(<ModalDialog onClose={noop} height={42} testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      /**
       * Need to assert it this way because assertion against CSS variables
       * is only supported in @testing-library/jest-dom 5.11.3.
       */
      expect(styles).toContain('--modal-dialog-height: 42px;');
      expect(modalDialog).toHaveStyleDeclaration(
        'height',
        'var(--modal-dialog-height)',
        {
          media: `(min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min})`,
        },
      );
    });

    it('should set height in the passed value if a % is passed', () => {
      render(<ModalDialog onClose={noop} height="42%" testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: 42%;');
    });

    it('should set height in the passed value if an em is passed', () => {
      render(<ModalDialog onClose={noop} height="42em" testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: 42em;');
    });

    it('should set height in the passed value if a string is passed', () => {
      render(<ModalDialog onClose={noop} height="initial" testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: initial;');
    });

    it('should set height to "auto" if not supplied', () => {
      render(<ModalDialog onClose={noop} testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: auto;');
    });
  });

  describe('width', () => {
    it('should set width in px if a number is passed', () => {
      render(<ModalDialog onClose={noop} width={42} testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      /**
       * Need to assert it this way because assertion against CSS variables
       * is only supported in @testing-library/jest-dom 5.11.3.
       */
      expect(styles).toContain('--modal-dialog-width: 42px;');
      expect(modalDialog).toHaveStyleDeclaration(
        'width',
        'var(--modal-dialog-width)',
        {
          media: `(min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min})`,
        },
      );
    });

    it('should set width in the passed value if a % is passed', () => {
      render(<ModalDialog onClose={noop} width="42%" testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-width: 42%;');
    });

    it('should set width in the passed value if an em is passed', () => {
      render(<ModalDialog onClose={noop} width="42em" testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-width: 42em;');
    });

    it('should set width in the passed value if a string is passed', () => {
      render(<ModalDialog onClose={noop} width="initial" testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-width: initial;');
    });

    it('should set width to "medium" if not supplied', () => {
      render(<ModalDialog onClose={noop} testId="modal" />);

      const modalDialog = screen.getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain(
        `--modal-dialog-width: ${width.widths.medium}px;`,
      );
    });

    Object.entries(width.widths).forEach(([widthName, widthValue]) => {
      it(`should set width to ${widthValue}px if "${widthName}" is passed`, () => {
        render(<ModalDialog width={widthName} onClose={noop} testId="modal" />);

        const modalDialog = screen.getByTestId('modal');
        const styles = modalDialog.getAttribute('style');

        expect(styles).toContain(`--modal-dialog-width: ${widthValue}px;`);
      });
    });
  });

  describe('onClose', () => {
    it('should trigger when blanket clicked', async () => {
      const spy = jest.fn();
      render(<ModalDialog onClose={spy} testId="modal" />);

      const blanket = screen.getByTestId('modal--blanket');
      await userEvent.click(blanket);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not trigger when modal content is clicked', () => {
      const spy = jest.fn();
      render(
        <ModalDialog onClose={spy}>
          <MyContent />
        </ModalDialog>,
      );

      const content = screen.getByTestId('test-content');
      fireEvent.click(content);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onOpenComplete', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should be invoked after modal finished opening', async () => {
      const spy = jest.fn();

      render(<ModalDialog onOpenComplete={spy} />);
      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    });
  });

  describe('onCloseComplete', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should be invoked after modal finished closing', async () => {
      const spy = jest.fn();

      const ModalWithTransition = ({ isOpen }: { isOpen: boolean }) => (
        <ModalTransition>
          {isOpen && <ModalDialog onCloseComplete={spy} />}
        </ModalTransition>
      );

      const { rerender } = render(<ModalWithTransition isOpen />);
      act(() => {
        jest.runAllTimers();
      });

      rerender(<ModalWithTransition isOpen={false} />);
      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    });
  });

  describe('isBlanketHidden', () => {
    it('set blanket as hidden', () => {
      render(
        <ModalDialog isBlanketHidden={true} onClose={noop} testId="modal" />,
      );

      const blanket = screen.getByTestId('modal--blanket');
      expect(blanket).toHaveStyle('background-color: transparent');
    });
  });

  describe('shouldCloseOnEscapePress', () => {
    it('should invoke onClose callback on Escape key press by default', () => {
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

    it('should not invoke onClose callback on Escape key press when disabled', () => {
      const spy = jest.fn();
      render(
        <ModalDialog shouldCloseOnEscapePress={false} onClose={spy}>
          <MyContent />
        </ModalDialog>,
      );

      // The regular escape event
      const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
      });

      document.dispatchEvent(escapeKeyDownEvent);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('shouldCloseOnOverlayClick', () => {
    it('should invoke onClose callback on blanket click by default', async () => {
      const callback = jest.fn();
      render(<ModalDialog testId="test" onClose={callback} />);

      await userEvent.click(screen.getByTestId('test--blanket'));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not invoke onClose callback on blanket click when disabled', () => {
      const callback = jest.fn();
      render(
        <ModalDialog
          shouldCloseOnOverlayClick={false}
          testId="test"
          onClose={callback}
        />,
      );

      fireEvent.click(screen.getByTestId('test--blanket'));

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('label', () => {
    const label = 'label';

    it('should be used as accessible name', () => {
      render(<ModalDialog label={label} />);
      const modal = screen.getByRole('dialog');

      expect(modal).toHaveAccessibleName(label);
      expect(modal).not.toHaveAttribute('aria-labelledby');
    });

    it('should have `aria-labelledby` if label is not provided', () => {
      render(<ModalDialog />);
      const modal = screen.getByRole('dialog');

      // This is only the case because there is no ModalTitle, which is the default associateion
      expect(modal).not.toHaveAccessibleName();
      expect(modal).toHaveAttribute('aria-labelledby');
    });
  });
});

describe('focus lock', () => {
  it('Input field outside modal dialog does not have focus when data-atlas-extension attribute does not exists and auto focus is turned on', () => {
    render(
      <div>
        <Portal zIndex={layers.dialog() + 1}>
          <input
            // This is required to test a very unique implementation for an
            // internal Chrome plugin. See DSP-11753 for more info.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            data-testid="input-field-outside-modal"
            type="text"
            placeholder="second"
            style={{
              top: '200px',
              left: '200px',
              position: 'fixed',
            }}
          />
        </Portal>
        <ModalDialog testId="modal-focus-lock">
          <input
            data-testid="input-field-inside-modal"
            title="inputFieldInsideModal"
            type="text"
            placeholder="first"
          />
        </ModalDialog>
      </div>,
    );
    expect(screen.getByTestId('input-field-inside-modal')).toHaveFocus();
    expect(screen.getByTestId('input-field-outside-modal')).not.toHaveFocus();
  });

  it('Input field outside modal dialog has focus when data-atlas-extension attribute exists and autofocus is turned on', () => {
    render(
      <div>
        <Portal zIndex={layers.dialog() + 1}>
          <input
            data-atlas-extension="test"
            // This is required to test a very unique implementation for an
            // internal Chrome plugin. See DSP-11753 for more info.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            data-testid="input-field-outside-modal"
            type="text"
            placeholder="second"
            style={{
              top: '200px',
              left: '200px',
              position: 'fixed',
            }}
          />
        </Portal>
        <ModalDialog testId="modal-focus-lock">
          <input
            data-testid="input-field-inside-modal"
            type="text"
            placeholder="first"
          />
        </ModalDialog>
      </div>,
    );
    expect(screen.getByTestId('input-field-outside-modal')).toHaveFocus();
    expect(screen.getByTestId('input-field-inside-modal')).not.toHaveFocus();
  });
});

describe('multiple modals', () => {
  it('should position a modal dialog behind two others', () => {
    render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(screen.getByTestId('back')).toHaveAttribute('data-modal-stack', '2');
  });

  it('should position a modal dialog in between two others', () => {
    render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(screen.getByTestId('middle')).toHaveAttribute(
      'data-modal-stack',
      '1',
    );
  });

  it('should position a modal dialog infront of two others', () => {
    render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(screen.getByTestId('front')).toHaveAttribute(
      'data-modal-stack',
      '0',
    );
  });

  it('should render a modal dialog inside another modal dialog and be posistioned in the front', () => {
    render(
      <>
        <ModalDialog>back</ModalDialog>
        <ModalDialog>
          middle
          <ModalDialog testId="front">front</ModalDialog>
        </ModalDialog>
      </>,
    );

    expect(screen.getByTestId('front')).toHaveAttribute(
      'data-modal-stack',
      '0',
    );
  });

  it('should move a modal behind a freshly mounted modal', () => {
    const { rerender } = render(
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

    expect(screen.getByTestId('first')).toHaveAttribute(
      'data-modal-stack',
      '1',
    );
  });

  it('should move a modal to the front a freshly unmounted modal', () => {
    const { rerender } = render(
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

    expect(screen.getByTestId('first')).toHaveAttribute(
      'data-modal-stack',
      '0',
    );
  });

  it('should force a position in the stack', () => {
    render(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        {/* Force stack index of 1 instead of 0 */}
        <ModalDialog stackIndex={1} testId="first">
          first
        </ModalDialog>
      </>,
    );

    expect(screen.getByTestId('first')).toHaveAttribute(
      'data-modal-stack',
      '1',
    );
  });

  it('should not invoke onStackChange callback if the position has not changed', () => {
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

  it('should not apply animation to the active modal after stack shift has finished', () => {
    const { rerender } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(screen.getByTestId('back--positioner')).toHaveStyle(
      '--modal-dialog-translate-y: 8px;',
    );
    expect(screen.getByTestId('back--positioner')).toHaveStyleDeclaration(
      'transform',
      'translateY(var(--modal-dialog-translate-y))',
    );

    expect(screen.getByTestId('front--positioner')).toHaveStyleDeclaration(
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
    expect(screen.getByTestId('back--positioner')).toHaveStyleDeclaration(
      'transform',
      'none',
    );
  });
});
