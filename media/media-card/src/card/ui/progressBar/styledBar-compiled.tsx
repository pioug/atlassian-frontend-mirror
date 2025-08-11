/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type StyledBarProps } from './types';
import { Breakpoint, getTitleBoxHeight, responsiveSettings } from '../common';

const height = 3;
const padding = 1;
const width = 95; // %

const smallSizeSettings = { marginBottom: 4 };
const largeSizeSettings = { marginBottom: 12 };

export function generateResponsiveStyles(
	breakpoint: Breakpoint,
	positionBottom: boolean,
	showOnTop: boolean,
	multiplier: number = 1,
) {
	const setting = breakpoint === Breakpoint.SMALL ? smallSizeSettings : largeSizeSettings;
	const marginPositionBottom = responsiveSettings[breakpoint].titleBox.verticalPadding;
	const marginBottom =
		setting.marginBottom * multiplier +
		(positionBottom ? marginPositionBottom : getTitleBoxHeight(breakpoint));
	const spacing = `${marginBottom}px`;

	return showOnTop ? { top: spacing } : { bottom: spacing };
}

const styledBarStyles = css({
	overflow: 'hidden',
	position: 'absolute',
	width: `${width}%`,
	left: `calc(5 / 2)%`,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: 'rgba(255, 255, 255, 0.8)',
	height: `${height + padding * 2}px`,
	padding: `${padding}px`,
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
});

const styleChild = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#44546F',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	display: 'block',
	height: '100%',
});

export const StyledBar = (props: StyledBarProps) => {
	const { progress, breakpoint, positionBottom, showOnTop, ariaLabel } = props;

	return (
		<div
			id="styledBar"
			role="progressbar"
			aria-valuenow={progress}
			aria-label={ariaLabel}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...generateResponsiveStyles(breakpoint, positionBottom, showOnTop),
			}}
			css={[styledBarStyles]}
		>
			<div style={{ width: `${progress}%` }} css={styleChild}></div>
		</div>
	);
};

StyledBar.displayName = 'StyledProgressBar';
