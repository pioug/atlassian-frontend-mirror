import { snapshot } from '@af/visual-regression';

import TeamNodesExample from '../../examples/07-team-nodes';
import AiAgentUsersExample from '../../examples/08-ai-agent-users';
import MembersOfTeamNodesExample from '../../examples/09-membersof-team-nodes';

snapshot(AiAgentUsersExample, {
	featureFlags: {
		jira_ai_agent_avatar_with_apptype_for_jql: true,
	},
});

snapshot(MembersOfTeamNodesExample, {
	featureFlags: {
		jira_update_jql_teams: true,
		jira_update_jql_membersof_teams: true,
	},
});

snapshot(TeamNodesExample, {
	featureFlags: {
		jira_update_jql_teams: true,
	},
});