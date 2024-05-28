import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { DatasourceExperienceIdProvider } from '../../../../../contexts/datasource-experience-id';
import { RenderAssetsContent, type RenderAssetsContentProps } from '../index';

describe('AssetsConfigModal', () => {
  const setup = (props: Partial<RenderAssetsContentProps> = {}) => {
    const mockOnNextPage = jest.fn();
    const mockLoadDatasourceDetails = jest.fn();
    const mockOnVisibleColumnKeysChange = jest.fn(
      (visibleColumnKeys: string[]) => {},
    );
    const component = render(
      <DatasourceExperienceIdProvider>
        <IntlProvider locale="en">
          <SmartCardProvider client={new CardClient()}>
            <RenderAssetsContent
              isFetchingInitialData={props.isFetchingInitialData ?? false}
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
        </IntlProvider>
      </DatasourceExperienceIdProvider>,
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

  it('Should display loading view when isFetchingInitialData', async () => {
    const { queryByTestId } = setup({ isFetchingInitialData: true });
    expect(
      queryByTestId('assets-aql-datasource-modal--loading-state'),
    ).toBeInTheDocument();
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
      queryByTestId('datasource-modal--loading-error'),
    ).toBeInTheDocument();
  });

  it('Should display access required view when the status is unauthorized', async () => {
    const { queryByTestId } = setup({ status: 'unauthorized' });
    expect(queryByTestId('datasource--access-required')).toBeInTheDocument();
  });

  it('Should display IssueLikeDataTableView when the status is resolved', async () => {
    const { queryByTestId } = setup({ status: 'resolved' });
    expect(queryByTestId('asset-datasource-table')).toBeInTheDocument();
  });
});
