import React, { useCallback } from 'react';

import { Box, Inline, Pressable, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import type { TriggerProps } from '@atlaskit/tooltip';

import { getPrimitivesInlineSpaceBySize } from '../../../utils';
import ActionIcon from '../action-icon';

import type { ActionStackItemProps } from './types';

const buttonStyles = xcss({
	all: 'unset',
	padding: 'space.050',
	width: '100%',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

const contentStyles = xcss({
	color: 'color.text',
	font: token('font.body.UNSAFE_small'),
});

const ActionButtonOld = ({
	content,
	icon: iconOption,
	isDisabled,
	isLoading,
	onClick: onClickCallback,
	size,
	space: spaceOption,
	testId,
	tooltipProps,
	xcss,
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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<Pressable xcss={[buttonStyles, xcss]} {...tooltipProps} onClick={onClick} testId={testId}>
			<Inline alignBlock="center" grow="fill" space={space}>
				{icon}
				<Box xcss={contentStyles}>{content}</Box>
			</Inline>
		</Pressable>
	);
};

export default ActionButtonOld;
