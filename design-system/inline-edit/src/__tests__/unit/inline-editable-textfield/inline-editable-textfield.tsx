import React, { useState } from 'react';

import { fireEvent, render } from '@testing-library/react';

import InlineEditableTextfield from '../../../inline-editable-textfield';

describe('Simple render', () => {
  it('should render read view component by default', () => {
    const defaultValue = 'Some text';
    const onConfirm = jest.fn();

    const { queryByTestId } = render(
      <InlineEditableTextfield
        testId="editable-textfield"
        defaultValue={defaultValue}
        label="Inline editable textfield"
        onConfirm={onConfirm}
        placeholder="Click to enter text"
      />,
    );

    const read = queryByTestId('read-view-editable-textfield');
    expect(read).toBeInTheDocument();

    expect(read?.innerText).toContain(defaultValue);
  });

  it('should be able to update edit content', () => {
    const InlineEditableTextFieldExample = () => {
      const [editValue, setEditValue] = useState('Old content');

      return (
        <InlineEditableTextfield
          testId="editable-textfield"
          defaultValue={editValue}
          label="Inline editable textfield"
          onConfirm={(value) => setEditValue(value)}
          placeholder="Click to enter text"
        />
      );
    };

    const { container, queryByTestId } = render(
      <InlineEditableTextFieldExample />,
    );

    const read = queryByTestId('read-view-editable-textfield');
    expect(read).toBeInTheDocument();

    const button = container.querySelector('[aria-label="Edit"]');
    fireEvent.click(button!);

    const textField = container.querySelector(
      '[data-testid="editable-textfield"]',
    );
    const confirm = container.querySelector('[aria-label="Confirm"]');

    fireEvent.change(textField!, { target: { value: 'New content' } });
    fireEvent.click(confirm!);

    expect(queryByTestId('read-view-editable-textfield')!.innerText).toContain(
      'New content',
    );
  });

  it('oncancel should clear the unsaved edit content back to defaultValue', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    const InlineEditableTextFieldExample = () => {
      const defaultValue = 'Default content';

      return (
        <InlineEditableTextfield
          testId="editable-textfield"
          defaultValue={defaultValue}
          label="Inline editable textfield"
          onCancel={onCancel}
          onConfirm={onConfirm}
          placeholder="Click to enter text"
        />
      );
    };

    const { container, queryByTestId } = render(
      <InlineEditableTextFieldExample />,
    );

    const read = queryByTestId('read-view-editable-textfield');
    expect(read).toBeInTheDocument();

    const button = container.querySelector('[aria-label="Edit"]');
    fireEvent.click(button!);

    const textField = container.querySelector(
      '[data-testid="editable-textfield"]',
    ) as HTMLInputElement;
    const cancel = container.querySelector('[aria-label="Cancel"]');

    fireEvent.change(textField!, { target: { value: 'New content' } });
    fireEvent.click(cancel!);
    expect(onCancel).toHaveBeenCalled();

    fireEvent.click(read!);
    expect(textField!.value).not.toEqual('New content');
  });

  it('onblur should not clear the unsaved edit content back to defaultValue', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    const InlineEditableTextFieldExample = () => {
      const defaultValue = 'Default content';

      return (
        <InlineEditableTextfield
          testId="editable-textfield"
          defaultValue={defaultValue}
          label="Inline editable textfield"
          onCancel={onCancel}
          onConfirm={onConfirm}
          placeholder="Click to enter text"
        />
      );
    };

    const { container, queryByTestId } = render(
      <InlineEditableTextFieldExample />,
    );

    const read = queryByTestId(
      'read-view-editable-textfield',
    ) as HTMLInputElement;
    expect(read).toBeInTheDocument();

    const button = container.querySelector('[aria-label="Edit"]');
    fireEvent.click(button!);

    const textField = container.querySelector(
      '[data-testid="editable-textfield"]',
    ) as HTMLInputElement;

    fireEvent.change(textField!, { target: { value: 'New content' } });
    fireEvent.blur(textField!);
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(read!);
    expect(textField!.value).toEqual('New content');
  });
});
