import React, { Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { Spotlight } from '@atlaskit/onboarding';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import {
  GlobalItem,
  LayoutManager,
  NavigationProvider,
} from '@atlaskit/navigation-next';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import GlobalNavigation from '../src';

const AppSwitcherComponent = (props) => (
  <GlobalItem
    {...props}
    icon={AppSwitcherIcon}
    id="test"
    onClick={() => console.log('AppSwitcher clicked')}
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

export default class Example extends Component {
  state = {
    targetIndex: null,
  };

  icons = [
    'Product',
    'Starred',
    'Search',
    'Create',
    'Notification',
    'AppSwitcher',
    'Help',
    'Settings',
    'Profile',
  ];

  getRefs = () => {
    const refs = {};
    this.icons.forEach((icon) => {
      refs[`get${icon}Ref`] = this.getRef(icon);
    });

    return refs;
  };

  openChangeboarding = () => {
    this.setState({ targetIndex: 0 });
  };

  closeChangeboarding = () => {
    this.setState({ targetIndex: null });
  };

  getRef = (icon) => (node) => {
    if (node && node.current && node.current !== this[`${icon}Ref`]) {
      this[`${icon}Ref`] = node;
    }
  };

  targetNext = () => {
    this.setState(({ targetIndex }) => ({
      targetIndex: typeof targetIndex === 'number' ? targetIndex + 1 : null,
    }));
  };

  targetPrev = () => {
    this.setState(({ targetIndex }) => ({
      targetIndex: typeof targetIndex === 'number' ? targetIndex - 1 : null,
    }));
  };

  getTargetNode = () => {
    const { targetIndex } = this.state;

    if (targetIndex === null) {
      return null;
    }

    const targetIcon = this.icons[targetIndex];

    return this[`${targetIcon}Ref`].current;
  };

  renderGlobalNavigation = () => (
    <GlobalNavigation
      productIcon={EmojiAtlassianIcon}
      productHref="#"
      onProductClick={() => console.log('product clicked')}
      onCreateClick={() => console.log('create clicked')}
      onSearchClick={() => console.log('search clicked')}
      onStarredClick={() => console.log('starred clicked')}
      onNotificationClick={() => console.log('notification clicked')}
      appSwitcherComponent={AppSwitcherComponent}
      appSwitcherTooltip="Switch to ..."
      helpItems={ExampleDropdown}
      onSettingsClick={() => console.log('settings clicked')}
      profileItems={ExampleDropdown}
      profileIconUrl="https://api.adorable.io/avatars/285/abott@adorable.png"
      {...this.getRefs()}
    />
  );

  render() {
    const { targetIndex } = this.state;
    const targetNode = this.getTargetNode();
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={this.renderGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <div css={{ padding: '32px 40px' }}>
            <button onClick={this.openChangeboarding}>
              Start Change boarding
            </button>
          </div>
          {typeof targetIndex === 'number' && targetNode && (
            <Spotlight
              actions={[
                { onClick: this.closeChangeboarding, text: 'Close' },
                ...(targetIndex !== 0
                  ? [{ onClick: this.targetPrev, text: 'Prev' }]
                  : []),
                ...(targetIndex !== this.icons.length - 1
                  ? [{ onClick: this.targetNext, text: 'Next' }]
                  : []),
              ]}
              dialogPlacement="right bottom"
              heading="Let's learn about the Global Navigation"
              targetNode={targetNode}
              targetRadius={40}
            >
              <div>{`This is the ${this.icons[targetIndex]} icon`}</div>
            </Spotlight>
          )}
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
