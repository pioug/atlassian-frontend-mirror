import { snapshot } from '@af/visual-regression';

import Stateful from '../../../examples/0-stateful';
import StatefulWithToggleEnabled from '../../../examples/10-stateful-with-toggle-enabled';
import Disabled from '../../../examples/2-disabled';

snapshot(Stateful);
snapshot(Disabled);
snapshot(StatefulWithToggleEnabled);
snapshot(StatefulWithToggleEnabled, {
	description: 'hovered - checked',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'toggle-button' },
		},
	],
});
snapshot(StatefulWithToggleEnabled, {
	description: 'focused - checked',
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'toggle-button' },
		},
	],
});
