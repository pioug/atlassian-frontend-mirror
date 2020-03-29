import React, { Component } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Button from '@atlaskit/button';

import Breadcrumbs, {
  BreadcrumbsStateless,
  BreadcrumbsItem as Item,
} from '../../..';
import EllipsisItem from '../../EllipsisItem';

describe('Breadcrumbs', () => {
  describe('exports', () => {
    it('the smart React component, Breadcrumbs component, and the Item component', () => {
      expect(Breadcrumbs).not.toBe(undefined);
      expect(BreadcrumbsStateless).not.toBe(undefined);
      expect(Item).not.toBe(undefined);
      expect(new Breadcrumbs({})).toBeInstanceOf(Component);
    });
  });

  describe('with more than 8 items', () => {
    let wrapper: ReactWrapper<any, any, Breadcrumbs>;

    beforeEach(() => {
      wrapper = mount(
        <Breadcrumbs>
          <Item text="item1" />
          <Item text="item2" />
          <Item text="item3" />
          <Item text="item4" />
          <Item text="item5" />
          <Item text="item6" />
          <Item text="item7" />
          <Item text="item8" />
          <Item text="item9" />
        </Breadcrumbs>,
      );
    });

    it('updates the expanded state when the ellipsis is clicked', () => {
      expect(wrapper.state().isExpanded).toBe(false);
      expect(wrapper.find(BreadcrumbsStateless).props().isExpanded).toBe(false);

      const ellipsisItem = wrapper.find(EllipsisItem);
      ellipsisItem.find(Button).simulate('click');
      expect(wrapper.state().isExpanded).toBe(true);
      expect(wrapper.find(BreadcrumbsStateless).props().isExpanded).toBe(true);
    });
  });
});
