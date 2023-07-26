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
  const mockValidateAqlTextValid: boolean = true;
  const mockValidateAqlTextInvalid: boolean = false;

  const renderDefaultAqlSearchInput = async () => {
    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(<AqlSearchInput workspaceId={workspaceId} value={''} />, {
        wrapper: formWrapper,
      });
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
  });

  describe('renderValidatorIcon', () => {
    it('should show idle icon when input is empty', async () => {
      const { findByTestId } = await renderDefaultAqlSearchInput();
      expect(
        await findByTestId('assets-datasource-modal--aql-idle'),
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
});
