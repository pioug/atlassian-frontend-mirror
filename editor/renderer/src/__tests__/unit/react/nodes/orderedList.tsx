import React from 'react';
import { shallow } from 'enzyme';
import OrderedList from '../../../../react/nodes/orderedList';

describe('Renderer - React/Nodes/OrderedList', () => {
  it('should wrap content with <ol>-tag with no start prop', () => {
    const orderedList = shallow(
      <OrderedList>This is a ordered list</OrderedList>,
    );
    expect(orderedList.is('ol')).toEqual(true);
    expect(orderedList.prop('start')).toEqual(undefined);
  });

  it('should wrap content with <ol>-tag with start prop', () => {
    const orderedList = shallow(
      <OrderedList start={3}>This is a ordered list</OrderedList>,
    );
    expect(orderedList.is('ol')).toEqual(true);
    expect(orderedList.prop('start')).toEqual(3);
  });
});
