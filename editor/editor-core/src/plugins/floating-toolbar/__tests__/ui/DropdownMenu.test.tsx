import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { shallow } from 'enzyme';
import Item from '@atlaskit/item';
import DropdownMenu from '../../ui/DropdownMenu';
import { DropdownOptionT } from '../../ui/types';

describe('<DropdownMenu />', () => {
  it('should wrap item inside a <Tooltip /> when tooltip option is present', () => {
    const items: Array<DropdownOptionT<Function>> = [
      {
        onClick: jest.fn(),
        title: 'item with tooltip',
        tooltip: 'tooltip text',
      },
      {
        onClick: jest.fn(),
        title: 'title without tooltip',
      },
    ];
    const dropdownMenu = shallow(
      <DropdownMenu
        hide={jest.fn()}
        dispatchCommand={jest.fn()}
        items={items}
      />,
    );

    expect(dropdownMenu.find(Item)).toHaveLength(2);
    expect(dropdownMenu.find(Tooltip)).toHaveLength(1);
    expect(dropdownMenu.find(Tooltip).prop('content')).toEqual('tooltip text');
    expect(dropdownMenu.find(Tooltip).find(Item)).toHaveLength(1);
    expect(dropdownMenu.find(Tooltip).find(Item).prop('children')).toEqual(
      'item with tooltip',
    );
  });
});
