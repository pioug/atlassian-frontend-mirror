import React from 'react';

import { AtlassianNavigation } from '../src';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import {
  bitbucketPrimaryItems,
  confluencePrimaryItems,
  jiraPrimaryItems,
} from './shared/primary-items';
import {
  BitbucketProductHome,
  CompassProductHome,
  ConfluenceProductHome,
  DefaultCustomProductHome,
  JiraProductHome,
  JiraServiceManagementProductHome,
} from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';

const CustomProductHomeExample = () => (
  <div>
    <AtlassianNavigation
      label="site"
      primaryItems={bitbucketPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={BitbucketProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="bitbucket-nav"
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={confluencePrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={ConfluenceProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="confluence-nav"
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={JiraProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="jira-nav"
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={JiraServiceManagementProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="jsm-nav"
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={CompassProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="compass-nav"
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={DefaultCustomProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="custom-nav"
    />
  </div>
);

export default CustomProductHomeExample;
