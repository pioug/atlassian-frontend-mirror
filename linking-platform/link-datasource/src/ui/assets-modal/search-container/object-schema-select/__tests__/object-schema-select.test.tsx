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
    '.assets-datasource-modal--object-schema-select__input';
  const workspaceId = 'workspaceId';
  const mockFetchObjectSchemas = jest.fn();
  const mockUseObjectSchemas = asMock(useObjectSchemas);
  const getUseObjectSchemasDefaultHookState: UseObjectSchemasState = {
    objectSchemasError: undefined,
    objectSchemas: undefined,
    objectSchemasLoading: false,
    fetchObjectSchemas: mockFetchObjectSchemas,
  };

  const mockFetchObjectSchemasSuccess: ObjectSchema[] = [
    {
      id: '1',
      name: 'schemaOne',
    },
    {
      id: '2',
      name: 'schemaTwo',
    },
  ];

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
    return {
      ...renderComponent(),
    };
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

  it('should fetch default options only once on focus', async () => {
    const { container } = await renderDefaultObjectSchemaSelect();
    const selectInput = container.querySelector(
      objectSchemaSelectInput,
    ) as Element;
    fireEvent.focus(selectInput);
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toBeCalledTimes(1);
      expect(mockFetchObjectSchemas).toBeCalledWith('');
    });
    fireEvent.blur(selectInput);
    fireEvent.focus(selectInput);
    expect(mockFetchObjectSchemas).toBeCalledTimes(1);
  });

  it('should debounce fetching object schemas when searching', async () => {
    const { container } = await renderDefaultObjectSchemaSelect();
    const selectInput = container.querySelector(
      objectSchemaSelectInput,
    ) as Element;
    fireEvent.change(selectInput, { target: { value: 'test' } });
    fireEvent.change(selectInput, { target: { value: 'test updated' } });
    expect(mockFetchObjectSchemas).not.toBeCalled();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    await waitFor(() => {
      expect(mockFetchObjectSchemas).toBeCalledTimes(1);
      expect(mockFetchObjectSchemas).toBeCalledWith('test updated');
    });
  });

  describe('field validation', () => {
    it('should call onSubmit when schema is valid', async () => {
      const { container, getByTestId, findAllByText } =
        await renderDefaultObjectSchemaSelect();
      const selectInput = container.querySelector(
        objectSchemaSelectInput,
      ) as Element;
      fireEvent.focus(selectInput);
      fireEvent.keyDown(selectInput, {
        key: 'ArrowDown',
        keyCode: 40,
        code: 40,
      });
      await waitFor(() => {
        expect(mockFetchObjectSchemas).toBeCalled();
      });
      const selectOption = await findAllByText('schemaTwo');
      fireEvent.click(selectOption[0]);
      fireEvent.submit(getByTestId('object-schema-select-form'));
      expect(onSubmitMock).toBeCalled();
    });

    it('should not call onSubmit when schema is empty', async () => {
      const { getByTestId } = await renderDefaultObjectSchemaSelect();
      fireEvent.submit(getByTestId('object-schema-select-form'));
      expect(onSubmitMock).not.toBeCalled();
    });
  });
});
