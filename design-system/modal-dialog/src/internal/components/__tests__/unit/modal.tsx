import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import ModalDialog from '../../../../index';

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
    expect(element.getAttribute('aria-labelledby')).toBe('dialog-heading-2');

    const text = element.querySelector('#dialog-heading-2')!;
    expect(text).not.toBeNull();
    expect(text.innerHTML).toBe(heading);
  });
  it('ModalDialog should be a section', () => {
    const { queryByTestId } = render(
      <ModalDialog testId="test" onClose={noop} />,
    );

    const element = queryByTestId('test')!;
    expect(element).not.toBeNull();
    expect(element.tagName).toBe('SECTION');
  });
  it('ModalDialog heading title should be an h1 element', () => {
    const heading = 'Modal heading';

    const { queryByTestId } = render(
      <ModalDialog testId="test" onClose={noop} heading={heading} />,
    );

    const element = queryByTestId('test')!;
    const text = element.querySelector('h1')!;
    expect(element).not.toBeNull();
    expect(text.textContent).toBe(heading);
  });

  it('should not callback when interacting with the blanket when disabled', () => {
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

  it('should callback on close when interacting with the blanket', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <ModalDialog testId="test" onClose={callback} />,
    );

    fireEvent.click(getByTestId('test--blanket'));

    expect(callback).toHaveBeenCalled();
  });
});
