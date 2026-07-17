import { snapshot } from '@af/visual-regression';

import AgentProfileExample from '../../examples/01-agent-profile-info';

import { snapshotOptions } from './utils';

snapshot(AgentProfileExample, snapshotOptions);
snapshot(AgentProfileExample, {
	...snapshotOptions,
	description: 'agent profile example with creator icon removed',
	featureFlags: {
		...snapshotOptions.featureFlags,
		platform_editor_agent_mentions: true,
		platform_editor_agent_mentions_drop_one_fixes: true,
	},
});
