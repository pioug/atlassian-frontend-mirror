import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ObjectSchema } from '../../../../types/assets/types';
import { AssetsSearchContainer } from '../index';

describe('AssetsSearchContainer', () => {
  const searchButtonTestId = 'assets-datasource-modal--aql-search-button';
  // React Select does not work with testId
  const objectSchemaSelectClass =
    '.assets-datasource-modal--object-schema-select';
  const validAqlQuery = 'aql search valid';
  const objectSchema: ObjectSchema = {
    id: '1',
    name: 'schemaOne',
  };
  const workspaceId = 'workspaceId';
  const mockOnSearch = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render placeholders when initialSearchData is not provided', async () => {
    const { container, getByPlaceholderText } = await render(
      <IntlProvider locale="en">
        <AssetsSearchContainer
          onSearch={mockOnSearch}
          initialSearchData={{
            aql: undefined,
            objectSchema: undefined,
          }}
          workspaceId={workspaceId}
        />
      </IntlProvider>,
    );
    expect(
      container.querySelector(`${objectSchemaSelectClass}__placeholder`),
    ).toBeInTheDocument();
    expect(getByPlaceholderText('Search via AQL')).toBeInTheDocument();
  });

  it('should render inputs with values when initialSearchData is provided', async () => {
    const { container, getByDisplayValue } = await render(
      <IntlProvider locale="en">
        <AssetsSearchContainer
          onSearch={mockOnSearch}
          initialSearchData={{
            aql: validAqlQuery,
            objectSchema: objectSchema,
          }}
          workspaceId={workspaceId}
        />
      </IntlProvider>,
    );
    const objectSchemaSelectValue = container.querySelector(
      `${objectSchemaSelectClass}__single-value`,
    );
    expect(objectSchemaSelectValue).toHaveTextContent(objectSchema.name);
    expect(getByDisplayValue(validAqlQuery)).toBeInTheDocument();
  });

  it('should call onSearch when aql and object schema are valid', async () => {
    const { findByTestId } = await render(
      <IntlProvider locale="en">
        <AssetsSearchContainer
          onSearch={mockOnSearch}
          initialSearchData={{
            aql: validAqlQuery,
            objectSchema: objectSchema,
          }}
          workspaceId={workspaceId}
        />
      </IntlProvider>,
    );
    const button = await findByTestId(searchButtonTestId);
    await button.click();
    expect(mockOnSearch).toBeCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith(validAqlQuery, objectSchema.id);
  });

  it('should not call onSearch when aql is valid and object schema is undefined', async () => {
    const { findByTestId } = await render(
      <IntlProvider locale="en">
        <AssetsSearchContainer
          onSearch={mockOnSearch}
          initialSearchData={{
            aql: validAqlQuery,
            objectSchema: undefined,
          }}
          workspaceId={workspaceId}
        />
      </IntlProvider>,
    );
    const button = await findByTestId(searchButtonTestId);
    await button.click();
    expect(mockOnSearch).not.toBeCalled();
  });
});
