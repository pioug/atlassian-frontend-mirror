/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type AriaAttributes } from 'react';
import { defineMessages, useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type AnalyticsEvent, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Pressable, Box, xcss, type XCSS } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';
import EmojiAddIcon from '@atlaskit/icon/core/migration/emoji-add';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Test id for the tooltip
 */
export const RENDER_TOOLTIP_TRIGGER_TESTID = 'render-tooltip-trigger';
export const RENDER_TRIGGER_BUTTON_TESTID = 'render-trigger-button';

export interface TriggerProps {
	/**
	 * Optional Event handler when the button to open the picker is clicked
	 * @param e Mouse Dom event
	 * @param analyticsEvent atlaskit analytics event payload of the button
	 */
	onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: AnalyticsEvent) => void;
	/**
	 * apply "miniMode" className to the button
	 */
	miniMode?: boolean;
	/**
	 * Enable/Disable the button to be clickable (defaults to false)
	 */
	disabled?: boolean;
	/**
	 * Tooltip content for trigger button
	 */
	tooltipContent: React.ReactNode;
	/**
	 * Aria accessibility attributes that will be added to the button
	 */
	ariaAttributes?: AriaAttributes;
	/**
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;
	/**
	 * Optional prop for displaying text to add a reaction
	 */
	showAddReactionText?: boolean;
	/**
	 * Optional prop for applying subtle styling to reaction picker
	 */
	subtleReactionsSummaryAndPicker?: boolean;
	/**
	 * Optional prop for controlling if the picker hover border will be rounded
	 */
	showRoundTrigger?: boolean;
	/**
	 * Option prop for controlling the reaction picker selection style
	 */
	selectionStyle?: XCSS;
	/**
	 * Optional prop for controlling if Trigger displays the ... show more emoji UI
	 */
	showMoreEmojiTriggerUI?: boolean;
}

const i18n = defineMessages({
	addReaction: {
		id: 'reaction-picker-trigger.add.reaction.message',
		description: 'Message displayed when there are no page reactions existing on the page.',
		defaultMessage: 'Add a reaction',
	},
	showMore: {
		id: 'reaction-picker-trigger.more.emojis.message',
		description: 'Message displayed on button to show more emojis.',
		defaultMessage: 'More emojis',
	},
});

const triggerStyles = xcss({
	minWidth: '32px',
	height: '24px',
	padding: 'space.0',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderRadius: 'border.radius.circle',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '16px',
});

const subtleTriggerStyles = xcss({
	minWidth: '24px',
	border: 'none',
});

const expandedTriggerStyles = xcss({
	minWidth: '110px',
});

const triggerStylesRefresh = xcss({
	borderRadius: 'border.radius',
});

const roundTriggerStyles = xcss({
	borderRadius: '50%',
	height: '2rem',
	width: '2rem',
});

const transparentEnabledTriggerStyles = xcss({
	borderColor: 'color.border',
	backgroundColor: 'color.background.neutral.subtle',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

const opaqueEnabledTriggerStyles = xcss({
	borderColor: 'color.border',
	backgroundColor: 'elevation.surface',
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
	},
	':active': {
		backgroundColor: 'elevation.surface.pressed',
	},
});

const disabledTriggerStyles = xcss({
	borderColor: 'color.border.disabled',
	backgroundColor: 'color.background.disabled',
});

const miniModeStyles = xcss({
	minWidth: '24px',
	padding: 'space.050',
	border: 'none',
	borderRadius: 'border.radius',
});

const addReactionMessageStyles = xcss({
	font: token('font.body.UNSAFE_small'),
	color: 'color.text.subtle',
	marginLeft: 'space.050',
});

/**
 * Render an emoji button to open the reactions select picker
 */
export const Trigger = React.forwardRef(
	(props: TriggerProps, ref: React.Ref<HTMLButtonElement>) => {
		const { formatMessage } = useIntl();

		const {
			onClick,
			miniMode,
			tooltipContent,
			disabled = false,
			ariaAttributes = {},
			showOpaqueBackground = false,
			showAddReactionText = false,
			subtleReactionsSummaryAndPicker = false,
			showRoundTrigger = false,
			selectionStyle,
			showMoreEmojiTriggerUI,
		} = props;

		const handleMouseDown = (
			e: React.MouseEvent<HTMLElement>,
			analyticsEvent: UIAnalyticsEvent,
		) => {
			if (onClick && !disabled) {
				onClick(e, analyticsEvent);
			}
		};

		return (
			<Tooltip
				testId={RENDER_TOOLTIP_TRIGGER_TESTID}
				content={showMoreEmojiTriggerUI ? formatMessage(i18n.showMore) : tooltipContent}
			>
				<Pressable
					testId={RENDER_TRIGGER_BUTTON_TESTID}
					xcss={[
						triggerStyles,
						subtleReactionsSummaryAndPicker && subtleTriggerStyles,
						showAddReactionText && expandedTriggerStyles,
						disabled
							? disabledTriggerStyles
							: showOpaqueBackground
								? opaqueEnabledTriggerStyles
								: transparentEnabledTriggerStyles,
						miniMode && miniModeStyles,
						fg('platform-component-visual-refresh') && triggerStylesRefresh,
						showRoundTrigger && roundTriggerStyles,
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						selectionStyle,
					]}
					onClick={handleMouseDown}
					isDisabled={disabled}
					ref={ref}
					{...ariaAttributes}
				>
					{showMoreEmojiTriggerUI ? (
						<ShowMoreHorizontalIcon
							testId="show-more-emojis-icon"
							label={formatMessage(i18n.showMore)}
							color={disabled ? token('color.icon.disabled') : token('color.icon')}
						/>
					) : (
						// TODO: https://product-fabric.atlassian.net/browse/DSP-21007
						<EmojiAddIcon
							testId="emoji-add-icon"
							color={disabled ? token('color.icon.disabled') : token('color.icon')}
							LEGACY_size="small"
							label="Add reaction"
						/>
					)}
					{showAddReactionText && (
						<Box xcss={addReactionMessageStyles}>{formatMessage(i18n.addReaction)}</Box>
					)}
				</Pressable>
			</Tooltip>
		);
	},
);
