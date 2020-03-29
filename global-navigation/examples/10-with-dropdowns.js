import React from 'react';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';

import GlobalNavigation from '../src';

const HelpBadge = () => (
  <div
    style={{
      width: '.75rem',
      height: '.75rem',
      borderRadius: '50%',
      backgroundColor: 'thistle',
      position: 'relative',
      top: 4,
      left: -3,
    }}
  />
);
const ExampleDropdown = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem>Hello it with some really quite long text here.</DropdownItem>
    <DropdownItem>Some text 2</DropdownItem>
    <DropdownItem isDisabled>Some disabled text</DropdownItem>
    <DropdownItem>Some more text</DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      A link item
    </DropdownItem>
  </DropdownItemGroup>
);

const GlobalNav = () => (
  <GlobalNavigation
    helpItems={ExampleDropdown}
    helpBadge={HelpBadge}
    profileItems={ExampleDropdown}
    profileIconUrl="https://api.adorable.io/avatars/285/bruh@adorable.io.png"
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={GlobalNav}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);
