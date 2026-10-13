import { snapshot } from '@af/visual-regression';

import AgentAvatarComponentComparisonExample from '../../examples/08-agent-avatar-component-comparison.vr.ap';

snapshot(AgentAvatarComponentComparisonExample, {
	featureFlags: { rovo_agent_avatar_refresh_teu26: true },
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
});
