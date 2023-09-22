import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider, createIntl } from 'react-intl-next';
import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
import type { PixelEntryProps } from '../../types';
import { PixelEntry } from '../..';
import { PIXELENTRY_MIGRATION_BUTTON_TESTID } from '../../constants';

const setup = (propsOverrides?: Partial<PixelEntryProps>) => {
  const intl = createIntl({ locale: 'en' });

  const props = {
    intl: intl,
    width: 600,
    mediaWidth: 600,
    mediaHeight: 800,
    minWidth: 24,
    maxWidth: 1800,
    showMigration: false,
    onSubmit: jest.fn(),
    validate: jest.fn(),
    onMigrate: jest.fn(),
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
    const migrationButton = screen.queryByTestId(
      PIXELENTRY_MIGRATION_BUTTON_TESTID,
    );

    const inputWidth = screen.getByDisplayValue('600');
    const inputHeight = screen.getByDisplayValue('800');

    expect(migrationButton).not.toBeInTheDocument();
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

  test('clears height input when width input is empty', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    const inputHeightWithValue = screen.queryByDisplayValue('800');

    expect(inputHeightWithValue).toBeNull();
  });

  test('clears width input when height input is empty', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('800');
    fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    const inputWidthWithValue = screen.queryByDisplayValue('600');

    expect(inputWidthWithValue).toBeNull();
  });

  test('displays correct max info in tooltip/aria-label for width input', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.mouseOver(inputWidth);

    expect(inputWidth).toHaveAttribute('aria-label', 'Max width 1800px');

    const widthInputTooltip = await screen.findByRole('tooltip');
    expect(widthInputTooltip).toHaveTextContent('Max width 1800px');
  });

  test('displays tooltip for height input', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('800');
    fireEvent.mouseOver(inputHeight);
    expect(inputHeight).toHaveAttribute('aria-label', 'height input');

    const widthInputTooltip = await screen.findByRole('tooltip');
    expect(widthInputTooltip).toHaveTextContent('Height');
  });

  test('calls submit handler when uses presses enter in inputWidth with valid input', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    await userEvent.type(inputWidth, '1000');
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 1000,
      validation: 'valid',
    });
  });
  test('calls submit handler when uses presses enter in inputWidth with invalid input (smaller than minimum width)', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    await userEvent.type(inputWidth, '21');
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 24,
      validation: 'less-than-min',
    });
  });
  test('calls submit handler when uses presses enter in inputWidth with invalid input (greater than maximum width)', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    await userEvent.type(inputWidth, '2000');
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 1800,
      validation: 'greater-than-max',
    });
  });
  test('calls submit handler when user presses enter in inputHeight with valid input', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('800');
    fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    await userEvent.type(inputHeight, '1000');
    fireEvent.submit(inputHeight);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 750,
      validation: 'valid',
    });
  });
  test('calls submit handler when uses presses enter in inputHeight with invalid input (smaller than minimum width)', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('600');
    fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    await userEvent.type(inputHeight, '11');
    fireEvent.submit(inputHeight);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 24,
      validation: 'less-than-min',
    });
  });
  test('calls submit handler when uses presses enter in inputHeight with invalid input (greater than maximum width)', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn().mockReturnValue(true);
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('600');
    fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    await userEvent.type(inputHeight, '2000');
    fireEvent.submit(inputHeight);

    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock).toHaveBeenCalledWith({
      width: 1800,
      validation: 'greater-than-max',
    });
  });

  test('does not call onSubmit prop when user presses enter in inputWidth with empty input', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn((value) => {
      if (value === '') {
        return false;
      }
      return true;
    });
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputWidth = screen.getByDisplayValue('600');
    fireEvent.click(inputWidth);
    await userEvent.clear(inputWidth);
    fireEvent.submit(inputWidth);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('does not call onSubmit prop when user presses enter in inputHeight with empty input', async () => {
    const onSubmitMock = jest.fn();
    const validateMock = jest.fn((value) => {
      if (value === '') {
        return false;
      }
      return true;
    });
    setup({ onSubmit: onSubmitMock, validate: validateMock });

    const inputHeight = screen.getByDisplayValue('800');
    fireEvent.click(inputHeight);
    await userEvent.clear(inputHeight);
    fireEvent.submit(inputHeight);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('ensure migration button and onMigrate is called if showMigration is true', async () => {
    const onMigrateMock = jest.fn();
    setup({ showMigration: true, onMigrate: onMigrateMock });
    const migrationButton = screen.getByTestId(
      PIXELENTRY_MIGRATION_BUTTON_TESTID,
    );
    await fireEvent.click(migrationButton);
    expect(migrationButton).toBeInTheDocument();
    expect(onMigrateMock).toHaveBeenCalled();
  });
});
