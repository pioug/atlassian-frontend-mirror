/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type MessageDescriptor } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { IconType } from '../../../../../constants';
import { messages } from '../../../../../messages';
import AtlaskitIcon from '../../common/atlaskit-icon';
import ImageIcon from '../../common/image-icon';
import { getFormattedMessage, getIconSizeStyles } from '../../utils';

import { type BadgeProps } from './types';

const badgeStyles = css({
	alignItems: 'center',
	display: 'inline-flex',
	minWidth: 'fit-content',
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const iconStyles = css`
	color: ${token('color.icon.subtle', '#626F86')};
	line-height: 0;
	vertical-align: middle;
	${getIconSizeStyles('1rem')}
	img,
  span,
  svg {
		line-height: 0;
		vertical-align: middle;
	}
`;

const labelStyles = css({
	color: token('color.text.subtlest', '#626F86'),
	font: token('font.body.UNSAFE_small'),
	paddingLeft: token('space.025', '0.125rem'),
	verticalAlign: 'middle',
});

const messageMapper: {
	[key in Partial<IconType>]?: MessageDescriptor | undefined;
} = {
	[IconType.PriorityBlocker]: messages.priority_blocker,
	[IconType.PriorityCritical]: messages.priority_critical,
	[IconType.PriorityHigh]: messages.priority_high,
	[IconType.PriorityHighest]: messages.priority_highest,
	[IconType.PriorityLow]: messages.priority_low,
	[IconType.PriorityLowest]: messages.priority_lowest,
	[IconType.PriorityMajor]: messages.priority_major,
	[IconType.PriorityMedium]: messages.priority_medium,
	[IconType.PriorityMinor]: messages.priority_minor,
	[IconType.PriorityTrivial]: messages.priority_trivial,
	[IconType.PriorityUndefined]: messages.priority_undefined,
};

const getFormattedMessageFromIcon = (icon?: IconType): React.ReactNode | string | undefined => {
	if (icon) {
		const descriptor = messageMapper[icon];
		if (descriptor) {
			return getFormattedMessage({
				descriptor,
			});
		}
	}
};

const renderAtlaskitIcon = (icon?: IconType, testId?: string): React.ReactNode | undefined => {
	if (icon) {
		return <AtlaskitIcon icon={icon} label={icon as string} testId={`${testId}-icon`} />;
	}
};

const renderImageIcon = (url?: string, testId?: string): React.ReactNode | undefined => {
	if (url) {
		return <ImageIcon testId={testId} url={url} />;
	}
};

/**
 * A base element that displays some text with an associated icon.
 * @internal
 * @param {BadgeProps} BadgeProps - The props necessary for the Badge.
 * @see CommentCount
 * @see ViewCount
 * @see ReactCount
 * @see VoteCount
 * @see SubscriberCount
 * @see Priority
 * @see ProgrammingLanguage
 * @see Provider
 */
const BadgeOld = ({
	hideIcon = false,
	icon,
	label,
	name,
	overrideCss,
	testId = 'smart-element-badge',
	url,
}: BadgeProps) => {
	const formattedMessageOrLabel = getFormattedMessageFromIcon(icon) || label;
	const badgeIcon = renderAtlaskitIcon(icon, testId) || renderImageIcon(url, testId);
	if (!formattedMessageOrLabel || !badgeIcon) {
		return null;
	}

	return (
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[badgeStyles, overrideCss]}
			data-fit-to-content
			data-smart-element={name}
			data-smart-element-badge
			data-testid={testId}
		>
			{!hideIcon && <span css={iconStyles}>{badgeIcon}</span>}
			<span css={labelStyles} data-testid={`${testId}-label`}>
				{formattedMessageOrLabel}
			</span>
		</span>
	);
};

export default BadgeOld;
