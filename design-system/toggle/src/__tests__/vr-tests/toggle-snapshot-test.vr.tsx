import { snapshot } from '@af/visual-regression';

import Stateful from '../../../examples/0-stateful';
import StatefulWithToggleEnabled from '../../../examples/10-stateful-with-toggle-enabled';
import Disabled from '../../../examples/2-disabled';

snapshot(Stateful);
snapshot(Disabled);
snapshot(StatefulWithToggleEnabled, {
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'toggle-button' },
		},
	],
});

snapshot(Stateful, {
	description: 'stateful - atomic',
	featureFlags: {
		'platform-toggle-atomic-styles': true,
	},
});

snapshot(StatefulWithToggleEnabled, {
	description: 'stateful with toggle enabled - atomic',
	featureFlags: {
		'platform-toggle-atomic-styles': true,
	},
});

snapshot(StatefulWithToggleEnabled, {
	description: 'stateful with toggle enabled - atomic - hovered checked',
	featureFlags: {
		'platform-toggle-atomic-styles': true,
	},
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'toggle-button' },
		},
	],
});

snapshot(StatefulWithToggleEnabled, {
	description: 'stateful with toggle enabled - atomic - focused',
	featureFlags: {
		'platform-toggle-atomic-styles': true,
	},
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'toggle-button' },
		},
	],
});

snapshot(Disabled, {
	description: 'disabled - atomic',
	featureFlags: {
		'platform-toggle-atomic-styles': true,
	},
});
