import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  Atlassian navigation exports \`SkeletonCreateButton\`, \`SkeletonPrimaryButton\` and all the skeleton icon buttons is separate entrypoint files. These are **non-interactive** alternates which can be used to speed up the time to render and HTML generation of atlassian navigation in SSR mode. The reason they are fast is because they use a flat HTML structure and a small CSS and they bring in no additional dependencies.

    The skeleton buttons take up the same height and width as the original buttons in order to avoid jank when they are swapped out. They skeletons respect the theme that is passed into atlassian-navigation as the theme prop. They follow the same props API as the original counterparts, so there is no need to wranggle any props when swapping them.

    These components can be used on the server if hydration isn't a concern on the client. Or, they can be used on the client itself if rendering the navigation components take too long to render due for whatever reason.

  ${code`
import React from 'react';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { AtlassianNavigation, ProductHome } from '../src';
import {
  SkeletonCreateButton,
  SkeletonIconButton,
  SkeletonPrimaryButton,
} from '../src/skeleton';
import { SkeletonSettingsButton } from '../src/skeleton-settings-button';
import { SkeletonNotificationButton } from '../src/skeleton-notification-button';
import { SkeletonHelpButton } from '../src/skeleton-help-button';
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
const skeletonPrimaryItems = [
  <SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
  <SkeletonPrimaryButton isDropdownButton text="Projects" />,
  <SkeletonPrimaryButton
    isDropdownButton
    isHighlighted
    text="Filters &amp; issues"
  />,
  <SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
  <SkeletonPrimaryButton isDropdownButton text="Apps" />,
];

export const AtlassianNaviagtion = () => (
  <AtlassianNavigation
    label="site"
    moreLabel="More"
    primaryItems={skeletonPrimaryItems}
    renderAppSwitcher={() => <SkeletonSwitcherButton label="switcher button" />}
    renderCreate={SkeletonCreate}
    renderProductHome={() => (
      // Not passing an onClick or href to the product home renders it in a
      // non-interactive span with little react overhead.
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
`}

  ${(
    <Example
      title="Skeleton create and icon buttons"
      Component={require('../examples/skeleton-primary-buttons').default}
      source={require('!!raw-loader!../examples/skeleton-primary-buttons')}
    />
  )}


  ${(
    <Example
      title="Skeleton primary items buttons"
      Component={
        require('../examples/skeleton-create-and-icon-buttons').default
      }
      source={require('!!raw-loader!../examples/skeleton-create-and-icon-buttons')}
    />
  )}
`;
