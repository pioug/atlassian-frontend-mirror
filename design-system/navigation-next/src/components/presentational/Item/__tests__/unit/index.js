import React from 'react';

import { mount, shallow } from 'enzyme';

import InteractionStateManager from '../../../InteractionStateManager';
import Item, { ItemBase } from '../../index';
import ItemPrimitive from '../../primitives';

describe('Item', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render correctly', () => {
    const wrapper = mount(<Item text="My item" />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should wrap ItemBase with navigationItemClicked HOC', () => {
    const mockNavigationItemClicked = jest.fn(() => () => null);
    jest.doMock('../../../../../common/analytics', () => ({
      navigationItemClicked: mockNavigationItemClicked,
    }));
    const { ItemBase: RequiredItemBase } = require('../../index');

    expect(mockNavigationItemClicked).toHaveBeenCalledWith(
      RequiredItemBase,
      'item',
    );
  });

  describe('ItemBase', () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        createAnalyticsEvent: () => null,
        text: 'My item',
      };
    });
    it('should render an InteractionStateManager', () => {
      const wrapper = shallow(<ItemBase {...defaultProps} />);

      expect(wrapper.find(InteractionStateManager)).toHaveLength(1);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the Item primitive', () => {
      const wrapper = shallow(<ItemBase {...defaultProps} />);

      const renderChildren = wrapper.find(InteractionStateManager).dive();

      const primitive = renderChildren.find(ItemPrimitive);

      expect(primitive).toHaveLength(1);
      expect(primitive).toMatchSnapshot();
    });
  });
});
