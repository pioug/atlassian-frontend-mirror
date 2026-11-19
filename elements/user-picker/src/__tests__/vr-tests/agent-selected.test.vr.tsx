import { snapshot } from '@af/visual-regression';

import {
	AgentSelectedLegacyAfter,
	AgentSelectedLegacyBefore,
	AgentSelectedUpliftAfter,
	AgentSelectedUpliftBefore,
} from '../../../examples/41-multi-agent-selected.vr.ap';

const colorSchemes = [
	{ name: 'light mode', environment: { colorScheme: 'light' as const } },
	{ name: 'dark mode', environment: { colorScheme: 'dark' as const } },
];

snapshot(AgentSelectedLegacyBefore, { variants: colorSchemes });
snapshot(AgentSelectedLegacyAfter, { variants: colorSchemes });
snapshot(AgentSelectedUpliftBefore, { variants: colorSchemes });
snapshot(AgentSelectedUpliftAfter, { variants: colorSchemes });
