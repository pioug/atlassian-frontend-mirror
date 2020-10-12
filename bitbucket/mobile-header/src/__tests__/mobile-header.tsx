import React from 'react';

import { mount } from 'enzyme';

import ButtonGroup from '@atlaskit/button/button-group';
import AkButton from '@atlaskit/button/custom-theme-button';
import MenuIcon from '@atlaskit/icon/glyph/menu';

import MobileHeader from '../components/MobileHeader';
import * as styles from '../styled';

const Navigation = (isOpen: boolean) => isOpen && <div data-nav="true" />;
const Sidebar = (isOpen: boolean) => isOpen && <div data-sidebar="true" />;

test('clicking hamburger button fires onNavigationOpen', () => {
  const openSpy = jest.fn();
  const closeSpy = jest.fn();
  const wrapper = mount(
    <MobileHeader
      drawerState="none"
      menuIconLabel=""
      navigation={Navigation}
      sidebar={Sidebar}
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      pageHeading=""
    />,
  );
  wrapper.find(AkButton).simulate('click');
  expect(openSpy).toHaveBeenCalledTimes(1);
});

test('passing drawerState="navigation" should render nav', () => {
  const openSpy = jest.fn();
  const navSpy = jest.fn();
  const sidebarSpy = jest.fn();
  const closeSpy = jest.fn();
  mount(
    <MobileHeader
      menuIconLabel=""
      navigation={navSpy}
      sidebar={sidebarSpy}
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      drawerState="navigation"
      pageHeading=""
    />,
  );
  expect(navSpy).toHaveBeenCalledTimes(1);
  expect(navSpy).toHaveBeenCalledWith(true);
  expect(sidebarSpy).toHaveBeenCalledTimes(0);
});

test('passing drawerState="sidebar" should render sidebar', () => {
  const openSpy = jest.fn();
  const navSpy = jest.fn();
  const sidebarSpy = jest.fn();
  const closeSpy = jest.fn();
  mount(
    <MobileHeader
      menuIconLabel=""
      navigation={navSpy}
      sidebar={sidebarSpy}
      drawerState="sidebar"
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      pageHeading=""
    />,
  );
  expect(navSpy).toHaveBeenCalledTimes(0);
  expect(sidebarSpy).toHaveBeenCalledTimes(1);
  expect(sidebarSpy).toHaveBeenCalledWith(true);
});

test('clicking blanket calls onDrawerClose', () => {
  const openSpy = jest.fn();
  const closeSpy = jest.fn();
  const wrapper = mount(
    <MobileHeader
      menuIconLabel=""
      navigation={Navigation}
      sidebar={Sidebar}
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      drawerState="navigation"
      pageHeading=""
    />,
  );
  wrapper.find(styles.FakeBlanket).simulate('click');
  expect(closeSpy).toHaveBeenCalledTimes(1);
});

test('renders the page title', () => {
  const openSpy = jest.fn();
  const navSpy = jest.fn();
  const closeSpy = jest.fn();
  const sidebarSpy = jest.fn();
  const wrapper = mount(
    <MobileHeader
      menuIconLabel=""
      navigation={navSpy}
      sidebar={sidebarSpy}
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      drawerState="none"
      pageHeading="Pull requests"
    />,
  );

  expect(wrapper.find(styles.PageHeading).text()).toBe('Pull requests');
});

test('renders the secondary content if provided', () => {
  const navSpy = jest.fn();
  const closeSpy = jest.fn();
  const openSpy = jest.fn();
  const sidebarSpy = jest.fn();
  const wrapper = mount(
    <MobileHeader
      menuIconLabel=""
      navigation={navSpy}
      sidebar={sidebarSpy}
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      drawerState="none"
      secondaryContent={
        <ButtonGroup>
          <AkButton>One</AkButton>
          <AkButton>Two</AkButton>
        </ButtonGroup>
      }
      pageHeading=""
    />,
  );

  expect(wrapper.find(ButtonGroup).length).toBe(1);
});

test('renders the custom menu content if provided', () => {
  const closeSpy = jest.fn();
  const openSpy = jest.fn();
  const sidebarSpy = jest.fn();
  const wrapper = mount(
    <MobileHeader
      customMenu={<AkButton>Test</AkButton>}
      menuIconLabel="menu icon"
      sidebar={sidebarSpy}
      onDrawerClose={closeSpy}
      onNavigationOpen={openSpy}
      drawerState="none"
      pageHeading=""
    />,
  );

  const button = wrapper.find(AkButton);
  expect(button.length).toBe(1);
  expect(button.text()).toBe('Test');
  expect(wrapper.find(MenuIcon).length).toBe(0);
});
