import React, { MouseEventHandler } from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { useModal } from '../../hooks';
import ModalFooter from '../../modal-footer';
import ModalDialog from '../../modal-wrapper';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

describe('<ModalFooter />', () => {
  afterEach(cleanup);
  it('should render default footer', () => {
    const { queryByTestId } = render(
      <ModalDialog onClose={noop} testId="modal">
        <ModalFooter>My footer</ModalFooter>
      </ModalDialog>,
    );

    expect(queryByTestId('modal--footer')).not.toBeNull();
  });

  it('should be accessible using a user-defined test id', () => {
    const { queryByTestId } = render(
      <ModalDialog onClose={noop} testId="modal">
        <ModalFooter testId="my-footer">My footer</ModalFooter>
      </ModalDialog>,
    );

    expect(queryByTestId('modal--footer')).toBeNull();
    expect(queryByTestId('my-footer')).not.toBeNull();
  });

  it('should render custom footer', () => {
    const { queryByTestId } = render(
      <ModalDialog onClose={noop}>
        <span data-testid="custom-footer">My footer</span>
      </ModalDialog>,
    );

    expect(queryByTestId('custom-footer')).not.toBeNull();
  });

  it('should invoke onClose callback on custom footer', () => {
    const callback = jest.fn();
    const CustomFooter = () => {
      const { onClose } = useModal();
      return (
        <ModalFooter>
          <button
            data-testid="custom-close"
            onClick={onClose as MouseEventHandler<HTMLButtonElement>}
          >
            Custom close
          </button>
        </ModalFooter>
      );
    };

    const { getByTestId } = render(
      <ModalDialog onClose={callback}>
        <CustomFooter />
      </ModalDialog>,
    );

    fireEvent.click(getByTestId('custom-close'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if modal context not available', () => {
    /* eslint-disable no-console */
    const err = console.error;
    console.error = jest.fn();
    /* eslint-enable no-console */

    try {
      render(<ModalFooter>Lone footer</ModalFooter>);
    } catch (e) {
      expect(e.message).toBe(
        '@atlaskit/modal-dialog: Modal context unavailable – this component needs to be a child of ModalDialog.',
      );
    }

    // Restore writing to stderr.
    /* eslint-disable-next-line no-console */
    console.error = err;
  });
});
