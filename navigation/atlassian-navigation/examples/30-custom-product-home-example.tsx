import React from 'react';

import { AtlassianNavigation } from '../src';

import { DefaultCreate } from './shared/Create';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';
import {
  bitbucketPrimaryItems,
  confluencePrimaryItems,
  jiraPrimaryItems,
  opsGeniePrimaryItems,
} from './shared/PrimaryItems';
import {
  BitbucketProductHome,
  ConfluenceProductHome,
  DefaultCustomProductHome,
  JiraProductHome,
  JiraServiceManagementProductHome,
  JiraSoftwareProductHome,
  OpsGenieProductHome,
} from './shared/ProductHome';
import { ProfilePopup } from './shared/ProfilePopup';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { SwitcherPopup } from './shared/SwitcherPopup';

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
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={JiraSoftwareProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      label="site"
      primaryItems={opsGeniePrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={OpsGenieProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
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
    />
  </div>
);

export default CustomProductHomeExample;
