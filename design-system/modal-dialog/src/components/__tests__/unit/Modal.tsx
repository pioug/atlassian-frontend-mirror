import React from 'react';

import { render } from '@testing-library/react';

import ModalDialog from '../../../index';

const noop = () => {};

describe('Modal', () => {
  it('should use aria-labelledby to point the heading component', () => {
    const heading = 'Heading - This is a dialog';

    const { queryByTestId } = render(
      <ModalDialog testId="test" onClose={noop} heading={heading} />,
    );

    const element = queryByTestId('test')!;
    expect(element).not.toBeNull();

    expect(element.getAttribute('aria-labelledby')!).toBe('dialog-heading-1');

    const content = queryByTestId('test-dialog-content-heading')!;
    expect(content).not.toBeNull();
    expect(content.getAttribute('id')).toBe('dialog-heading-1');
  });

  it('should use aria-labelledby to point the customised header component', () => {
    const heading = 'Heading - This is a dialog';

    const { queryByTestId } = render(
      <ModalDialog
        testId="test"
        onClose={noop}
        components={{
          Header: ({ id, onClose }) => (
            <div>
              <h4 id={id}>{heading}</h4>
              <button onClick={onClose}>Close</button>
            </div>
          ),
        }}
      />,
    );

    const element = queryByTestId('test')!;
    expect(element).not.toBeNull();
    expect(element.getAttribute('aria-labelledby')).toBe('dialog-heading-1');

    const text = element.querySelector('#dialog-heading-1')!;
    expect(text).not.toBeNull();
    expect(text.innerHTML).toBe(heading);
  });
});
