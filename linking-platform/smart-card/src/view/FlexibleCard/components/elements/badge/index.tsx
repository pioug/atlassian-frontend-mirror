/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import { type MessageDescriptor } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { IconType } from '../../../../../constants';
import { messages } from '../../../../../messages';
import AtlaskitIcon from '../../common/atlaskit-icon';
import ImageIcon from '../../common/image-icon';
import { getFormattedMessage } from '../../utils';

import BadgeOld from './BadgeOld';
import { type BadgeProps } from './types';

const badgeStyles = css({
	alignItems: 'center',
	display: 'inline-flex',
	minWidth: 'fit-content',
});

const iconStyles = css({
	color: token('color.icon.subtle', '#626F86'),
	lineHeight: 0,
	verticalAlign: 'middle',
	flex: '0 0 auto',
	height: '1rem',
	minHeight: '1rem',
	maxHeight: '1rem',
	width: '1rem',
	minWidth: '1rem',
	maxWidth: '1rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'span, svg, img': {
		height: '1rem',
		minHeight: '1rem',
		maxHeight: '1rem',
		width: '1rem',
		minWidth: '1rem',
		maxWidth: '1rem',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	svg: {
		padding: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'img, span, svg': {
		lineHeight: 0,
		verticalAlign: 'middle',
	},
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const labelStylesOld = css({
	color: token('color.text.subtlest', '#626F86'),
	font: token('font.body.UNSAFE_small'),
	paddingLeft: token('space.025', '0.125rem'),
	verticalAlign: 'middle',
});

const labelStyles = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
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
const BadgeNew = ({
	hideIcon = false,
	icon,
	label,
	name,
	className,
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
			css={[badgeStyles]}
			data-fit-to-content
			data-smart-element={name}
			data-smart-element-badge
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{!hideIcon && <span css={iconStyles}>{badgeIcon}</span>}
			<span
				css={[fg('platform-linking-visual-refresh-v1') ? labelStyles : labelStylesOld]}
				data-testid={`${testId}-label`}
			>
				{formattedMessageOrLabel}
			</span>
		</span>
	);
};

const Badge = (props: BadgeProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <BadgeNew {...props} />;
	} else {
		return <BadgeOld {...props} />;
	}
};

export default Badge;
