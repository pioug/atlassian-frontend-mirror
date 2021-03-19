import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { Card } from '@atlaskit/smart-card';

import InlineCard from '../../../../react/nodes/inlineCard';

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
      <InlineCard
        url={url}
        eventHandlers={{
          smartCard: {
            onClick: mockedOnClick,
          },
        }}
      />,
    );

    const onClick = node.find(Card).prop('onClick');

    onClick(mockedEvent);

    expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
  });

  it('should render with onClick as undefined if eventHandlers is not present', () => {
    node = mount(<InlineCard url={url} />);

    expect(node.find(Card).prop('onClick')).toBeUndefined();
  });
});
