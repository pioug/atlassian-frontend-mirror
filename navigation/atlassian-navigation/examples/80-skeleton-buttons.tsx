/** @jsx jsx */
import { Fragment, KeyboardEvent, useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { PopupProps } from '@atlaskit/popup/types';

import {
  AtlassianNavigation,
  PrimaryButton,
  PrimaryDropdownButton,
  ProductHome,
  Settings,
} from '../src';
import { useOverflowStatus } from '../src/controllers/overflow';
import {
  SkeletonCreateButton,
  SkeletonIconButton,
  SkeletonPrimaryButton,
} from '../src/skeleton';
import { SkeletonHelpButton } from '../src/skeleton-help-button';
import { SkeletonNotificationButton } from '../src/skeleton-notification-button';
import { SkeletonSettingsButton } from '../src/skeleton-settings-button';
import { SkeletonSwitcherButton } from '../src/skeleton-switcher-button';

import { DefaultCreate } from './shared/Create';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';
import { avatarUrl, ProfilePopup } from './shared/ProfilePopup';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { theme } from './shared/themes';

const SettingsDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Settings isSelected={isOpen} onClick={onClick} tooltip="Settings" />
      <Drawer isOpen={isOpen} onClose={onClose}>
        settings drawer
      </Drawer>
    </Fragment>
  );
};

const ProjectsContent = () => (
  <MenuGroup>
    <Section title="Starred">
      <ButtonItem>Mobile Research</ButtonItem>
      <ButtonItem testId="it-services">IT Services</ButtonItem>
    </Section>
    <Section hasSeparator title="Recent">
      <ButtonItem>Engineering Leadership</ButtonItem>
      <ButtonItem>BAU</ButtonItem>
      <ButtonItem>Hardware Support</ButtonItem>
      <ButtonItem>New Features</ButtonItem>
      <ButtonItem>SAS</ButtonItem>
    </Section>
    <Section hasSeparator>
      <ButtonItem>View all projects</ButtonItem>
    </Section>
  </MenuGroup>
);

const FiltersContent = () => (
  <MenuGroup>
    <Section title="Starred">
      <ButtonItem>Assigned to me</ButtonItem>
      <ButtonItem>Created by me</ButtonItem>
      <ButtonItem>Updated recently</ButtonItem>
    </Section>
    <Section hasSeparator title="Recent">
      <ButtonItem>Engineering Leadership</ButtonItem>
      <ButtonItem>Viewed recently</ButtonItem>
      <ButtonItem>Resolved recently</ButtonItem>
      <ButtonItem>Done issues</ButtonItem>
    </Section>
    <Section hasSeparator>
      <ButtonItem>View all filters</ButtonItem>
    </Section>
  </MenuGroup>
);

const DashboardsContent = () => (
  <MenuGroup>
    <Section title="Starred">
      <ButtonItem>System dashboard</ButtonItem>
      <ButtonItem>Innovation week</ButtonItem>
    </Section>
    <Section hasSeparator title="Recent">
      <ButtonItem>Vanguard</ButtonItem>
      <ButtonItem>Pearformance</ButtonItem>
      <ButtonItem>Vertigo</ButtonItem>
    </Section>
    <Section hasSeparator>
      <ButtonItem>View all dashboards</ButtonItem>
    </Section>
  </MenuGroup>
);

const AppsContent = () => (
  <MenuGroup>
    <Section title="Third Party">
      <ButtonItem>Portfolio</ButtonItem>
      <ButtonItem>Tempo timesheets</ButtonItem>
      <ButtonItem>Slack</ButtonItem>
      <ButtonItem>Invision</ButtonItem>
    </Section>
    <Section hasSeparator>
      <ButtonItem>Explore apps</ButtonItem>
    </Section>
  </MenuGroup>
);

type PrimaryDropdownProps = {
  content: PopupProps['content'];
  text: string;
  isHighlighted?: boolean;
};

