/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const createSteppedRainbow = (colors: string[]) => {
	return `
    linear-gradient(
      to right,
      ${colors
				.map((color, i) => {
					const inc = 100 / colors.length;
					const pos = i + 1;

					if (i === 0) {
						return `${color} ${pos * inc}%,`;
					}

					if (i === colors.length - 1) {
						return `${color} ${(pos - 1) * inc}%`;
					}

					return `
            ${color} ${(pos - 1) * inc}%,
            ${color} ${pos * inc}%,
          `;
				})
				.join('\n')}
    )`;
};

const rainbow = createSteppedRainbow([
	token('color.background.accent.purple.bolder'),
	token('color.background.accent.teal.subtle'),
	token('color.background.accent.orange.subtle'),
	token('color.background.accent.red.bolder'),
]);

const disabledRainbow = createSteppedRainbow([
	token('color.background.accent.gray.subtle'),
	token('color.background.accent.gray.subtle.hovered'),
	token('color.background.accent.gray.subtle.pressed'),
	token('color.background.accent.gray.subtle.hovered'),
]);

const barStyles = css({
	position: 'absolute',
	left: 0,
	right: 0,
	top: token('space.200', '16px'),
	margin: 'auto',
	width: '12px',
	height: '3px',
	borderRadius: token('border.radius', '3px'),
});

const textColorIconWrapper = css({
	position: 'relative',
});

type SteppedRainbowIconDecorationProps = {
	selectedColor?: string | null;
	disabled?: boolean;
	icon: React.ReactNode;
};

const getBackground = (selectedColor?: string | null, disabled?: boolean) => {
	if (selectedColor) {
		return selectedColor;
	}
	if (disabled) {
		return disabledRainbow;
	}
	return rainbow;
};

export const SteppedRainbowIconDecoration = ({
	selectedColor,
	disabled,
	icon,
}: SteppedRainbowIconDecorationProps) => {
	return (
		<div css={textColorIconWrapper}>
			{icon}
			<div
				data-testid="toolbar-icon-stepped-rainbow"
				style={{ background: getBackground(selectedColor, disabled) }}
				css={barStyles}
			/>
		</div>
	);
};
