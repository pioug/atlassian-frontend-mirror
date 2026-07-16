import { snapshot } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard';

snapshot(AgentProfileCardExample);

snapshot(AgentProfileCardExample, {
	description: 'Agent profile card with AI disclaimer',
	featureFlags: {
		['rovo_display_ai_disclaimer_on_agent_profile_card']: [true],
	},
});

snapshot(AgentProfileCardExample, {
	description: 'Agent profile card with drop 1 fixes',
	featureFlags: {
		rovo_display_ai_disclaimer_on_agent_profile_card: true,
		platform_editor_agent_mentions: true,
		platform_editor_agent_mentions_drop_one_fixes: true,
	},
});
