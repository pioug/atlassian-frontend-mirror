import React from 'react';

import { useIntl } from 'react-intl-next';

import { type Size } from '@atlaskit/icon';
import { VerifiedIcon } from '@atlaskit/legacy-custom-icons';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from './messages';

interface VerifiedTeamIconProps {
	/**
	 * The size of the icon. It can be 'small', 'medium', 'large', etc.
	 */
	size?: Size;

	/**
	 * The accessible label for the icon.
	 */
	label?: string;

	/**
	 * Whether to show a default tooltip when hovering over the icon.
	 */
	showTooltip?: boolean;

	/**
	 * Custom content for the tooltip. If not provided, it will fall back to check the showTooltip prop.
	 * If showTooltip is true, the default message will be used. If both are not provided, no tooltip will be shown.
	 */
	customTooltipContent?: string;
}

export const VerifiedTeamIcon = ({
	size,
	label = 'Verified Team',
	showTooltip,
	customTooltipContent,
}: VerifiedTeamIconProps) => {
	const { formatMessage } = useIntl();
	const tooltipContent = showTooltip
		? customTooltipContent || formatMessage(messages.verifiedIconDefaultTooltip)
		: undefined;

	return tooltipContent ? (
		<Tooltip content={tooltipContent}>
			<span tabIndex={0} role="button" aria-hidden="true" data-testid="verified-team-icon">
				{' '}
				<VerifiedIcon
					primaryColor={token('color.icon.accent.blue')}
					size={size}
					label={tooltipContent}
				/>
			</span>
		</Tooltip>
	) : (
		<VerifiedIcon primaryColor={token('color.icon.accent.blue')} size={size} label={label} />
	);
};
