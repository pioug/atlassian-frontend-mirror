import { B300, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { Status } from '../types';

export const getMarkerColor = (status: Status) => {
	switch (status) {
		case 'unvisited':
			return token('color.icon.subtle', N70);
		case 'current':
		case 'visited':
		case 'disabled':
			return token('color.icon.brand', B300);
		default:
			return;
	}
};

export const getTextColor = (status: Status) => {
	switch (status) {
		case 'unvisited':
			return token('color.text.subtlest');
		case 'current':
			return token('color.text.brand');
		case 'visited':
			return token('color.text');
		case 'disabled':
			return token('color.text.disabled');
		default:
			return;
	}
};

export const getFontWeight = (status: Status) => {
	switch (status) {
		case 'unvisited':
			return token('font.weight.regular');
		case 'current':
		case 'visited':
		case 'disabled':
			return token('font.weight.semibold');
		default:
			return undefined;
	}
};
