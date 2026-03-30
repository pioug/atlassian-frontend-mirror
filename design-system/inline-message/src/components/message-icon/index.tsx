/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

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
		color: token('color.icon.brand'),
	},
	confirmation: {
		color: token('color.icon.success'),
	},
	info: {
		color: token('color.icon.discovery'),
	},
	warning: {
		color: token('color.icon.warning'),
	},
	error: {
		color: token('color.icon.danger'),
	},
});

const iconWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	flex: '0 0 auto',
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
			css={[iconWrapperStyles, iconColor[appearance], isOpen && iconColorStyles]}
		>
			<Icon
				testId="inline-message-icon"
				label={label || defaultLabel}
				color="currentColor"
				spacing={spacing}
			/>
		</span>
	);
};

export default SelectedIcon;
