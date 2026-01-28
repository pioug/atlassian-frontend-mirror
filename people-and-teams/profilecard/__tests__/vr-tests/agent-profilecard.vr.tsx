import { snapshot } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard';

snapshot(AgentProfileCardExample, {
	featureFlags: {
		rovo_agent_empty_state_refresh: [true, false],
	},
});

snapshot(AgentProfileCardExample, {
	description: 'Agent profile card with AI disclaimer',
	featureFlags: {
		rovo_agent_empty_state_refresh: [true, false],
		rovo_display_ai_disclaimer_on_agent_profile_card: [true],
	},
});
