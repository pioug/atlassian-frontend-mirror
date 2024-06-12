import React from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import { AtlassianNavigation } from '../src';

import {
	DefaultCreate,
	GermanCreate,
	JapaneseCreate,
	SpanishCreate,
	TurkishCreate,
} from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import {
	defaultPrimaryItems,
	jiraPrimaryItemsGerman,
	jiraPrimaryItemsJapanese,
	jiraPrimaryItemsSpanish,
	jiraPrimaryItemsTurkish,
} from './shared/primary-items';
import { DefaultProductHome } from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';

const AuthenticatedExample = () => (
	<Stack space="space.100">
		<Box lang="en">
			<AtlassianNavigation
				label="english"
				primaryItems={defaultPrimaryItems}
				renderAppSwitcher={SwitcherPopup}
				renderCreate={DefaultCreate}
				renderHelp={HelpPopup}
				renderNotifications={NotificationsPopup}
				renderProductHome={DefaultProductHome}
				renderProfile={ProfilePopup}
				renderSearch={DefaultSearch}
				renderSettings={DefaultSettings}
			/>
		</Box>
		<Box lang="de">
			<AtlassianNavigation
				label="german"
				primaryItems={jiraPrimaryItemsGerman}
				renderAppSwitcher={SwitcherPopup}
				renderCreate={GermanCreate}
				renderHelp={HelpPopup}
				renderNotifications={NotificationsPopup}
				renderProductHome={DefaultProductHome}
				renderProfile={ProfilePopup}
				renderSearch={DefaultSearch}
				renderSettings={DefaultSettings}
			/>
		</Box>
		<Box lang="ja">
			<AtlassianNavigation
				label="japanese"
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
		<Box lang="es">
			<AtlassianNavigation
				label="spanish"
				primaryItems={jiraPrimaryItemsSpanish}
				renderAppSwitcher={SwitcherPopup}
				renderCreate={SpanishCreate}
				renderHelp={HelpPopup}
				renderNotifications={NotificationsPopup}
				renderProductHome={DefaultProductHome}
				renderProfile={ProfilePopup}
				renderSearch={DefaultSearch}
				renderSettings={DefaultSettings}
			/>
		</Box>
		<Box lang="tr">
			<AtlassianNavigation
				label="turkish"
				primaryItems={jiraPrimaryItemsTurkish}
				renderAppSwitcher={SwitcherPopup}
				renderCreate={TurkishCreate}
				renderHelp={HelpPopup}
				renderNotifications={NotificationsPopup}
				renderProductHome={DefaultProductHome}
				renderProfile={ProfilePopup}
				renderSearch={DefaultSearch}
				renderSettings={DefaultSettings}
			/>
		</Box>
	</Stack>
);

export default AuthenticatedExample;
