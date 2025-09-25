import { snapshot } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard';

snapshot(AgentProfileCardExample, {
	hooks: {
		flags: {
			profilecard_primitives_compiled: true,
		},
	},
});
