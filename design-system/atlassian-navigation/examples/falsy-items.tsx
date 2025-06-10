import React from 'react';

import { AtlassianNavigation, PrimaryButton } from '@atlaskit/atlassian-navigation';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { defaultPrimaryItems } from './shared/primary-items';
import { DefaultProductHome } from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';

const AuthenticatedExample = () => (
	<AtlassianNavigation
		label="site"
		primaryItems={[
			<PrimaryButton>You should see me</PrimaryButton>,
			false && <PrimaryButton>You should not see me!!!</PrimaryButton>,
			null,
			undefined,
			false,
			...defaultPrimaryItems,
		]}
		renderAppSwitcher={SwitcherPopup}
		renderCreate={DefaultCreate}
		renderHelp={HelpPopup}
		renderNotifications={NotificationsPopup}
		renderProductHome={DefaultProductHome}
		renderProfile={ProfilePopup}
		renderSearch={DefaultSearch}
		renderSettings={DefaultSettings}
	/>
);

export default AuthenticatedExample;
