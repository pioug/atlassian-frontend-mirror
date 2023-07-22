import React from 'react';
import { render } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';
import { mount, ReactWrapper } from 'enzyme';

import { Card, Provider, Client } from '@atlaskit/smart-card';

import BlockCard from '../../../../react/nodes/blockCard';
import InlineCard from '../../../../react/nodes/inlineCard';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { MockCardComponent } from './card.mock';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';
import {
  DatasourceTableView,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('@atlaskit/smart-card', () => {
  const originalModule = jest.requireActual('@atlaskit/smart-card');
  return {
    ...originalModule,
    Card: jest.fn((props) => <originalModule.Card {...props} />),
  };
});

describe('Renderer - React/Nodes/BlockCard', () => {
  const url =
    'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

  const data = {
    '@type': 'Document',
    generator: {
      '@type': 'Application',
      name: 'Confluence',
    },
    url,
    name: 'Founder Update 76: Hello, Trello!',
    summary:
      'Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)',
  };

  let node: ReactWrapper;
  afterEach(() => {
    node.unmount();
  });

  it('should render a <div>-tag', () => {
    node = mount(<BlockCard url={url} />);
    expect(node.getDOMNode()['tagName']).toEqual('DIV');
  });

  it('should render with url if prop exists', () => {
    node = mount(<BlockCard url={url} />);
    expect(node.find(BlockCard).prop('url')).toEqual(url);
  });

  it('should render with data if prop exists', () => {
    node = mount(<BlockCard data={data} />);
    expect(node.find(BlockCard).prop('data')).toEqual(data);
  });

  it('should render with onClick if eventHandlers has correct event key', async () => {
    const mockedOnClick = jest.fn();
    const mockedEvent = { target: {} };
    node = mount(
      <Provider client={new Client('staging')}>
        <BlockCard
          url={url}
          eventHandlers={{
            smartCard: {
              onClick: mockedOnClick,
            },
          }}
        />
      </Provider>,
    );

    const onClick = node.find(Card).prop('onClick');

    onClick(mockedEvent);

    expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
  });

  it('should render with onClick as undefined if eventHandlers is not present', () => {
    node = mount(
      <Provider client={new Client('staging')}>
        <BlockCard url={url} />{' '}
      </Provider>,
    );

    expect(node.find(Card).prop('onClick')).toBeUndefined();
  });

  it('should render with showServerActions if defined in smartLinks options', () => {
    node = mount(
      <Provider client={new Client('staging')}>
        <BlockCard url={url} smartLinks={{ showServerActions: true }} />
      </Provider>,
    );
    expect(node.find(Card).prop('showServerActions')).toEqual(true);
  });

  describe('rendering a datasource', () => {
    const datasourceAttributeProperties: DatasourceAttributeProperties = {
      id: 'mock-datasource-id',
      parameters: {
        cloudId: 'mock-cloud-id',
        jql: 'JQL=MOCK',
      },
      views: [
        {
          type: 'table',
          properties: {
            columns: [{ key: 'column-1' }, { key: 'column-2' }],
          },
        },
      ],
    };

    it('should render a DatasourceTableView if datasource is provided with JQL and a table view', () => {
      node = mount(
        <Provider client={new Client('staging')}>
          <BlockCard
            url={url}
            datasource={datasourceAttributeProperties}
            smartLinks={{ showServerActions: true }}
          />
        </Provider>,
      );
      expect(node.find(Card).length).toBe(0);
      expect(node.find(DatasourceTableView).length).toBe(1);

      expect(node.find(DatasourceTableView).prop('datasourceId')).toEqual(
        'mock-datasource-id',
      );
      expect(node.find(DatasourceTableView).prop('parameters')).toEqual({
        cloudId: 'mock-cloud-id',
        jql: 'JQL=MOCK',
      });
      expect(node.find(DatasourceTableView).prop('visibleColumnKeys')).toEqual([
        'column-1',
        'column-2',
      ]);
    });

    it('should render inlineCard if jira issue datasource is provided with JQL but NOT a table view', () => {
      const notRenderableDatasource = {
        ...datasourceAttributeProperties,
        views: [
          {
            ...datasourceAttributeProperties.views[0],
            type: 'NOT_TABLE',
          },
        ],
      } as any;

      node = mount(
        <Provider client={new Client('staging')}>
          <BlockCard
            url={url}
            datasource={notRenderableDatasource}
            smartLinks={{ showServerActions: true }}
          />
        </Provider>,
      );

      expect(node.find(InlineCard).length).toBe(1);
      expect(node.find(InlineCard).prop('url')).toEqual(url);
    });

    describe('when using feature flag', () => {
      const datasourceAttributePropertiesWithRealJiraId = {
        ...datasourceAttributeProperties,
        id: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
      };
      ffTest(
        'platform.linking-platform.datasource-jira_issues',
        () => {
          node = mount(
            <Provider client={new Client('staging')}>
              <BlockCard
                url={url}
                datasource={datasourceAttributePropertiesWithRealJiraId}
                smartLinks={{ showServerActions: true }}
              />
            </Provider>,
          );
          expect(node.find(DatasourceTableView).prop('datasourceId')).toEqual(
            'd8b75300-dfda-4519-b6cd-e49abbd50401',
          );
          expect(node.find(DatasourceTableView).prop('parameters')).toEqual({
            cloudId: 'mock-cloud-id',
            jql: 'JQL=MOCK',
          });
          expect(
            node.find(DatasourceTableView).prop('visibleColumnKeys'),
          ).toEqual(['column-1', 'column-2']);
        },
        () => {
          node = mount(
            <Provider client={new Client('staging')}>
              <BlockCard
                url={url}
                datasource={datasourceAttributePropertiesWithRealJiraId}
                smartLinks={{ showServerActions: true }}
              />
            </Provider>,
          );

          expect(node.find(InlineCard).length).toBe(1);
          expect(node.find(InlineCard).prop('url')).toEqual(url);
        },
      );
    });
  });
});

describe('Renderer - React/Nodes/BlockCard - analytics context', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fire renderer location attribute when rendered', async () => {
    asMock(Card).mockImplementation(MockCardComponent);
    const analyticsSpy = jest.fn();
    const expectedContext = [
      {
        attributes: {
          location: 'renderer',
        },
        location: 'renderer',
      },
    ];

    render(
      <AnalyticsListener onEvent={analyticsSpy} channel={'atlaskit'}>
        <BlockCard url="https://atlassian.com" />
      </AnalyticsListener>,
    );

    expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
      payload: {
        action: 'rendered',
        actionSubject: 'link',
      },
      context: expectedContext,
    });
  });
});
