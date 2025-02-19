import { Device, snapshot } from '@af/visual-regression';

import Variations from '../../../examples/01-variations';
import Widths from '../../../examples/01-widths';
import ElementsBeforeAndAfter from '../../../examples/05-elements-before-and-after';
import Customisation from '../../../examples/08-customisation';

// @todo: remove in `platform_design_system_team_safari_input_fix` cleanup
snapshot(Variations, {
	featureFlags: {
		platform_design_system_team_safari_input_fix: true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(Variations, {
	featureFlags: {
		platform_design_system_team_safari_input_fix: true,
	},
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(ElementsBeforeAndAfter, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(Widths, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(Customisation, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
