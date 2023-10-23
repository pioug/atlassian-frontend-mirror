import React from 'react';

import {
  fireEvent,
  render,
  RenderOptions,
  waitFor,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import Form from '@atlaskit/form';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import {
  AqlValidationResponse,
  useValidateAqlText,
  UseValidateAqlTextState,
} from '../../../../../hooks/useValidateAqlText';
import { AqlSearchInput, SEARCH_DEBOUNCE_MS } from '../index';

jest.mock('../../../../../hooks/useValidateAqlText');

const onSubmitMock = jest.fn();

const formWrapper: RenderOptions<{}>['wrapper'] = ({ children }) => (
  <IntlProvider locale="en">
    <Form onSubmit={onSubmitMock}>
      {({ formProps }) => <form {...formProps}>{children}</form>}
    </Form>
  </IntlProvider>
);

describe('AqlSearchInput', () => {
  const workspaceId = 'workspaceId';
  const searchInputTestId = 'assets-datasource-modal--aql-search-input';
  const mockValidateAqlText = jest.fn();
  const mockUseValidateAqlText = asMock(useValidateAqlText);
  const getUseValidateAqlTextDefaultHookState: UseValidateAqlTextState = {
    isValidAqlText: false,
    validateAqlTextError: undefined,
    validateAqlTextLoading: false,
    validateAqlText: mockValidateAqlText,
  };
  const mockValidateAqlTextValid: AqlValidationResponse = {
    isValid: true,
    message: null,
  };
  const mockValidateAqlTextInvalid: AqlValidationResponse = {
    isValid: false,
    message: null,
  };

  const renderDefaultAqlSearchInput = async () => {
    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(
        <AqlSearchInput
          isSearching={false}
          workspaceId={workspaceId}
          value={''}
        />,
        {
          wrapper: formWrapper,
        },
      );
    return {
      ...renderComponent(),
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockUseValidateAqlText.mockReturnValue(
      getUseValidateAqlTextDefaultHookState,
    );
    mockValidateAqlText.mockResolvedValue(mockValidateAqlTextValid);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should debounce validation when entering aql', async () => {
    const { getByTestId } = await renderDefaultAqlSearchInput();
    const textInput = getByTestId(searchInputTestId);
    fireEvent.change(textInput, { target: { value: 'test' } });
    fireEvent.change(textInput, { target: { value: 'test aql query' } });
    expect(mockValidateAqlText).not.toBeCalled();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    await waitFor(() => {
      expect(mockValidateAqlText).toBeCalledTimes(1);
      expect(mockValidateAqlText).toBeCalledWith('test aql query');
    });
  });

  describe('field validation', () => {
    it('should call onSubmit on button click when aql string is valid', async () => {
      const { findByTestId, getByTestId } =
        await await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'valid query' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      await waitFor(() => {
        expect(mockValidateAqlText).toBeCalledTimes(1);
      });
      const button = await findByTestId(
        'assets-datasource-modal--aql-search-button',
      );
      await button.click();
      expect(onSubmitMock).toBeCalled();
    });

    it('should not call onSubmit on button click when aql string is invalid', async () => {
      mockValidateAqlText.mockReturnValue(mockValidateAqlTextInvalid);
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'invalid query' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      await waitFor(() => {
        expect(mockValidateAqlText).toBeCalledTimes(1);
      });
      const button = await findByTestId(
        'assets-datasource-modal--aql-search-button',
      );
      await button.click();
      expect(onSubmitMock).not.toBeCalled();
    });

    it('should show a validation error message when a message is given', async () => {
      mockValidateAqlText.mockReturnValue({
        ...mockValidateAqlTextInvalid,
        message: 'A validation error message',
      });
      const { findByTestId, getByTestId, getByText } =
        await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'invalid query' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      await waitFor(() => {
        expect(mockValidateAqlText).toBeCalledTimes(1);
      });
      const button = await findByTestId(
        'assets-datasource-modal--aql-search-button',
      );
      await button.click();
      expect(onSubmitMock).not.toBeCalled();
      expect(getByText('A validation error message')).toBeInTheDocument();
    });
  });

  describe('renderValidatorIcon', () => {
    it('should show idle icon when input is empty', async () => {
      const { findByTestId } = await renderDefaultAqlSearchInput();
      expect(
        await findByTestId('assets-datasource-modal--aql-idle'),
      ).toBeInTheDocument();
    });

    it('should show help icon', async () => {
      const { findByTestId } = await renderDefaultAqlSearchInput();
      expect(
        await findByTestId('assets-datasource-modal-help'),
      ).toBeInTheDocument();
    });

    it('should show correct icon when aql string is valid', async () => {
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'valid query' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      await waitFor(() => {
        expect(mockValidateAqlText).toBeCalledTimes(1);
        expect(mockValidateAqlText).toBeCalledWith('valid query');
      });
      expect(
        await findByTestId('assets-datasource-modal--aql-valid'),
      ).toBeInTheDocument();
    });

    it('should show invalid icon when aql string is invalid', async () => {
      mockValidateAqlText.mockReturnValue(mockValidateAqlTextInvalid);
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'invalid query' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      await waitFor(() => {
        expect(mockValidateAqlText).toBeCalledTimes(1);
        expect(mockValidateAqlText).toBeCalledWith('invalid query');
      });
      expect(
        await findByTestId('assets-datasource-modal--aql-invalid'),
      ).toBeInTheDocument();
    });

    it('should show validating icon when fetching', async () => {
      mockValidateAqlText.mockReturnValue(new Promise(() => {}));
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'validating' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      expect(
        await findByTestId('assets-datasource-modal--aql-validating'),
      ).toBeInTheDocument();
    });
  });

  describe('Submit button', () => {
    it('should disable submit button when AQL is empty or trims to empty', async () => {
      mockValidateAqlText.mockResolvedValue(mockValidateAqlTextInvalid);
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);

      // Disabled by default (empty)
      expect(
        await findByTestId('assets-datasource-modal--aql-search-button'),
      ).toBeDisabled();

      // Disabled after typing space (trims to empty)
      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: ' ' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      expect(
        await findByTestId('assets-datasource-modal--aql-search-button'),
      ).toBeDisabled();
    });

    it('should disable submit button when AQL is invalid', async () => {
      mockValidateAqlText.mockResolvedValue(mockValidateAqlTextInvalid);
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);

      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'INVALID AQL' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

      expect(
        await findByTestId('assets-datasource-modal--aql-search-button'),
      ).toBeDisabled();
    });

    it('should enable submit button when AQL is valid', async () => {
      mockValidateAqlText.mockResolvedValue(mockValidateAqlTextValid);
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);

      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'Name LIKE A' } });
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

      expect(
        await findByTestId('assets-datasource-modal--aql-search-button'),
      ).not.toBeDisabled();
    });

    it('should disable submit while AQL is being validated', async () => {
      mockValidateAqlText.mockResolvedValue(mockValidateAqlTextValid);
      const { findByTestId, getByTestId } = await renderDefaultAqlSearchInput();
      const textInput = getByTestId(searchInputTestId);

      fireEvent.focus(textInput);
      fireEvent.change(textInput, { target: { value: 'Name LIKE A' } });

      expect(
        await findByTestId('assets-datasource-modal--aql-search-button'),
      ).toBeDisabled();

      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

      expect(
        await findByTestId('assets-datasource-modal--aql-search-button'),
      ).not.toBeDisabled();
    });
  });
});
