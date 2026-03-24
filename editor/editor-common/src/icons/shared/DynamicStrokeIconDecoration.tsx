/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
const barStyles = css({
	position: 'absolute',
	left: 0,
	right: 0,
	top: '18px',
	margin: 'auto',
	width: token('space.200'),
	height: '3px',
});

const textColorIconWrapper = xcss({
	position: 'relative',
});

type DynamicStrokeIconDecorationProps = {
	disabled?: boolean;
	icon: React.ReactNode;
	selectedColor?: string | null;
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
}: DynamicStrokeIconDecorationProps): jsx.JSX.Element => {
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
