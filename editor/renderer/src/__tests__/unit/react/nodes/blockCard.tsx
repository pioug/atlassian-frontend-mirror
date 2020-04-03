import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import BlockCard from '../../../../react/nodes/blockCard';

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
});
