import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { RenderAssetsContent, RenderAssetsContentProps } from '../index';

describe('AssetsConfigModal', () => {
  const setup = (props: Partial<RenderAssetsContentProps> = {}) => {
    const mockOnNextPage = jest.fn();
    const mockLoadDatasourceDetails = jest.fn();
    const mockOnVisibleColumnKeysChange = jest.fn(
      (visibleColumnKeys: string[]) => {},
    );
    const component = render(
      <IntlProvider locale="en">
        <SmartCardProvider client={new CardClient()}>
          <RenderAssetsContent
            status="resolved"
            responseItems={[
              {
                myColumn: { data: 'some-value' },
                otherColumn: { data: 'other-column-value' },
                myId: { data: 'some-id1' },
              },
              {
                myColumn: { data: 'other-value' },
                otherColumn: { data: 'other-column-other-value' },
                myId: { data: 'some-id2' },
              },
            ]}
            visibleColumnKeys={['myColumn', 'otherColumn', 'myId']}
            datasourceId="testing"
            aql="name like a"
            schemaId="testing"
            onNextPage={mockOnNextPage}
            hasNextPage={false}
            loadDatasourceDetails={mockLoadDatasourceDetails}
            columns={
              props.columns !== undefined
                ? []
                : [
                    { key: 'myColumn', title: 'My Column', type: 'string' },
                    {
                      key: 'otherColumn',
                      title: 'My Other Column',
                      type: 'string',
                    },
                    { key: 'myId', title: 'ID', type: 'string' },
                  ]
            }
            defaultVisibleColumnKeys={['myColumn', 'otherColumn', 'myId']}
            onVisibleColumnKeysChange={mockOnVisibleColumnKeysChange}
            {...props}
          />
        </SmartCardProvider>
      </IntlProvider>,
    );

    return { ...component };
  };

  it('Should display initial view with link when the status is empty', async () => {
    const { queryByTestId, getByRole } = setup({ status: 'empty' });
    expect(
      queryByTestId('assets-aql-datasource-modal--initial-state-view'),
    ).toBeInTheDocument();
    expect(
      getByRole('link', { name: 'Learn more about searching with AQL.' }),
    ).toHaveAttribute(
      'href',
      'https://support.atlassian.com/jira-service-management-cloud/docs/use-assets-query-language-aql/',
    );
  });

  it('Should display loading view when the status is loading', async () => {
    const { queryByTestId } = setup({ status: 'loading', columns: [] });
    expect(
      queryByTestId('assets-aql-datasource-modal--loading-state'),
    ).toBeInTheDocument();
  });

  it('Should display error view when the status is rejected', async () => {
    const { queryByTestId } = setup({ status: 'rejected' });
    expect(
      queryByTestId('jira-jql-datasource-modal--loading-error'),
    ).toBeInTheDocument();
  });

  it('Should display IssueLikeDataTableView when the status is resolved', async () => {
    const { queryByTestId } = setup({ status: 'resolved' });
    expect(queryByTestId('asset-datasource-table')).toBeInTheDocument();
  });
});
