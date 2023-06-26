import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { render } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { Card, Provider, Client } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';

import InlineCard from '../../../../react/nodes/inlineCard';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MockCardComponent } from './card.mock';
import type { EventHandlers } from '@atlaskit/editor-common/ui';

jest.mock('@atlaskit/smart-card', () => {
  const originalModule = jest.requireActual('@atlaskit/smart-card');
  return {
    ...originalModule,
    Card: jest.fn((props) => <originalModule.Card {...props} />),
  };
});

describe('Renderer - React/Nodes/InlineCard', () => {
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

  it('should render a <span>-tag', () => {
    node = mount(<InlineCard url={url} />);
    expect(node.getDOMNode()['tagName']).toEqual('SPAN');
  });

  it('should render with url if prop exists', () => {
    node = mount(<InlineCard url={url} />);
    expect(node.find(InlineCard).prop('url')).toEqual(url);
  });

  it('should render with data if prop exists', () => {
    node = mount(<InlineCard data={data} />);
    expect(node.find(InlineCard).prop('data')).toEqual(data);
  });

  it('should render with onClick if eventHandlers has correct event key', () => {
    const mockedOnClick = jest.fn();
    const mockedEvent = { target: {} };
    node = mount(
      <Provider client={new Client('staging')}>
        <InlineCard
          url={url}
          eventHandlers={{
            smartCard: {
              onClick: mockedOnClick,
            },
          }}
        />{' '}
      </Provider>,
    );

    const onClick = node.find(Card).prop('onClick');

    onClick(mockedEvent);

    expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
  });

  it('should render with onClick as undefined if eventHandlers is not present', () => {
    node = mount(
      <Provider client={new Client('staging')}>
        <InlineCard url={url} />{' '}
      </Provider>,
    );

    expect(node.find(Card).prop('onClick')).toBeUndefined();
  });

  it('should render with showAuthTooltip if defined in smartLinks options', () => {
    node = mount(
      <Provider client={new Client('staging')}>
        <InlineCard url={url} smartLinks={{ showAuthTooltip: true }} />
      </Provider>,
    );
    expect(node.find(Card).prop('showAuthTooltip')).toEqual(true);
  });

  it('should render with showServerActions if defined in smartLinks options', () => {
    node = mount(
      <Provider client={new Client('staging')}>
        <InlineCard url={url} smartLinks={{ showServerActions: true }} />
      </Provider>,
    );
    expect(node.find(Card).prop('showServerActions')).toEqual(true);
  });

  it('should use Card SSR component for ssr mode', () => {
    const mockedOnClick = jest.fn();
    const mockedEvent = { target: {} };
    const mockEventHandlers: EventHandlers = {
      smartCard: { onClick: mockedOnClick },
    };
    node = mount(
      <Provider client={new Client('staging')}>
        <InlineCard
          url={url}
          smartLinks={{
            ssr: true,
            showAuthTooltip: true,
            showServerActions: true,
          }}
          eventHandlers={mockEventHandlers}
        />
      </Provider>,
    );

    expect(node.find(CardSSR).props()).toEqual({
      url,
      appearance: 'inline',
      showAuthTooltip: true,
      showServerActions: true,
      onClick: expect.any(Function),
    });

    const onClick = node.find(CardSSR).prop('onClick');
    onClick(mockedEvent);
    expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
  });
});

describe('Renderer - React/Nodes/InlineCard - analytics context', () => {
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
        <InlineCard url="https://atlassian.com" />
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
