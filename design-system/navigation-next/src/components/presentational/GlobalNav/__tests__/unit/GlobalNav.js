import React from 'react';

import { mount } from 'enzyme';

import {
  GlobalItem,
  LayoutManager,
  NavigationProvider,
} from '../../../../../index';
import GlobalNav from '../../index';

const primaryItems = [{ id: 'primary-item-1', icon: () => null }];
const secondaryItems = [{ id: 'secondary-item-1', icon: () => null }];
const GlobalNavigation = (props) => (
  <GlobalNav
    primaryItems={primaryItems}
    secondaryItems={secondaryItems}
    {...props}
  />
);
const ProductNavigation = () => null;

const Nav = ({ globalNavigation }) => (
  <NavigationProvider>
    <LayoutManager
      productNavigation={ProductNavigation}
      containerNavigation={null}
      globalNavigation={globalNavigation}
    >
      <div>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);

describe('GlobalNav', () => {
  describe('GlobalNav#itemComponent', () => {
    it('should render GlobalItems by default', () => {
      const wrapper = mount(<Nav globalNavigation={GlobalNavigation} />);
      expect(wrapper.find(GlobalItem)).toHaveLength(2);
    });

    it('should render the custom itemComponent if one is provided', () => {
      const ItemComponent = () => null;
      const wrapper = mount(
        <Nav
          globalNavigation={() => (
            <GlobalNavigation itemComponent={ItemComponent} />
          )}
        />,
      );
      expect(wrapper.find(ItemComponent)).toHaveLength(2);
    });
  });
});
