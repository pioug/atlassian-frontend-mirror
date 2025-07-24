import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../examples/00-basic-example';
import AppearanceVariations from '../../../examples/01-appearance-variations';
import Actions from '../../../examples/06-actions';
import ExplicitFontStyles from '../../../examples/07-explicit-font-styles';
import Testing from '../../../examples/99-testing';

snapshot(Basic, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
	],
});

snapshot(AppearanceVariations, {
	featureFlags: {
		platform_dst_section_message_discovery_icon: [true, false],
		'platform-visual-refresh-icons': [true, false],
	},
});

snapshot(Actions, {
	featureFlags: {
		platform_section_message_action_migration: [true, false],
		platform_dst_section_message_actions_as_link: [true, false],
	},
});

snapshot(Testing, {
	description: 'word wrapping behaviour',
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - default state',
	featureFlags: {
		platform_ads_explicit_font_styles: [true, false],
	},
});
