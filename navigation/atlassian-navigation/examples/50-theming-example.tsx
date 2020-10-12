import React, { Fragment } from 'react';

import { AtlassianNavigation } from '../src';

import { DefaultCreate } from './shared/Create';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { ProfilePopup } from './shared/ProfilePopup';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { themes } from './shared/themes';

const ThemingExample = () => (
  <div>
    {themes.map((theme, i) => (
      <Fragment key={i}>
        <AtlassianNavigation
          label="site"
          primaryItems={defaultPrimaryItems}
          renderAppSwitcher={SwitcherPopup}
          renderCreate={DefaultCreate}
          renderHelp={HelpPopup}
          renderNotifications={NotificationsPopup}
          renderProductHome={DefaultProductHome}
          renderProfile={ProfilePopup}
          renderSearch={DefaultSearch}
          renderSettings={DefaultSettings}
          theme={theme}
        />
        {i < themes.length - 1 && <br />}
      </Fragment>
    ))}
  </div>
);

export default ThemingExample;
