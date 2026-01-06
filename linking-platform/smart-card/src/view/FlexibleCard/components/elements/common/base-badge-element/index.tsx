/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { type MessageDescriptor } from 'react-intl-next';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { IconType } from '../../../../../../constants';
import { messages } from '../../../../../../messages';
import { useFlexibleUiOptionContext } from '../../../../../../state/flexible-ui-context';
import AtlaskitIcon from '../../../common/atlaskit-icon';
import ImageIcon from '../../../common/image-icon';
import { withOverrideCss } from '../../../common/with-override-css';
import { getFormattedMessage } from '../../../utils';
import type { ElementProps } from '../../index';

const styles = cssMap({
	container: {
		display: 'inline-flex',
		alignItems: 'center',
		minWidth: 'fit-content',
		gap: token('space.050'),
	},
	icon: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'&, span, svg, img': {
			display: 'inline-flex',
			height: '16px',
			paddingTop: token('space.0'),
			paddingRight: token('space.0'),
			paddingBottom: token('space.0'),
			paddingLeft: token('space.0'),
			width: '16px',
			verticalAlign: 'middle',
		},
	},
	text: {
		font: token('font.body.small'),
	},
});

const colorMap = cssMap({
	subtle: { color: token('color.text.subtlest') },
	default: { color: token('color.text.subtle') },
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

const renderImageIcon = (
	url?: string,
	testId?: string,
	hideLoadingSkeleton?: boolean,
): React.ReactNode | undefined => {
	if (url) {
		return <ImageIcon testId={testId} url={url} hideLoadingSkeleton={hideLoadingSkeleton} />;
	}
};

export type BaseBadgeElementProps = ElementProps & {
	/**
	 * Badge appearances
	 */
	appearance?: 'default' | 'subtle';
	/**
	 * Color of the text and badge
	 */
	color?: string;
	/**
	 * Determines whether the badge icon should be hidden. When set to true,
	 * the badge will be displayed without the icon, showing only the label text.
	 */
	hideIcon?: boolean;
	/**
	 * When set to true, the loading skeleton for the image icon will be hidden,
	 * the image will be rendered directly.
	 */
	hideIconLoadingSkeleton?: boolean;
	/**
	 * The Atlaskit Icon to display next to the label. If this is not supplied,
	 * then the badge icon will fallback to the URL provided.
	 */
	icon?: IconType;
	/**
	 * The text to display for the badge.
	 */
	label?: string;
	/**
	 * The icon from this URL will be used for the badge if no Atlaskit Icon is provided.
	 */
	url?: string;
};

/**
 * A base element that displays some text with an associated icon.
 * @internal
 * @param {BaseBadgeElementProps} BaseBadgeElementProps - The props necessary for the Badge.
 * @see CommentCount
 * @see ViewCount
 * @see ReactCount
 * @see VoteCount
 * @see SubscriberCount
 * @see Priority
 * @see ProgrammingLanguage
 * @see Provider
 */
const BaseBadgeRefreshNew = forwardRef(
	(
		{
			appearance = 'default',
			hideIcon = false,
			icon,
			label,
			name,
			testId = 'smart-element-badge',
			url,
			color,
		}: BaseBadgeElementProps,
		ref: React.Ref<HTMLElement>,
	) => {
		const ui = useFlexibleUiOptionContext();

		const formattedMessageOrLabel = getFormattedMessageFromIcon(icon) || label;
		const badgeIcon =
			renderAtlaskitIcon(icon, testId) || renderImageIcon(url, testId, ui?.hideLoadingSkeleton);
		if (!formattedMessageOrLabel || !badgeIcon) {
			return null;
		}

		return (
			<span
				data-smart-element={name}
				data-smart-element-badge
				data-testid={testId}
				css={[styles.container, colorMap[appearance]]}
				ref={ref}
				style={{
					color,
				}}
			>
				{!hideIcon && (
					<Box as="span" xcss={styles.icon}>
						{badgeIcon}
					</Box>
				)}
				<Box as="span" testId={`${testId}-label`} xcss={styles.text}>
					{formattedMessageOrLabel}
				</Box>
			</span>
		);
	},
);

export default withOverrideCss(BaseBadgeRefreshNew);

export const toBadgeProps = (label?: string): Partial<BaseBadgeElementProps> | undefined => {
	// Don't render the element if its 0
	return label !== '0' && label ? { label } : undefined;
};
