/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type AriaAttributes } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type AnalyticsEvent, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Pressable, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';

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
}

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
	lineHeight: '16px',
});

const enabledTriggerStyles = xcss({
	borderColor: 'color.border',
	backgroundColor: 'color.background.neutral.subtle',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
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

/**
 * Render an emoji button to open the reactions select picker
 */
export const Trigger = React.forwardRef(
	(props: TriggerProps, ref: React.Ref<HTMLButtonElement>) => {
		const { onClick, miniMode, tooltipContent, disabled = false, ariaAttributes = {} } = props;

		const handleMouseDown = (
			e: React.MouseEvent<HTMLElement>,
			analyticsEvent: UIAnalyticsEvent,
		) => {
			if (onClick && !disabled) {
				onClick(e, analyticsEvent);
			}
		};

		return (
			<Tooltip testId={RENDER_TOOLTIP_TRIGGER_TESTID} content={tooltipContent}>
				<Pressable
					testId={RENDER_TRIGGER_BUTTON_TESTID}
					xcss={[
						triggerStyles,
						disabled ? disabledTriggerStyles : enabledTriggerStyles,
						miniMode && miniModeStyles,
					]}
					onClick={handleMouseDown}
					isDisabled={disabled}
					ref={ref}
					{...ariaAttributes}
				>
					<EmojiAddIcon
						primaryColor={disabled ? token('color.icon.disabled') : token('color.icon')}
						size="small"
						label="Add reaction"
					/>
				</Pressable>
			</Tooltip>
		);
	},
);
