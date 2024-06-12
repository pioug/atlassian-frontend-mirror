import React from 'react';

import { Box } from '@atlaskit/primitives';

import { AtlassianNavigation } from '../src';

import { JapaneseCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { jiraPrimaryItemsJapanese } from './shared/primary-items';
import { DefaultProductHome } from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';

const AuthenticatedExample = () => (
	<Box lang="ja">
		<AtlassianNavigation
			label="Japanese"
			primaryItems={jiraPrimaryItemsJapanese}
			renderAppSwitcher={SwitcherPopup}
			renderCreate={JapaneseCreate}
			renderHelp={HelpPopup}
			renderNotifications={NotificationsPopup}
			renderProductHome={DefaultProductHome}
			renderProfile={ProfilePopup}
			renderSearch={DefaultSearch}
			renderSettings={DefaultSettings}
		/>
	</Box>
);

export default AuthenticatedExample;
