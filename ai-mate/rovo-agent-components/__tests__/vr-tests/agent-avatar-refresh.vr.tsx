import { snapshot } from '@af/visual-regression';

import AgentAvatarRefreshExample from '../../examples/05-agent-avatar-refresh.vr.ap';

snapshot(AgentAvatarRefreshExample, {
	featureFlags: { 'platform-dst-avatar-updated-geometry': true },
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
});
