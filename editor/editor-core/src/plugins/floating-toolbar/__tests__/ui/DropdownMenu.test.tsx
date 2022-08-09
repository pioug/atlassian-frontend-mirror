import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ButtonItem } from '@atlaskit/menu';
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

    const dropdownMenu = mountWithIntl(
      <DropdownMenu
        hide={jest.fn()}
        dispatchCommand={jest.fn()}
        items={items}
      />,
    );

    expect(dropdownMenu.find(ButtonItem)).toHaveLength(2);
    expect(dropdownMenu.find(Tooltip)).toHaveLength(1);
    expect(dropdownMenu.find(Tooltip).prop('content')).toEqual('tooltip text');
    expect(dropdownMenu.find(Tooltip).find(ButtonItem)).toHaveLength(1);
    expect(
      dropdownMenu.find(Tooltip).find(ButtonItem).prop('children'),
    ).toEqual('item with tooltip');
  });
});
