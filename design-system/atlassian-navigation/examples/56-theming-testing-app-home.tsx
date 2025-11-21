import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { defaultPrimaryItems } from './shared/primary-items';
import { DefaultAppHome } from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';
import { themes } from './shared/themes';

const ThemingExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		primaryItems={defaultPrimaryItems}
		renderAppSwitcher={SwitcherPopup}
		renderCreate={DefaultCreate}
		renderHelp={HelpPopup}
		renderNotifications={NotificationsPopup}
		renderProductHome={DefaultAppHome}
		renderProfile={ProfilePopup}
		renderSearch={DefaultSearch}
		renderSettings={DefaultSettings}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		theme={themes[0]}
	/>
);

export default ThemingExample;
