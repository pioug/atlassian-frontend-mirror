import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
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
});
