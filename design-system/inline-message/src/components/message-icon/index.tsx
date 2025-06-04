/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { B400, G300, P300, R400, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { typesMapping } from '../../constants';
import type { IconAppearance, IconSpacing } from '../../types';

interface MessageIconProps {
	appearance: IconAppearance;
	isOpen: boolean;
	label?: string;
	spacing: IconSpacing;
}

const iconColor = cssMap({
	connectivity: {
		'--icon-color': token('color.icon.brand', B400),
	},
	confirmation: {
		'--icon-color': token('color.icon.success', G300),
	},
	info: {
		'--icon-color': token('color.icon.discovery', P300),
	},
	warning: {
		'--icon-color': token('color.icon.warning', Y300),
	},
	error: {
		'--icon-color': token('color.icon.danger', R400),
	},
});

const iconWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	flex: '0 0 auto',
	color: 'var(--icon-color)',
});

const iconColorStyles = css({
	color: 'var(--icon-accent-color)',
});

/**
 * __Selected icon__
 *
 * The selected icon is used as the primary interactive element for the dialog.
 * Can be used with or without supporting text.
 */
const SelectedIcon: FC<MessageIconProps> = ({ appearance, isOpen, label, spacing }) => {
	const {
		[appearance]: { icon: Icon, defaultLabel },
	} = typesMapping;

	return (
		<span
			data-ds--inline-message--icon
			css={[iconWrapperStyles, isOpen && iconColorStyles, iconColor[appearance]]}
		>
			<Icon
				testId="inline-message-icon"
				label={label || defaultLabel}
				color="currentColor"
				LEGACY_size="medium"
				spacing={spacing}
			/>
		</span>
	);
};

export default SelectedIcon;
