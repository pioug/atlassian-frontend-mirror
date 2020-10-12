import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { AtlassianNavigation, ProductHome } from '../src';
import { SkeletonCreateButton, SkeletonIconButton } from '../src/skeleton';
import { SkeletonHelpButton } from '../src/skeleton-help-button';
import { SkeletonNotificationButton } from '../src/skeleton-notification-button';
import { SkeletonSettingsButton } from '../src/skeleton-settings-button';
import { SkeletonSwitcherButton } from '../src/skeleton-switcher-button';

import { avatarUrl } from './shared/ProfilePopup';

const SkeletonCreate = () => (
  <SkeletonCreateButton text="Create"></SkeletonCreateButton>
);
const SkeletonProfileButton = () => (
  <SkeletonIconButton>
    <img src={avatarUrl} alt="Your profile and settings" />
  </SkeletonIconButton>
);

const AtlassianNavigationExample = () => (
  <AtlassianNavigation
    label="site"
    moreLabel="More"
    primaryItems={[]}
    renderAppSwitcher={() => <SkeletonSwitcherButton label="switcher button" />}
    renderCreate={SkeletonCreate}
    renderProductHome={() => (
      <ProductHome icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />
    )}
    renderProfile={SkeletonProfileButton}
    renderSettings={() => <SkeletonSettingsButton label="settings button" />}
    renderHelp={() => <SkeletonHelpButton label="help button" />}
    renderNotifications={() => (
      <SkeletonNotificationButton label="notifications button" />
    )}
  />
);

export default AtlassianNavigationExample;
