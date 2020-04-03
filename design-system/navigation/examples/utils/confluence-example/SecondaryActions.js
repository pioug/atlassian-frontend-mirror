/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { gridSize } from '@atlaskit/theme';
import {
  DropdownItemGroup,
  DropdownItem,
  DropdownMenuStateless,
} from '@atlaskit/dropdown-menu';
import Avatar from '@atlaskit/avatar';
import HomeFilledIcon from '@atlaskit/icon/glyph/home';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import styled from 'styled-components';
import Tooltip from '@atlaskit/tooltip';
import { JiraIcon } from '@atlaskit/logo';

import { AkNavigationItem, AkGlobalItem } from '../../../src';
import emmaAvatar from '../emma.png';

/** This is just a handy little HoC around DropdownMenu which creates a stateful menu
 and turns the trigger prop into a render prop, passing in the isOpen state. */
class SelectableDropdownMenu extends Component {
  state = {
    isOpen: false,
  };

  onOpenChange = openState => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange(openState);
    }
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    const isUsingDeprecatedAPI = Boolean(
      this.props.items && this.props.items.length,
    );

    return isUsingDeprecatedAPI ? (
      <DropdownMenuStateless
        {...this.props}
        isOpen={isOpen}
        onOpenChange={this.onOpenChange}
      >
        {this.props.children(isOpen)}
      </DropdownMenuStateless>
    ) : (
      <DropdownMenuStateless
        {...this.props}
        isOpen={isOpen}
        onOpenChange={this.onOpenChange}
        trigger={this.props.trigger && this.props.trigger(isOpen)}
      />
    );
  }
}

const DropdownWrapper = styled.div`
  padding-bottom: ${gridSize() / 2}px;
`;

const HelpMenu = () => (
  <SelectableDropdownMenu
    appearance="tall"
    position="right bottom"
    trigger={isOpen => (
      <AkGlobalItem href="" isSelected={isOpen}>
        <Tooltip position="right" content="Help">
          <QuestionCircleIcon
            label="Help icon"
            secondaryColor="inherit"
            size="medium"
          />
        </Tooltip>
      </AkGlobalItem>
    )}
  >
    <DropdownItemGroup title="HELP">
      <DropdownItem>Online Help</DropdownItem>
      <DropdownItem>Get the mobile app</DropdownItem>
      <DropdownItem>Feed Builder</DropdownItem>
      <DropdownItem>Keyboard Shortcuts</DropdownItem>
      <DropdownItem>Site Status</DropdownItem>
      <DropdownItem>What's new</DropdownItem>
      <DropdownItem>Available Gadgets</DropdownItem>
      <DropdownItem>About Confluence</DropdownItem>
      <DropdownItem>Feedback Page</DropdownItem>
      <DropdownItem>Lightbox</DropdownItem>
      <DropdownItem>Questions</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="LEGAL">
      <DropdownItem>Terms of service</DropdownItem>
      <DropdownItem>Privacy policy</DropdownItem>
    </DropdownItemGroup>
  </SelectableDropdownMenu>
);

const UserMenu = () => (
  <SelectableDropdownMenu
    appearance="tall"
    position="right bottom"
    trigger={isOpen => (
      <AkGlobalItem href="" isSelected={isOpen}>
        <Tooltip position="right" content="Your profile and settings">
          <Avatar size="small" src={emmaAvatar} borderColor="transparent" />
        </Tooltip>
      </AkGlobalItem>
    )}
  >
    <DropdownItemGroup title="NEW CONFLUENCE EXPERIENCE">
      <DropdownItem>What's changed</DropdownItem>
      <DropdownItem>Give feedback</DropdownItem>
    </DropdownItemGroup>
    <DropdownItem>Turn off for now</DropdownItem>
    <DropdownItemGroup title="MY CONFLUENCE">
      <DropdownItem>Add Personnal Space...</DropdownItem>
      <DropdownItem>Recently Viewed</DropdownItem>
      <DropdownItem>Profile</DropdownItem>
      <DropdownItem>Tasks</DropdownItem>
      <DropdownItem>Saved for later</DropdownItem>
      <DropdownItem>Watches</DropdownItem>
      <DropdownItem>Drafts</DropdownItem>
      <DropdownItem>Network</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Log Out</DropdownItem>
    </DropdownItemGroup>
  </SelectableDropdownMenu>
);

const NotificationsMenu = ({ menuLoading, timerMenu }) => (
  <SelectableDropdownMenu
    appearance="tall"
    onOpenChange={({ isOpen }) => {
      if (isOpen) {
        timerMenu();
      }
    }}
    position="right bottom"
    isLoading={menuLoading}
    trigger={isOpen => (
      <AkGlobalItem href="" isSelected={isOpen}>
        <Tooltip position="right" content="Notifications">
          <NotificationIcon label="Notifications icon" size="medium" />
        </Tooltip>
      </AkGlobalItem>
    )}
  >
    <DropdownItemGroup title="NOTIFICATIONS">
      <DropdownItem>Hi</DropdownItem>
      <DropdownItem>Nothing to be notified...</DropdownItem>
    </DropdownItemGroup>
  </SelectableDropdownMenu>
);

const AppSwitcherMenu = ({ menuLoading, timerMenu }) => (
  <DropdownWrapper>
    <SelectableDropdownMenu
      appearance="tall"
      position="right bottom"
      onOpenChange={({ isOpen }) => {
        if (isOpen) {
          timerMenu();
        }
      }}
      isLoading={menuLoading}
      trigger={isOpen => (
        <AkGlobalItem href="" isSelected={isOpen}>
          <Tooltip position="right" content="Applications Switcher">
            <MenuIcon label="Applications Switcher" size="medium" />
          </Tooltip>
        </AkGlobalItem>
      )}
    >
      <AkNavigationItem
        icon={<HomeFilledIcon label="Home icon" />}
        text="Home"
        href="https://servicedog.atlassian.net/home"
      />
      <AkNavigationItem
        icon={<JiraIcon label="Jira icon" />}
        text="Jira"
        href="https://ecosystem.atlassian.net/home"
      />
    </SelectableDropdownMenu>
  </DropdownWrapper>
);

const SecondaryActions = ({ timerMenu, menuLoading }) => [
  <NotificationsMenu timerMenu={timerMenu} menuLoading={menuLoading} />,
  <AppSwitcherMenu timerMenu={timerMenu} menuLoading={menuLoading} />,
  <HelpMenu />,
  <UserMenu />,
];

export default SecondaryActions;
