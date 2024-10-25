import { type JsonLd } from 'json-ld-types';

import { token } from '@atlaskit/tokens';

import { type AccentShortName, type LinkLozenge, type LinkState } from './types';
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
		backgroundColor: token('color.background.accent.blue.subtler', '#CCE0FF'),
		color: token('color.text.accent.blue', '#0055CC'),
	},
	gray: {
		backgroundColor: token('color.background.accent.gray.subtler', '#DCDFE4'),
		color: token('color.text.accent.gray', '#44546F'),
	},
	green: {
		backgroundColor: token('color.background.accent.green.subtler', '#BAF3DB'),
		color: token('color.text.accent.green', '#216E4E'),
	},
	lime: {
		backgroundColor: token('color.background.accent.lime.subtler', '#D3F1A7'),
		color: token('color.text.accent.lime', '#4C6B1F'),
	},
	magenta: {
		backgroundColor: token('color.background.accent.magenta.subtler', '#FDD0EC'),
		color: token('color.text.accent.magenta', '#943D73'),
	},
	orange: {
		backgroundColor: token('color.background.accent.orange.subtler', '#FEDEC8'),
		color: token('color.text.accent.orange', '#A54800'),
	},
	purple: {
		backgroundColor: token('color.background.accent.purple.subtler', '#DFD8FD'),
		color: token('color.text.accent.purple', '#5E4DB2'),
	},
	red: {
		backgroundColor: token('color.background.accent.red.subtler', '#FFD5D2'),
		color: token('color.text.accent.red', '#AE2E24'),
	},
	teal: {
		backgroundColor: token('color.background.accent.teal.subtler', '#C6EDFB'),
		color: token('color.text.accent.teal', '#206A83'),
	},
	yellow: {
		backgroundColor: token('color.background.accent.yellow.subtler', '#F8E6A0'),
		color: token('color.text.accent.yellow', '#7F5F01'),
	},
};

export const extractState = (
	jsonLd:
		| JsonLd.Data.SourceCodePullRequest
		| JsonLd.Data.Document
		| JsonLd.Data.Project
		| JsonLd.Data.Goal,
): LinkLozenge | undefined => {
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
