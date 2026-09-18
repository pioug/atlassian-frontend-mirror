import { token } from '@atlaskit/tokens';

import type { AgentPresenceColor } from './agent-presence-color-types';
import { getAgentColor, type AgentColor, type GetAgentColorProps } from './get-agent-color';

const studioColors: Record<AgentColor, AgentPresenceColor> = {
	blue: {
		accentText: token('color.text.accent.blue'),
		background: token('color.background.accent.blue.subtlest'),
		bold: token('color.background.accent.blue.bolder'),
		boldText: token('color.text.inverse'),
		border: token('color.border.accent.blue'),
		text: token('color.text'),
	},
	lime: {
		accentText: token('color.text.accent.lime'),
		background: token('color.background.accent.lime.subtlest'),
		bold: token('color.background.accent.lime.bolder'),
		boldText: token('color.text.inverse'),
		border: token('color.border.accent.lime'),
		text: token('color.text'),
	},
	purple: {
		accentText: token('color.text.accent.purple'),
		background: token('color.background.accent.purple.subtlest'),
		bold: token('color.background.accent.purple.bolder'),
		boldText: token('color.text.inverse'),
		border: token('color.border.accent.purple'),
		text: token('color.text'),
	},
	yellow: {
		accentText: token('color.text.accent.yellow'),
		background: token('color.background.accent.yellow.subtlest'),
		bold: token('color.background.accent.yellow.bolder'),
		boldText: token('color.text.inverse'),
		border: token('color.border.accent.yellow'),
		text: token('color.text'),
	},
};

export const getAgentPresenceColor = (
	identity: GetAgentColorProps,
): AgentPresenceColor & { scheme: AgentColor } => {
	const scheme = getAgentColor(identity);
	return { ...studioColors[scheme], scheme };
};
