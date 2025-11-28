import { snapshot } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard';

snapshot(AgentProfileCardExample, {
	featureFlags: {
		profilecard_primitives_compiled: true,
		rovo_agent_empty_state_refresh: [true, false],
	},
});
