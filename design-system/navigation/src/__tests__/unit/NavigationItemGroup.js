import React from 'react';
import { ItemGroup } from '@atlaskit/item';
import NavigationItemGroup from '../../components/js/NavigationItemGroup';
import { mountWithRootTheme } from './_theme-util';
import NavigationItemGroupTitle from '../../components/styled/NavigationItemGroupTitle';
import NavigationItemGroupSeparator from '../../components/styled/NavigationItemGroupSeparator';
import NavigationItemGroupAction from '../../components/styled/NavigationItemGroupAction';

describe('<NavigationItemGroup />', () => {
  describe('props', () => {
    it('title should render a title', () => {
      expect(
        mountWithRootTheme(<NavigationItemGroup title="foo" />)
          .find(NavigationItemGroupTitle)
          .text(),
      ).toBe('foo');
    });
    it('action should render in the container item group', () => {
      const nav = mountWithRootTheme(
        <NavigationItemGroup
          action={<div className="create">Create button</div>}
        />,
      );
      expect(nav.find('.create').length).toBe(1); // ensure that only one is rendered
      expect(nav.find(ItemGroup).find('.create').length).toBe(1); // ensure that it's delegated to the Item component
    });
    it('separator should render in the container item group', () => {
      expect(
        mountWithRootTheme(<NavigationItemGroup hasSeparator />).find(
          NavigationItemGroupSeparator,
        ).length,
      ).toBe(1);
    });
    it('with no action specified, no action should be rendered', () => {
      expect(
        mountWithRootTheme(<NavigationItemGroup />).find(
          NavigationItemGroupAction,
        ).length,
      ).toBe(0);
    });
    it('with no separator specified, no separator should be rendered', () => {
      expect(
        mountWithRootTheme(<NavigationItemGroup />).find(
          NavigationItemGroupSeparator,
        ).length,
      ).toBe(0);
    });
  });
});
