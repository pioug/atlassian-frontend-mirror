import { snapshot } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard';

snapshot(AgentProfileCardExample);

snapshot(AgentProfileCardExample, {
	description: 'Agent profile card with AI disclaimer',
	featureFlags: {
		['rovo_display_ai_disclaimer_on_agent_profile_card']: [true],
	},
});
