import { token } from '@atlaskit/tokens';

import { MentionType } from '../../types';

type MentionStyleEntry = {
	background: string;
	borderColor: string;
	hoveredBackground: string;
	pressedBackground: string;
	text: string;
};

export const mentionStyle: Record<MentionType, MentionStyleEntry> = {
	[MentionType.SELF]: {
		background: token('color.background.brand.bold'),
		borderColor: 'transparent',
		text: token('color.text.inverse'),
		hoveredBackground: token('color.background.brand.bold.hovered'),
		pressedBackground: token('color.background.brand.bold.pressed'),
	},
	[MentionType.RESTRICTED]: {
		background: 'transparent',
		borderColor: token('color.border.bold'),
		text: token('color.text'),
		hoveredBackground: 'transparent',
		pressedBackground: 'transparent',
	},
	[MentionType.DEFAULT]: {
		background: token('color.background.neutral'),
		borderColor: 'transparent',
		text: token('color.text.subtle'),
		hoveredBackground: token('color.background.neutral.hovered'),
		pressedBackground: token('color.background.neutral.pressed'),
	},
	[MentionType.DISABLED]: {
		background: token('color.background.disabled'),
		borderColor: 'transparent',
		text: token('color.text.disabled'),
		// Disabled chips do not change on hover / press.
		hoveredBackground: token('color.background.disabled'),
		pressedBackground: token('color.background.disabled'),
	},
};
