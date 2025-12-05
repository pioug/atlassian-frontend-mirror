import { snapshot } from '@af/visual-regression';

import AiAgentUsersExample from '../../examples/08-ai-agent-users';

snapshot(AiAgentUsersExample, {
	featureFlags: {
		jira_ai_agent_avatar_with_apptype_for_jql: true,
	},
});
