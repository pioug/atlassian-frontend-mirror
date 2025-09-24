import React from 'react';

import { useIntl } from 'react-intl-next';

import VerifiedIcon from '@atlaskit/icon/core/status-verified';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from './messages';

interface VerifiedTeamIconProps {
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

	/**
	 * The size of the icon.
	 */
	size?: 'small' | 'medium';
}

export const VerifiedTeamIcon = ({
	label = 'Verified Team',
	showTooltip,
	customTooltipContent,
	size = 'medium',
}: VerifiedTeamIconProps) => {
	const { formatMessage } = useIntl();
	const tooltipContent = showTooltip
		? customTooltipContent || formatMessage(messages.verifiedIconDefaultTooltip)
		: undefined;

	return tooltipContent ? (
		<Tooltip content={tooltipContent}>
			<span tabIndex={0} role="button" data-testid="verified-team-icon">
				{' '}
				<VerifiedIcon
					color={token('color.icon.accent.blue')}
					size={size}
					label={tooltipContent}
					spacing="spacious"
				/>
			</span>
		</Tooltip>
	) : (
		<VerifiedIcon
			color={token('color.icon.accent.blue')}
			size={size}
			spacing="spacious"
			label={label}
		/>
	);
};
