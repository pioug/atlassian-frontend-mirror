import React from 'react';
import { shallow } from 'enzyme';
import ListItem from '../../../../react/nodes/listItem';

describe('Renderer - React/Nodes/ListItem', () => {
  const listItem = shallow(<ListItem>This is a list item</ListItem>);

  it('should wrap content with <li>-tag', () => {
    expect(listItem.is('li')).toEqual(true);
  });
});
