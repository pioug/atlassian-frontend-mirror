import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
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

const SearchTooltip = () => (
  <div css={{ background: 'red' }}> Search Tooltip</div>
);

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    searchTooltip={<SearchTooltip />}
    searchLabel="Search Label"
    onProductClick={() => console.log('product clicked')}
    onCreateClick={() => console.log('create clicked')}
    onSearchClick={() => console.log('search clicked')}
    onStarredClick={() => console.log('starred clicked')}
    onHelpClick={() => console.log('help clicked')}
    helpItems={() => <div />}
    onNotificationClick={() => console.log('notification clicked')}
    appSwitcherComponent={AppSwitcherComponent}
    appSwitcherTooltip="Switch to ..."
    onSettingsClick={() => console.log('settings clicked')}
    loginHref="#login"
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);
