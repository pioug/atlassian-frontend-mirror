import type { MessageDescriptor } from 'react-intl';

import { token } from '@atlaskit/tokens';

import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';

export const mapPaletteColor = (
	label: string,
	color: string,
): {
	border: 'var(--ds-border)';
	label: string;
	message: MessageDescriptor | undefined;
	value: string;
} => {
	const key = label.toLowerCase().replace(' ', '-');
	const message = getColorMessage(paletteMessages, key);
	return {
		value: color,
		label,
		border: token('color.border'),
		message,
	};
};
