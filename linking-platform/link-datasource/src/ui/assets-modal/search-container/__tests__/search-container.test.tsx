import React from 'react';

import { render, RenderOptions, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import { EVENT_CHANNEL } from '../../../../analytics';
import { ObjectSchema } from '../../../../types/assets/types';
import { AssetsSearchContainer, InitialSearchData } from '../index';

const onAnalyticFireEvent = jest.fn();

const AssetsSearchContainerWrapper: RenderOptions<{}>['wrapper'] = ({
  children,
}) => (
  <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
    <IntlProvider locale="en">{children}</IntlProvider>
  </AnalyticsListener>
);

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
  const renderAssetsSearchContainer = async (
    initialSearchData: InitialSearchData,
  ) => {
    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(
        <AssetsSearchContainer
          isSearching={false}
          onSearch={mockOnSearch}
          initialSearchData={initialSearchData}
          workspaceId={workspaceId}
        />,
        { wrapper: AssetsSearchContainerWrapper },
      );
    return {
      ...renderComponent(),
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render placeholders when initialSearchData is not provided', async () => {
    const { container, getByPlaceholderText } =
      await renderAssetsSearchContainer({
        aql: undefined,
        objectSchema: undefined,
      });
    await waitFor(() => {
      expect(
        container.querySelector(`${objectSchemaSelectClass}__placeholder`),
      ).toBeInTheDocument();
      expect(getByPlaceholderText('Search via AQL')).toBeInTheDocument();
    });
  });

  it('should render inputs with values when initialSearchData is provided', async () => {
    const { container, getByDisplayValue } = await renderAssetsSearchContainer({
      aql: validAqlQuery,
      objectSchema: objectSchema,
    });
    const objectSchemaSelectValue = container.querySelector(
      `${objectSchemaSelectClass}__single-value`,
    );
    await waitFor(() => {
      expect(objectSchemaSelectValue).toHaveTextContent(objectSchema.name);
      expect(getByDisplayValue(validAqlQuery)).toBeInTheDocument();
    });
  });

  it('should call onSearch when aql and object schema are valid', async () => {
    const { findByTestId } = await renderAssetsSearchContainer({
      aql: validAqlQuery,
      objectSchema: objectSchema,
    });
    const button = await findByTestId(searchButtonTestId);
    await button.click();
    await waitFor(() => {
      expect(mockOnSearch).toBeCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith(validAqlQuery, objectSchema.id);
    });
  });

  it('should fire "ui.aqlEditor.searched" only once when form submitted', async () => {
    const { findByTestId } = await renderAssetsSearchContainer({
      aql: validAqlQuery,
      objectSchema: objectSchema,
    });
    const button = await findByTestId(searchButtonTestId);
    await button.click();
    // Can't use toBeFiredWithAnalyticEventOnce unless useMock from @atlaskit/link-test-helpers/jest is imported
    await waitFor(() => {
      expect(onAnalyticFireEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'searched',
            actionSubject: 'aqlEditor',
            eventType: 'ui',
          }),
        }),
        EVENT_CHANNEL,
      );
    });
  });

  it('should not call onSearch when aql is valid and object schema is undefined', async () => {
    const { findByTestId } = await renderAssetsSearchContainer({
      aql: validAqlQuery,
      objectSchema: undefined,
    });
    const button = await findByTestId(searchButtonTestId);
    await button.click();
    await waitFor(() => {
      expect(mockOnSearch).not.toBeCalled();
    });
  });
});
