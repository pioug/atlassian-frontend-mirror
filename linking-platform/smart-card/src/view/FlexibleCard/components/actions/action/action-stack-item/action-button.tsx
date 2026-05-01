/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

import { css as compiledCss } from '@compiled/react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Pressable } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';
import type { TriggerProps } from '@atlaskit/tooltip';

import { ActionName } from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { getPrimitivesInlineSpaceBySize } from '../../../utils';
import ActionIcon from '../action-icon';

import type { ActionStackItemProps } from './types';

const styles = cssMap({
	button: {
		backgroundColor: token('color.background.neutral.subtle'),
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		width: '100%',
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
		'&:focus-visible': {
			outlineOffset: token('space.negative.025'),
		},
	},
	/**
	 * Pill button variant used when the rovogrowth-640-inline-action-nudge-exp
	 * experiment is enabled. 
	 */
	pillButton: {
		position: 'relative',
		backgroundColor: token('color.background.neutral.subtle'),
		paddingRight: token('space.100'),
		paddingLeft: token('space.025'),
		width: 'fit-content',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.medium'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			borderColor: token('color.border.focused'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
		'&:focus-visible': {
			outlineOffset: token('space.negative.025'),
		},
	},
	content: {
		color: token('color.text'),
		font: token('font.body.small'),
	},
	pillContent: {
		color: token('color.text'),
		font: token('font.body.small'),
		whiteSpace: 'nowrap',
	},
	spinner: {
		width: '24px',
		height: '24px',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const pillIconWrapperStyles = compiledCss({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '24px',
	height: '24px',
	flexShrink: 0,
});

const ActionButton = ({
	content,
	icon: iconOption,
	isDisabled,
	isLoading,
	onClick: onClickCallback,
	size,
	space: spaceOption,
	testId,
	tooltipProps,
	style,
	ariaLabel,
}: ActionStackItemProps & { tooltipProps?: TriggerProps }): JSX.Element => {
	const space = spaceOption ?? getPrimitivesInlineSpaceBySize(size);

	const onClick = useCallback(() => {
		if (!isDisabled && !isLoading && onClickCallback) {
			onClickCallback();
		}
	}, [isDisabled, isLoading, onClickCallback]);

	const is3pExperimentEnabled =
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		(fg('platform_sl_3p_auth_rovo_action_kill_switch') &&
			expValEqualsNoExposure('platform_sl_3p_auth_rovo_action', 'isEnabled', true)) ||
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		(fg('rovogrowth-640-inline-action-nudge-fg') &&
			expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true));

	/**
	 * NOTE: We only apply the pill variant when there's text label
	 * (textual `content`). Icon-only stack-item buttons (e.g. the link/expand
	 * icons in the hover card footer) are also rendered with `as="stack-item"`
	 * but pass `content=""` and should keep their original borderless styling.
	 */
	const hasTextualContent =
		typeof content === 'string' ? content.trim().length > 0 : Boolean(content);
	const flexibleUiContext = useFlexibleUiContext();
	const isInRovoActionStack = !!flexibleUiContext?.actions?.[ActionName.RovoChatAction];
	const isInlineActionNudgeExperiment =
		hasTextualContent &&
		isInRovoActionStack &&
		fg('rovogrowth-640-inline-action-nudge-fg') &&
		expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true);

	const icon =
		iconOption && isLoading ? (
			<ActionIcon
				icon={
					is3pExperimentEnabled ? (
						<Box xcss={styles.spinner}>
							<Spinner size={16} testId={`${testId}-loading`} />
						</Box>
					) : (
						<Spinner testId={`${testId}-loading`} />
					)
				}
			/>
		) : (
			iconOption
		);

	return (
		<Pressable
			xcss={cx(isInlineActionNudgeExperiment ? styles.pillButton : styles.button)}
			{...tooltipProps}
			onClick={onClick}
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
			{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') ? { 'aria-label': ariaLabel } : {})}
		>
			<Inline
				alignBlock="center"
				grow={isInlineActionNudgeExperiment ? 'hug' : 'fill'}
				space={isInlineActionNudgeExperiment ? 'space.050' : space}
			>
				{isInlineActionNudgeExperiment ? (
					<span css={pillIconWrapperStyles}>{icon}</span>
				) : (
					icon
				)}
				<Box xcss={cx(isInlineActionNudgeExperiment ? styles.pillContent : styles.content)}>
					{content}
				</Box>
			</Inline>
		</Pressable>
	);
};

export default ActionButton;
