import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import LozengeActionError from '../index';
import { LozengeActionErrorMessages, LozengeActionErrorProps } from '../types';

describe('LozengeActionError', () => {
  const testId = 'test-smart-element-lozenge-dropdown';
  const TEXT_ERROR_MESSAGE =
    'Field "root cause" must be filled out before status change';
  const MESSAGE_PROP_ERROR_MESSAGE = LozengeActionErrorMessages.noData;
  const MAX_LINE_NUMBER = 20;

  const renderComponent = (props: LozengeActionErrorProps) => {
    return render(
      <IntlProvider locale="en">
        <LozengeActionError testId={testId} {...props} />,
      </IntlProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component correctly when provided a text errorMessage', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(TEXT_ERROR_MESSAGE);
    expect(errorMessage).toHaveStyleDeclaration('-webkit-line-clamp', '8');
  });

  it('renders component correctly when provided a MessageProps errorMessage', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: MESSAGE_PROP_ERROR_MESSAGE,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(
      MESSAGE_PROP_ERROR_MESSAGE.descriptor.defaultMessage,
    );
    expect(errorMessage).toHaveStyleDeclaration('-webkit-line-clamp', '8');
  });

  it('renders with a specific maxLineNumber', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
      maxLineNumber: MAX_LINE_NUMBER,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(TEXT_ERROR_MESSAGE);
    expect(errorMessage).toHaveStyleDeclaration(
      '-webkit-line-clamp',
      MAX_LINE_NUMBER.toString(),
    );
  });
});
