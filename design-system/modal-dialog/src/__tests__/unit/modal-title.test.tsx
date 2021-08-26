import React from 'react';

import { render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { useModal } from '../../hooks';
import ModalHeader from '../../modal-header';
import ModalTitle from '../../modal-title';
import ModalDialog from '../../modal-wrapper';

describe('<ModalTitle />', () => {
  it('modal dialog should use aria-labelledby to reference the title text', () => {
    const title = 'Title - This is a dialog';
    const titleId = 'modal-dialog-title-1';

    const { getByTestId } = render(
      <ModalDialog testId="test" onClose={noop}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
      </ModalDialog>,
    );

    const element = getByTestId('test');
    expect(element.getAttribute('aria-labelledby')!).toBe(titleId);

    const content = getByTestId('test--title-text');
    expect(content.getAttribute('id')).toBe(titleId);
  });

  it('modal dialog should use aria-labelledby to reference the text in a custom header component', () => {
    const title = 'Title - This is a dialog';
    const titleId = 'modal-dialog-title-2';

    const CustomHeader = () => {
      const { titleId } = useModal();

      return (
        <div>
          <h4 id={titleId}>{title}</h4>
          <button onClick={noop}>Close</button>
        </div>
      );
    };

    const { getByTestId } = render(
      <ModalDialog testId="test">
        <CustomHeader />
      </ModalDialog>,
    );

    const element = getByTestId('test');
    expect(element.getAttribute('aria-labelledby')).toBe(titleId);

    const text = element.querySelector(`#${titleId}`)!;
    expect(text).not.toBeNull();
    expect(text.innerHTML).toBe(title);
  });

  it('modal dialog title should be an h1 element', () => {
    const title = 'Modal title';

    const { getByTestId } = render(
      <ModalDialog testId="test" onClose={noop}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
      </ModalDialog>,
    );

    const element = getByTestId('test--title');
    expect(element.tagName).toBe('H1');
  });

  it('should throw an error if modal context not available', () => {
    /* eslint-disable no-console */
    const err = console.error;
    console.error = jest.fn();
    /* eslint-enable no-console */

    try {
      render(<ModalTitle>Lone title</ModalTitle>);
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
