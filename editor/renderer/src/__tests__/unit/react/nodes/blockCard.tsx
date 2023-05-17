import React from 'react';
import { render } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';
import { mount, ReactWrapper } from 'enzyme';

import { Card, Provider, Client } from '@atlaskit/smart-card';

import BlockCard from '../../../../react/nodes/blockCard';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { MockCardComponent } from './card.mock';

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
