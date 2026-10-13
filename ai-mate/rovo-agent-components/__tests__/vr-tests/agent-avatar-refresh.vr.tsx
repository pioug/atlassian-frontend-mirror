import { snapshot } from '@af/visual-regression';

import AgentAvatarRefreshExample from '../../examples/05-agent-avatar-refresh.vr.ap';

snapshot(AgentAvatarRefreshExample, {
	featureFlags: { rovo_agent_avatar_refresh_teu26: true },
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
});
