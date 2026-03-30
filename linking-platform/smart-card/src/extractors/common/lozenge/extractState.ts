import { token } from '@atlaskit/tokens';

import {
	type AccentShortName,
	type LinkLozenge,
	type LinkState,
	type LinkStateType,
} from './types';
import { OMIT_STATES, VALID_STATES } from './utils';

// Maps accent color short names to their corresponding background and text colors
const lozengeAccentStyles: Record<
	AccentShortName,
	{
		backgroundColor: string;
		color: string;
	}
> = {
	blue: {
		backgroundColor: token('color.background.accent.blue.subtler'),
		color: token('color.text.accent.blue'),
	},
	gray: {
		backgroundColor: token('color.background.accent.gray.subtler'),
		color: token('color.text.accent.gray'),
	},
	green: {
		backgroundColor: token('color.background.accent.green.subtler'),
		color: token('color.text.accent.green'),
	},
	lime: {
		backgroundColor: token('color.background.accent.lime.subtler'),
		color: token('color.text.accent.lime'),
	},
	magenta: {
		backgroundColor: token('color.background.accent.magenta.subtler'),
		color: token('color.text.accent.magenta'),
	},
	orange: {
		backgroundColor: token('color.background.accent.orange.subtler'),
		color: token('color.text.accent.orange'),
	},
	purple: {
		backgroundColor: token('color.background.accent.purple.subtler'),
		color: token('color.text.accent.purple'),
	},
	red: {
		backgroundColor: token('color.background.accent.red.subtler'),
		color: token('color.text.accent.red'),
	},
	teal: {
		backgroundColor: token('color.background.accent.teal.subtler'),
		color: token('color.text.accent.teal'),
	},
	yellow: {
		backgroundColor: token('color.background.accent.yellow.subtler'),
		color: token('color.text.accent.yellow'),
	},
};

export const extractState = (jsonLd: LinkStateType): LinkLozenge | undefined => {
	const state = jsonLd['atlassian:state'];
	if (state) {
		if (typeof state === 'string') {
			const linkState = state.toLowerCase() as LinkState;
			if (!OMIT_STATES.includes(linkState)) {
				return {
					text: linkState,
					appearance: VALID_STATES[linkState] || 'default',
				};
			}
		} else if (state['@type'] === 'Link' || state['@type'] === 'Object') {
			if (state.name) {
				const accent = (state as any).accent as AccentShortName;
				return {
					text: state.name,
					appearance: (state as any).appearance || 'default',
					style: accent ? lozengeAccentStyles[accent] : undefined,
				};
			}
		}
	}
};
