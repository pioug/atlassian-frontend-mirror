import React from 'react';
import { mount } from 'enzyme';

import { name } from '../../version.json';
import { MultiSelectStateless } from '../..';

describe(`${name} - shared functions`, () => {
  it('should render an array of items', () => {
    const items = [
      { content: 'test1', value: 'test1' },
      { content: 'test2', value: 'test2' },
    ];
    const wrapper = mount(<MultiSelectStateless items={items} />);
    expect(wrapper.state().groupedItems.length).toBe(1);
    expect(wrapper.state().groupedItems[0].items).toBe(items);
  });
  it('should render an array of groups', () => {
    const groups = [
      {
        items: [
          { content: 'test1', value: 'test1' },
          { content: 'test2', value: 'test2' },
        ],
      },
    ];

    const wrapper = mount(<MultiSelectStateless items={groups} />);
    expect(wrapper.state().groupedItems.length).toBe(1);
    expect(wrapper.state().groupedItems[0]).toBe(groups[0]);
  });
});
