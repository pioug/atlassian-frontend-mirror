import React, { MouseEventHandler } from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { useModal } from '../../hooks';
import ModalHeader from '../../modal-header';
import ModalDialog from '../../modal-wrapper';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

describe('<ModalHeader />', () => {
  afterEach(cleanup);

  it('should render default header', () => {
    const { queryByTestId } = render(
      <ModalDialog onClose={noop} testId="modal">
        <ModalHeader>My header</ModalHeader>
      </ModalDialog>,
    );

    expect(queryByTestId('modal--header')).not.toBeNull();
  });

  it('should be accessible using a user-defined test id', () => {
    const { queryByTestId } = render(
      <ModalDialog onClose={noop} testId="modal">
        <ModalHeader testId="my-header">My header</ModalHeader>
      </ModalDialog>,
    );

    expect(queryByTestId('modal--header')).toBeNull();
    expect(queryByTestId('my-header')).not.toBeNull();
  });

  it('should render custom header', () => {
    const { queryByTestId } = render(
      <ModalDialog onClose={noop}>
        <span data-testid="custom-header">My header</span>
      </ModalDialog>,
    );

    expect(queryByTestId('custom-header')).not.toBeNull();
  });

  it('should invoke onClose callback on custom header', () => {
    const callback = jest.fn();
    const CustomHeader = () => {
      const { onClose } = useModal();
      return (
        <ModalHeader>
          <button
            data-testid="custom-close"
            onClick={onClose as MouseEventHandler<HTMLButtonElement>}
          >
            Custom close
          </button>
        </ModalHeader>
      );
    };

    const { getByTestId } = render(
      <ModalDialog onClose={callback}>
        <CustomHeader />
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
      render(<ModalHeader>Lone header</ModalHeader>);
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
