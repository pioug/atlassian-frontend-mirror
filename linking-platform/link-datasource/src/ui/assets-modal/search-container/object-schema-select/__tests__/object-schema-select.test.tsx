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

import Form from '@atlaskit/form';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import {
  FetchObjectSchemasDetails,
  useObjectSchemas,
  UseObjectSchemasState,
} from '../../../../../hooks/useObjectSchemas';
import { ObjectSchema } from '../../../../../types/assets/types';
import { AssetsObjectSchemaSelect, SEARCH_DEBOUNCE_MS } from '../index';

jest.mock('../../../../../hooks/useObjectSchemas');

const onSubmitMock = jest.fn();

const formWrapper: RenderOptions<{}>['wrapper'] = ({ children }) => (
  <IntlProvider locale="en">
    <Form onSubmit={onSubmitMock}>
      {({ formProps }) => (
        <form data-testid="object-schema-select-form" {...formProps}>
          {children}
        </form>
      )}
    </Form>
  </IntlProvider>
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

  const renderDefaultObjectSchemaSelect = async (
    initialObjectSchemas?: ObjectSchema[],
  ) => {
    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(
        <AssetsObjectSchemaSelect
          workspaceId={workspaceId}
          initialObjectSchemas={initialObjectSchemas}
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

  it('should not call fetchObjectSchemas on mount', async () => {
    await renderDefaultObjectSchemaSelect();
    await waitFor(() => {
      expect(mockFetchObjectSchemas).not.toBeCalled();
    });
  });

  it('should debounce fetching object schemas when searching', async () => {
    await renderDefaultObjectSchemaSelect();
    const selectInput = document.getElementsByClassName(
      objectSchemaSelectInput,
    )[0];
    fireEvent.change(selectInput, { target: { value: 'test' } });
    fireEvent.change(selectInput, { target: { value: 'test updated' } });
    expect(mockFetchObjectSchemas).toBeCalledTimes(0);
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toBeCalledTimes(1);
      expect(mockFetchObjectSchemas).toBeCalledWith('test updated');
    });
  });

  describe('field validation', () => {
    it('should call onSubmit when schema is valid', async () => {
      await renderDefaultObjectSchemaSelect(
        mockFetchObjectSchemasSuccess.objectSchemas,
      );
      const selectInput = document.getElementsByClassName(
        objectSchemaSelectInput,
      )[0];
      fireEvent.focus(selectInput);
      fireEvent.keyDown(selectInput, {
        key: 'ArrowDown',
        keyCode: 40,
        code: 40,
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
