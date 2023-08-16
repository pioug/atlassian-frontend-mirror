import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import type { IntlShape, MessageDescriptor } from 'react-intl-next';
import ReactEditorViewContext from '../../../../../../create-editor/ReactEditorViewContext';
import type { PixelEntryProps } from '../../types';
import { PixelEntry } from '../..';

const intlMock = {
  formatMessage: (messageDescriptor: MessageDescriptor) =>
    messageDescriptor && messageDescriptor.defaultMessage,
} as IntlShape;

const setup = (propsOverrides?: Partial<PixelEntryProps>) => {
  const props = {
    intl: intlMock,
    width: 600,
    mediaWidth: 600,
    mediaHeight: 800,
    onSubmit: jest.fn(),
    validate: jest.fn(),
    ...propsOverrides,
  };
  const editorRef = {
    current: document.createElement('div'),
  };
  const wrapper = render(
    <IntlProvider locale="en">
      <ReactEditorViewContext.Provider
        value={{
          editorRef: editorRef,
        }}
      >
        <PixelEntry {...props} />
      </ReactEditorViewContext.Provider>
    </IntlProvider>,
  );
  return {
    props,
    wrapper,
  };
};

describe('PixelEntry floating bar component', () => {
  test('renders two inputs with default values', () => {
    setup();

    const inputWidth = screen.getByDisplayValue('600');
    const inputHeight = screen.getByDisplayValue('800');

    expect(inputWidth).toBeInTheDocument();
    expect(inputWidth).toHaveAttribute('name', 'inputWidth');
    expect(inputWidth).toHaveAttribute('value', '600');
    expect(inputHeight).toBeInTheDocument();
    expect(inputHeight).toHaveAttribute('name', 'inputHeight');
    expect(inputHeight).toHaveAttribute('value', '800');
  });
  test('updates height when changing width', async () => {
    setup();

    const inputHeight = screen.getByDisplayValue('800');
    const inputWidth = screen.getByDisplayValue('600');

    await fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    await userEvent.type(inputWidth, '1000');

    expect(inputWidth).toBeInTheDocument();
    expect(inputWidth).toHaveAttribute('name', 'inputWidth');
    expect(inputHeight).toBeInTheDocument();
    expect(inputHeight).toHaveAttribute('name', 'inputHeight');
    expect(inputHeight).toHaveAttribute('value', '1333');
  });
  test('updates width when changing height', async () => {
    setup();

    const inputHeight = screen.getByDisplayValue('800');
    const inputWidth = screen.getByDisplayValue('600');

    await fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    await userEvent.type(inputHeight, '1000');

    expect(inputWidth).toBeInTheDocument();
    expect(inputWidth).toHaveAttribute('name', 'inputWidth');
    expect(inputWidth).toHaveAttribute('value', '750');
    expect(inputHeight).toBeInTheDocument();
    expect(inputHeight).toHaveAttribute('name', 'inputHeight');
  });
  test('calls submit handler when uses presses enter in inputWidth', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    await fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    await userEvent.type(inputWidth, '1000');
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 1000,
    });
    expect(validateMock).toHaveBeenCalled();
  });
  test('calls submit handler when user presses enter in inputHeight', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('800');
    await fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    await userEvent.type(inputHeight, '1000');
    fireEvent.submit(inputHeight);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 750,
    });
    expect(validateMock).toHaveBeenCalled();
  });
  test('does not call submit handler when validator returns false', () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(false);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });
  test('does call submit handler when validator returns true', () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
  test('ensure validate only recieves update to width and not height', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('800');
    await fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    await userEvent.type(inputHeight, '1000');
    fireEvent.submit(inputHeight);

    expect(validateMock).toHaveBeenCalled();
    expect(validateMock).toHaveBeenLastCalledWith(750);
  });
});
