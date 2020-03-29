import React from 'react';
import GlobalPrimaryActions from '../../components/js/GlobalPrimaryActions';
import { mountWithRootTheme, shallowWithTheme } from './_theme-util';
import GlobalItem from '../../components/js/GlobalItem';
import DrawerTrigger from '../../components/js/DrawerTrigger';
import GlobalPrimaryActionsList from '../../components/js/GlobalPrimaryActionsList';

describe('<GlobalPrimaryActions />', () => {
  describe('renders', () => {
    it('renders 0 GlobalItems with no props', () => {
      expect(
        shallowWithTheme(<GlobalPrimaryActions />).find(GlobalItem).length,
      ).toBe(0);
    });
    it('renders 1 GlobalItem with a primaryIcon', () => {
      expect(
        shallowWithTheme(
          <GlobalPrimaryActions primaryIcon={<img alt="foo" />} />,
        ).find(GlobalItem).length,
      ).toBe(1);
    });
    it('renders 2 GlobalItems with a primaryIcon and a search icon', () => {
      expect(
        mountWithRootTheme(
          <GlobalPrimaryActions
            primaryIcon={<img alt="foo" />}
            searchIcon={<img alt="foo" />}
          />,
        ).find(GlobalItem).length,
      ).toBe(2);
    });
    it('renders 3 GlobalItems with a primaryIcon, searchIcon and a createIcon', () => {
      expect(
        mountWithRootTheme(
          <GlobalPrimaryActions
            primaryIcon={<img alt="foo" />}
            searchIcon={<img alt="foo" />}
            createIcon={<img alt="foo" />}
          />,
        ).find(GlobalItem).length,
      ).toBe(3);
    });
    it('renders a GlobalPrimaryActionsList instead of create and search items if `actions` prop is supplied', () => {
      const wrapper = shallowWithTheme(
        <GlobalPrimaryActions actions={[<div>hello</div>]} />,
      );
      expect(wrapper.find(DrawerTrigger).length).toBe(0);
      expect(wrapper.find(GlobalPrimaryActionsList).length).toBe(1);
    });
  });
  describe('props', () => {
    it('appearance is passed onto all <GlobalItem />', () => {
      const globalItems = shallowWithTheme(
        <GlobalPrimaryActions appearance="container" />,
      ).find(GlobalItem);
      expect(
        globalItems.everyWhere(
          globalItem => globalItem.props().appearance === 'container',
        ),
      ).toBe(true);
    });
    it('linkComponent is passed onto the first <GlobalItem />', () => {
      const linkComponent = () => null;
      expect(
        shallowWithTheme(
          <GlobalPrimaryActions
            linkComponent={linkComponent}
            primaryIcon={<img alt="foo" />}
          />,
        )
          .find(GlobalItem)
          .at(0)
          .props().linkComponent,
      ).toBe(linkComponent);
    });

    it('primaryIcon is passed onto the first <GlobalItem />', () => {
      const primaryIcon = <img alt="foo" />;
      expect(
        shallowWithTheme(<GlobalPrimaryActions primaryIcon={primaryIcon} />)
          .find(GlobalItem)
          .at(0)
          .props().children,
      ).toBe(primaryIcon);
    });
    it('primaryItemHref is passed onto the first <GlobalItem />', () => {
      expect(
        shallowWithTheme(
          <GlobalPrimaryActions
            primaryIcon={<img alt="foo" />}
            primaryItemHref="#foo"
          />,
        )
          .find(GlobalItem)
          .at(0)
          .props().href,
      ).toBe('#foo');
    });
    it('onSearchActivate is given to to the first <DrawerTrigger />', () => {
      const handler = jest.fn();
      expect(
        mountWithRootTheme(
          <GlobalPrimaryActions
            searchIcon={<span>fake search icon</span>}
            createIcon={<span>fake create icon</span>}
            onSearchActivate={handler}
          />,
        )
          .find(DrawerTrigger)
          .at(0)
          .props().onActivate,
      ).toBe(handler);
    });
    it('onCreateActivate is given to to the second <DrawerTrigger />', () => {
      const handler = jest.fn();
      expect(
        mountWithRootTheme(
          <GlobalPrimaryActions
            searchIcon={<span>fake search icon</span>}
            createIcon={<span>fake create icon</span>}
            onCreateActivate={handler}
          />,
        )
          .find(DrawerTrigger)
          .at(1)
          .props().onActivate,
      ).toBe(handler);
    });
  });
});
