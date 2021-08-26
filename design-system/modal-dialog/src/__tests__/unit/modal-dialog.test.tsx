import React from 'react';

import { waitFor } from '@testing-library/dom';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { width } from '../../internal/constants';
import ModalBody from '../../modal-body';
import ModalTransition from '../../modal-transition';
import ModalDialog from '../../modal-wrapper';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

const MyContent = () => <div data-testid="test-content">Hello</div>;

describe('<ModalDialog />', () => {
  afterEach(cleanup);

  it('should be a section element', () => {
    const { getByTestId } = render(
      <ModalDialog testId="test" onClose={noop} />,
    );

    const element = getByTestId('test');
    expect(element.tagName).toBe('SECTION');
  });

  it('should set aria modal attribute to the modal to trap the virtual cursor', () => {
    const { queryByTestId } = render(
      <ModalDialog testId="test" onClose={noop} />,
    );

    const element = queryByTestId('test')!;
    expect(element).not.toBeNull();

    expect(element.getAttribute('aria-modal')).toEqual('true');
  });

  describe('container', () => {
    it('should render custom container around the modal children', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} testId="modal">
          <form>
            <ModalBody>I'm a modal body!</ModalBody>
          </form>
        </ModalDialog>,
      );

      const modalBody = getByTestId('modal--body');
      const content = getByTestId('modal');
      const form = content.querySelector('form');

      expect(form).not.toBeNull();
      expect(form?.contains(modalBody)).toBe(true);
    });
  });

  describe('children', () => {
    it('should render correctly when using a custom child', () => {
      const { queryByTestId } = render(
        <ModalDialog onClose={noop} testId="modal">
          <div data-testid="custom-child" />
        </ModalDialog>,
      );

      const child = queryByTestId('custom-child');
      expect(child).not.toBeNull();
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
      const { getByTestId } = render(
        <ModalDialog onClose={noop} height={42} testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      /**
       * Need to assert it this way because assertion against CSS variables
       * is only supported in @testing-library/jest-dom 5.11.3. */
      expect(styles).toContain('--modal-dialog-height: 42px;');
      expect(modalDialog).toHaveStyleDeclaration(
        'height',
        'var(--modal-dialog-height)',
        {
          media: '(min-width: 480px)',
        },
      );
    });

    it('should set height in the passed value if a % is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} height="42%" testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: 42%;');
    });

    it('should set height in the passed value if an em is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} height="42em" testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: 42em;');
    });

    it('should set height in the passed value if a string is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} height="initial" testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: initial;');
    });

    it('should set height to "auto" if not supplied', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-height: auto;');
    });
  });

  describe('width', () => {
    it('should set width in px if a number is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} width={42} testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      /**
       * Need to assert it this way because assertion against CSS variables
       * is only supported in @testing-library/jest-dom 5.11.3. */
      expect(styles).toContain('--modal-dialog-width: 42px;');
      expect(modalDialog).toHaveStyleDeclaration(
        'width',
        'var(--modal-dialog-width)',
        {
          media: '(min-width: 480px)',
        },
      );
    });

    it('should set width in the passed value if a % is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} width="42%" testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-width: 42%;');
    });

    it('should set width in the passed value if an em is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} width="42em" testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-width: 42em;');
    });

    it('should set width in the passed value if a string is passed', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} width="initial" testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain('--modal-dialog-width: initial;');
    });

    it('should set width to "medium" if not supplied', () => {
      const { getByTestId } = render(
        <ModalDialog onClose={noop} testId="modal" />,
      );

      const modalDialog = getByTestId('modal');
      const styles = modalDialog.getAttribute('style');

      expect(styles).toContain(
        `--modal-dialog-width: ${width.widths.medium}px;`,
      );
    });

    Object.entries(width.widths).forEach(([widthName, widthValue]) => {
      it(`should set width to ${widthValue}px if "${widthName}" is passed`, () => {
        const { getByTestId } = render(
          <ModalDialog width={widthName} onClose={noop} testId="modal" />,
        );

        const modalDialog = getByTestId('modal');
        const styles = modalDialog.getAttribute('style');

        expect(styles).toContain(`--modal-dialog-width: ${widthValue}px;`);
      });
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
  });

  describe('onOpenComplete', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should be invoked after modal finished opening', async () => {
      const spy = jest.fn();

      render(<ModalDialog onOpenComplete={spy} />);
      act(() => jest.runAllTimers());

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    });
  });

  describe('onCloseComplete', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
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
      act(() => jest.runAllTimers());

      rerender(<ModalWithTransition isOpen={false} />);
      act(() => jest.runAllTimers());

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    });
  });

  describe('isBlanketHidden', () => {
    it('set blanket as hidden', () => {
      const { getByTestId } = render(
        <ModalDialog isBlanketHidden={true} onClose={noop} testId="modal" />,
      );

      const blanket = getByTestId('modal--blanket');
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
    it('should invoke onClose callback on blanket click by default', () => {
      const callback = jest.fn();
      const { getByTestId } = render(
        <ModalDialog testId="test" onClose={callback} />,
      );

      fireEvent.click(getByTestId('test--blanket'));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not invoke onClose callback on blanket click when disabled', () => {
      const callback = jest.fn();
      const { getByTestId } = render(
        <ModalDialog
          shouldCloseOnOverlayClick={false}
          testId="test"
          onClose={callback}
        />,
      );

      fireEvent.click(getByTestId('test--blanket'));

      expect(callback).not.toHaveBeenCalled();
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

    expect(getByTestId('back')).toHaveAttribute('data-modal-stack', '2');
  });

  it('should position a modal dialog in between two others', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(getByTestId('middle')).toHaveAttribute('data-modal-stack', '1');
  });

  it('should position a modal dialog infront of two others', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="middle">middle</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    expect(getByTestId('front')).toHaveAttribute('data-modal-stack', '0');
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

    expect(getByTestId('front')).toHaveAttribute('data-modal-stack', '0');
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

    expect(getByTestId('first')).toHaveAttribute('data-modal-stack', '1');
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

    expect(getByTestId('first')).toHaveAttribute('data-modal-stack', '0');
  });

  it('should force a position in the stack', () => {
    const { getByTestId } = render(
      <>
        <ModalDialog testId="second">second</ModalDialog>
        {/* Force stack index of 1 instead of 0 */}
        <ModalDialog stackIndex={1} testId="first">
          first
        </ModalDialog>
      </>,
    );

    expect(getByTestId('first')).toHaveAttribute('data-modal-stack', '1');
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
    const { getByTestId, rerender } = render(
      <>
        <ModalDialog testId="back">back</ModalDialog>
        <ModalDialog testId="front">front</ModalDialog>
      </>,
    );

    /**
     * Need to assert it this way because assertion against CSS variables
     * is only supported in @testing-library/jest-dom 5.11.3. */

    // This transform is applied to animate during a stack shift.
    // 8px is the vertical offset for one modal during a stack shift.
    expect(getByTestId('back--positioner').getAttribute('style')).toContain(
      '--modal-dialog-translate-y: 8px;',
    );
    expect(getByTestId('back--positioner')).toHaveStyleDeclaration(
      'transform',
      'translateY(var(--modal-dialog-translate-y))',
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
});
