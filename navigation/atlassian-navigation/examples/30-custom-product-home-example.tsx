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
      renderProductHome={JiraSoftwareProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
      testId="jsw-nav"
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
      testId="opsgenie-nav"
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
