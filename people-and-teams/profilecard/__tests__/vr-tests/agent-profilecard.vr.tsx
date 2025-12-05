import { snapshot } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard';

snapshot(AgentProfileCardExample, {
	featureFlags: {
		rovo_agent_empty_state_refresh: [true, false],
	},
});
