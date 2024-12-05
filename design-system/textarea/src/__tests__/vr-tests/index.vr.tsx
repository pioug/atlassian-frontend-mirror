import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic';

// @todo: remove in `platform_design_system_team_safari_input_fix` cleanup
snapshot(Basic, {
	featureFlags: {
		platform_design_system_team_safari_input_fix: true,
	},
});

snapshot(Basic, {
	featureFlags: {
		platform_design_system_team_safari_input_fix: true,
	},
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
