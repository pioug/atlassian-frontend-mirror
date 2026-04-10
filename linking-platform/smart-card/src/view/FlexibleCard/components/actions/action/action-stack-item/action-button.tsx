/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Pressable } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';
import type { TriggerProps } from '@atlaskit/tooltip';

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
	content: {
		color: token('color.text'),
		font: token('font.body.small'),
	},
	spinner: {
		width: '24px',
		height: '24px',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
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

	const icon =
		iconOption && isLoading ? (
			<ActionIcon
				icon={
					expValEqualsNoExposure('platform_sl_3p_auth_rovo_action', 'isEnabled', true) &&
					fg('platform_sl_3p_auth_rovo_action_kill_switch') ? (
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
			xcss={cx(styles.button)}
			{...tooltipProps}
			onClick={onClick}
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
			{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') ? { 'aria-label': ariaLabel } : {})}
		>
			<Inline alignBlock="center" grow="fill" space={space}>
				{icon}
				<Box xcss={cx(styles.content)}>{content}</Box>
			</Inline>
		</Pressable>
	);
};

export default ActionButton;