const PrimaryDropdown = (props: PrimaryDropdownProps) => {
  const { content, text, isHighlighted } = props;
  const { isVisible, closeOverflowMenu } = useOverflowStatus();
  const [isOpen, setIsOpen] = useState(false);
  const onDropdownItemClick = () => {
    console.log(
      'Programmatically closing the menu, even though the click happens inside the popup menu.',
    );
    closeOverflowMenu();
  };

  if (!isVisible) {
    return (
      <ButtonItem testId={text} onClick={onDropdownItemClick}>
        {text}
      </ButtonItem>
    );
  }

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      setIsOpen(true);
    }
  };

  return (
    <Popup
      content={content}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      testId={`${text}-popup`}
      trigger={(triggerProps) => (
        <PrimaryDropdownButton
          onClick={onClick}
          onKeyDown={onKeyDown}
          isHighlighted={isHighlighted}
          isSelected={isOpen}
          testId={`${text}-popup-trigger`}
          {...triggerProps}
        >
          {text}
        </PrimaryDropdownButton>
      )}
    />
  );
};

const SkeletonCreate = () => (
  <SkeletonCreateButton text="Create"></SkeletonCreateButton>
);
const SkeletonProfileButton = () => (
  <SkeletonIconButton>
    <img src={avatarUrl} alt="Your profile and settings" />
  </SkeletonIconButton>
);
const skeletonPrimaryItems = [
  <SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
  <SkeletonPrimaryButton isDropdownButton text="Projects" />,
  <SkeletonPrimaryButton
    isDropdownButton
    isHighlighted
    text="Filters &amp; issues"
  />,
  <SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
  <SkeletonPrimaryButton isDropdownButton text="Apps" testId="apps-skeleton" />,
];
const primaryItems = [
  <PrimaryButton
    href="http://www.atlassian.com"
    onClick={(e) => {
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      e.preventDefault();
      console.log('onClick fired');
    }}
  >
    Home
  </PrimaryButton>,
  <PrimaryDropdown content={ProjectsContent} text="Projects" />,
  <PrimaryDropdown
    isHighlighted
    content={FiltersContent}
    text="Filters &amp; issues"
  />,
  <PrimaryDropdown content={DashboardsContent} text="Dashboards" />,
  <PrimaryDropdown content={AppsContent} text="Apps" />,
];

const JiraIntegrationWithSkeletonButtonsExample = () => {
  const [shouldUseSkeletons, setShoulUseSkeletons] = useState(true);
  const [themeIndex, setThemeIndex] = useState(0);

  return (
    <Fragment>
      <AtlassianNavigation
        label="site"
        moreLabel="More"
        primaryItems={shouldUseSkeletons ? skeletonPrimaryItems : primaryItems}
        renderAppSwitcher={
          shouldUseSkeletons
            ? () => <SkeletonSwitcherButton label="switcher button" />
            : SwitcherPopup
        }
        renderCreate={shouldUseSkeletons ? SkeletonCreate : DefaultCreate}
        renderProductHome={() => (
          <ProductHome
            icon={JiraIcon}
            logo={JiraLogo}
            siteTitle="Hello"
            onClick={shouldUseSkeletons ? undefined : console.log}
          />
        )}
        renderProfile={
          shouldUseSkeletons ? SkeletonProfileButton : ProfilePopup
        }
        renderSettings={
          shouldUseSkeletons
            ? () => <SkeletonSettingsButton label="settings button" />
            : SettingsDrawer
        }
        renderHelp={
          shouldUseSkeletons
            ? () => <SkeletonHelpButton label="help button" />
            : HelpPopup
        }
        renderNotifications={
          shouldUseSkeletons
            ? () => <SkeletonNotificationButton label="notifications button" />
            : NotificationsPopup
        }
        theme={theme[themeIndex]}
        testId="atlassian-navigation"
      />
      <p css={{ padding: '8px 16px' }}>
        <Button
          testId="toggle-skeleton"
          onClick={() => setShoulUseSkeletons(!shouldUseSkeletons)}
        >
          Use {shouldUseSkeletons ? 'regular ' : 'skeleton '} buttons
        </Button>
      </p>
      <p css={{ padding: '8px 16px' }}>
        <Button
          testId="change-theme"
          onClick={() => setThemeIndex((themeIndex + 1) % theme.length)}
        >
          Change theme
        </Button>
      </p>
      <p>
        SkeletonButtons are different to the other{' '}
        <a href="https://atlaskit.atlassian.com/examples/navigation/atlassian-navigation/themed-skeleton-example">
          Skeleton components
        </a>
        . They are a light-weight, single HTML button element with some CSS that
        represents their more heavy interactive counterparts.
      </p>
    </Fragment>
  );
};

export default JiraIntegrationWithSkeletonButtonsExample;
