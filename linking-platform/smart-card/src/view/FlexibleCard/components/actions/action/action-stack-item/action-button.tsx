/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Pressable } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import type { TriggerProps } from '@atlaskit/tooltip';

import { getPrimitivesInlineSpaceBySize } from '../../../utils';
import ActionIcon from '../action-icon';

import ActionButtonOld from './action-buttonOld';
import type { ActionStackItemProps } from './types';

const styles = cssMap({
	button: {
		all: 'unset',
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
	},
	content: {
		color: token('color.text'),
		font: token('font.body.UNSAFE_small'),
	},
});

const ActionButtonNew = ({
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
}: ActionStackItemProps & { tooltipProps?: TriggerProps }) => {
	const space = spaceOption ?? getPrimitivesInlineSpaceBySize(size);

	const onClick = useCallback(() => {
		if (!isDisabled && !isLoading && onClickCallback) {
			onClickCallback();
		}
	}, [isDisabled, isLoading, onClickCallback]);

	const icon =
		iconOption && isLoading ? (
			<ActionIcon
				asStackItemIcon={true}
				icon={<Spinner testId={`${testId}-loading`} />}
				size={size}
			/>
		) : (
			iconOption
		);

	return (
		<Pressable
			xcss={styles.button}
			{...tooltipProps}
			onClick={onClick}
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
		>
			<Inline alignBlock="center" grow="fill" space={space}>
				{icon}
				<Box xcss={styles.content}>{content}</Box>
			</Inline>
		</Pressable>
	);
};

const ActionButton = (props: ActionStackItemProps & { tooltipProps?: TriggerProps }) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ActionButtonNew {...props} />;
	}
	return <ActionButtonOld {...props} />;
};

export default ActionButton;
