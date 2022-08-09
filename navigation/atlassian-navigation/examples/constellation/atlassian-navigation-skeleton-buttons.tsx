/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { AtlassianNavigation, ProductHome } from '../../src';
import {
  SkeletonCreateButton,
  SkeletonIconButton,
  SkeletonPrimaryButton,
} from '../../src/skeleton';
import { SkeletonHelpButton } from '../../src/skeleton-help-button';
import { SkeletonNotificationButton } from '../../src/skeleton-notification-button';
import { SkeletonSettingsButton } from '../../src/skeleton-settings-button';
import { SkeletonSwitcherButton } from '../../src/skeleton-switcher-button';
import { avatarUrl } from '../shared/profile-popup';

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

const AtlassianNavigationSkeletonButtons = () => {
  return (
    <Fragment>
      <AtlassianNavigation
        label="site"
        moreLabel="More"
        primaryItems={skeletonPrimaryItems}
        renderAppSwitcher={() => (
          <SkeletonSwitcherButton label="switcher button" />
        )}
        renderCreate={SkeletonCreate}
        renderProductHome={() => (
          <ProductHome icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />
        )}
        renderProfile={SkeletonProfileButton}
        renderSettings={() => (
          <SkeletonSettingsButton label="settings button" />
        )}
        renderHelp={() => <SkeletonHelpButton label="help button" />}
        renderNotifications={() => (
          <SkeletonNotificationButton label="notifications button" />
        )}
        testId="atlassian-navigation"
      />
    </Fragment>
  );
};

export default AtlassianNavigationSkeletonButtons;
