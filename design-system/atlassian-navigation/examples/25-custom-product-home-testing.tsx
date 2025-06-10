import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { bitbucketPrimaryItems } from './shared/primary-items';
import { BitbucketProductHome } from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';

const CustomProductHomeExample = () => (
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
);

export default CustomProductHomeExample;
