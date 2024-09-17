/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
const barStyles = css({
	position: 'absolute',
	left: 0,
	right: 0,
	top: '18px',
	margin: 'auto',
	width: token('space.200', '16px'),
	height: '3px',
});

const textColorIconWrapper = xcss({
	position: 'relative',
});

type DynamicStrokeIconDecorationProps = {
	selectedColor?: string | null;
	disabled?: boolean;
	icon: React.ReactNode;
};

const getBackground = (selectedColor?: string | null, disabled?: boolean) => {
	if (selectedColor) {
		return selectedColor;
	}

	return disabled ? token('color.icon.disabled') : token('color.icon');
};

export const DynamicStrokeIconDecoration = ({
	selectedColor,
	disabled,
	icon,
}: DynamicStrokeIconDecorationProps) => {
	return (
		<Box xcss={textColorIconWrapper}>
			{icon}
			<div
				data-testid="toolbar-icon-dynamic-stroke"
				style={{ background: getBackground(selectedColor, disabled) }}
				css={barStyles}
			/>
		</Box>
	);
};
