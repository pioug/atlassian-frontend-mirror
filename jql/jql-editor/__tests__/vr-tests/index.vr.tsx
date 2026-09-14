import { snapshot } from '@af/visual-regression';

import TeamNodesExample from '../../examples/07-team-nodes.vr.ap';
import AiAgentUsersExample from '../../examples/08-ai-agent-users.vr.ap';
import MembersOfTeamNodesExample from '../../examples/09-membersof-team-nodes.vr.ap';
import ProjectNodesExample from '../../examples/10-project-nodes.vr.ap';
import GoalNodesExample from '../../examples/11-goal-nodes.vr.ap';
import AssetsObjectNodesExample from '../../examples/13-assets-object-nodes.vr.ap';

snapshot(AiAgentUsersExample, {
	featureFlags: {
		jira_ai_agent_avatar_with_apptype_for_jql: true,
	},
});

snapshot(MembersOfTeamNodesExample, {
	featureFlags: {
		'jira-membersof-team-support': true,
	},
});

snapshot(TeamNodesExample);

snapshot(ProjectNodesExample);

snapshot(GoalNodesExample, {
	featureFlags: {
		'anip-1095-goals-in-harmonised-filter': true,
	},
});

snapshot(AssetsObjectNodesExample, {
	featureFlags: {
		'orion-8274-cmdb-object-jql-values-resolver': true,
	},
});
