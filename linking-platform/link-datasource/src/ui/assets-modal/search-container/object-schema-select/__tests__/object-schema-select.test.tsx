import React from 'react';

import {
  act,
  fireEvent,
  render,
  RenderOptions,
  screen,
  waitFor,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Form from '@atlaskit/form';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../../../../analytics';
import {
  FetchObjectSchemasDetails,
  useObjectSchemas,
  UseObjectSchemasState,
} from '../../../../../hooks/useObjectSchemas';
import { AssetsObjectSchemaSelect, SEARCH_DEBOUNCE_MS } from '../index';

jest.mock('../../../../../hooks/useObjectSchemas');

const onSubmitMock = jest.fn();
const onAnalyticFireEvent = jest.fn();

const formWrapper: RenderOptions<{}>['wrapper'] = ({ children }) => (
  <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
    <IntlProvider locale="en">
      <Form onSubmit={onSubmitMock}>
        {({ formProps }) => (
          <form data-testid="object-schema-select-form" {...formProps}>
            {children}
          </form>
        )}
      </Form>
    </IntlProvider>
  </AnalyticsListener>
);

describe('AssetsObjectSchemaSelect', () => {
  // React Select does not work with testId
  const objectSchemaSelectInput =
    'assets-datasource-modal--object-schema-select__input';
  const workspaceId = 'workspaceId';
  const mockFetchObjectSchemas = jest.fn();
  const mockUseObjectSchemas = asMock(useObjectSchemas);
  const getUseObjectSchemasDefaultHookState: UseObjectSchemasState = {
    objectSchemasError: undefined,
    objectSchemas: undefined,
    totalObjectSchemas: undefined,
    objectSchemasLoading: false,
    fetchObjectSchemas: mockFetchObjectSchemas,
  };

  const mockFetchObjectSchemasSuccess: FetchObjectSchemasDetails = {
    objectSchemas: [
      {
        id: '1',
        name: 'schemaOne',
      },
      {
        id: '2',
        name: 'schemaTwo',
      },
    ],
    totalObjectSchemas: 2,
  };

  const renderDefaultObjectSchemaSelect = async () => {
    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(
        <AssetsObjectSchemaSelect
          workspaceId={workspaceId}
          value={undefined}
        />,
        { wrapper: formWrapper },
      );
    // Have to wrap in act due to state update on mount
    await act(async () => {
      renderComponent();
    });
    return;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockUseObjectSchemas.mockReturnValue(getUseObjectSchemasDefaultHookState);
    mockFetchObjectSchemas.mockResolvedValue(mockFetchObjectSchemasSuccess);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should call fetchObjectSchemas on mount', async () => {
    await renderDefaultObjectSchemaSelect();
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toHaveBeenNthCalledWith(1, '');
    });
  });

  it('should fire "ui.modal.ready.datasource" only once on mount', async () => {
    await renderDefaultObjectSchemaSelect();
    const selectInput = document.getElementsByClassName(
      objectSchemaSelectInput,
    )[0];
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toHaveBeenNthCalledWith(1, '');
    });
    fireEvent.change(selectInput, { target: { value: 'test' } });
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toHaveBeenNthCalledWith(2, 'test');
    });
    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'ready',
          actionSubject: 'modal',
          actionSubjectId: 'datasource',
          attributes: {
            instancesCount: null,
            schemasCount: 2,
          },
        },
      },
      EVENT_CHANNEL,
    );
  });

  it('should debounce fetching object schemas when searching', async () => {
    await renderDefaultObjectSchemaSelect();
    const selectInput = document.getElementsByClassName(
      objectSchemaSelectInput,
    )[0];
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toBeCalledTimes(1);
      expect(mockFetchObjectSchemas).toBeCalledWith('');
    });
    fireEvent.change(selectInput, { target: { value: 'test' } });
    fireEvent.change(selectInput, { target: { value: 'test updated' } });
    expect(mockFetchObjectSchemas).toBeCalledTimes(1);
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toBeCalledTimes(2);
      expect(mockFetchObjectSchemas).toBeCalledWith('test updated');
    });
  });

  describe('field validation', () => {
    it('should call onSubmit when schema is valid', async () => {
      await renderDefaultObjectSchemaSelect();
      const selectInput = document.getElementsByClassName(
        objectSchemaSelectInput,
      )[0];
      fireEvent.focus(selectInput);
      fireEvent.keyDown(selectInput, {
        key: 'ArrowDown',
        keyCode: 40,
        code: 40,
      });
      await waitFor(() => {
        expect(mockFetchObjectSchemas).toBeCalled();
      });
      const selectOption = await screen.findAllByText('schemaTwo');
      fireEvent.click(selectOption[0]);
      fireEvent.submit(screen.getByTestId('object-schema-select-form'));
      expect(onSubmitMock).toBeCalled();
    });

    it('should not call onSubmit when schema is empty', async () => {
      await renderDefaultObjectSchemaSelect();
      fireEvent.submit(screen.getByTestId('object-schema-select-form'));
      expect(onSubmitMock).not.toBeCalled();
    });
  });
});
