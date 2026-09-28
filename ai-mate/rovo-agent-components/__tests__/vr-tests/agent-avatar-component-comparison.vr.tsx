import { snapshot } from '@af/visual-regression';

import AgentAvatarComponentComparisonExample from '../../examples/08-agent-avatar-component-comparison.vr.ap';

snapshot(AgentAvatarComponentComparisonExample, {
	featureFlags: { 'platform-dst-avatar-updated-geometry': true },
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
});
