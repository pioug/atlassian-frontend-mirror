import { snapshot, type ErrorFilterOption } from '@af/visual-regression';

import { AgentProfileCardExample } from '../../examples/13-agent-profilecard.vr.ap';

const ignoredErrors: ErrorFilterOption[] = [
	{
		pattern: /It was passed a child from AgentProfileCreator/,
		ignoredBecause:
			'AgentProfileCreator is owned outside People and Teams; its React key warning does not affect the snapshot output.',
		jiraIssueId: 'NOISSUE-1',
	},
];

snapshot(AgentProfileCardExample, { ignoredErrors });

snapshot(AgentProfileCardExample, {
	description: 'Agent profile card with drop 1 fixes',
	featureFlags: {
		platform_editor_agent_mentions: true,
		platform_editor_agent_mentions_drop_one_fixes: true,
	},
	ignoredErrors,
});
