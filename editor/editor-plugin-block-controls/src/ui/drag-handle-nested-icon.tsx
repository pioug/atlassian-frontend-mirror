/** @jsxRuntime classic */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

const spanStyles = css({
	display: 'inline-block',
	boxSizing: 'border-box',
	flexShrink: 0,
});

const svgSizeStyles = css({
	width: '24px',
	height: '24px',
});

const svgStyles = css({
	color: 'currentColor',
	overflow: 'hidden',
	pointerEvents: 'none',
	verticalAlign: 'bottom',
});

/**
 * Custom 3-dot vertical drag handle icon for nested nodes.
 * Similar to DragHandleVerticalIcon but with only 3 dots instead of 6.
 * Hardcoded to medium size with spacious spacing.
 */
export const DragHandleNestedIcon = () => {
	return (
		<span aria-hidden={true} css={spanStyles}>
			<svg
				width={24}
				height={24}
				viewBox="-8 -8 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				role="presentation"
				css={[svgStyles, svgSizeStyles]}
			>
				<circle cx="8" cy="2.75" r="1.75" fill="currentColor" />
				<circle cx="8" cy="8" r="1.75" fill="currentColor" />
				<circle cx="8" cy="13.25" r="1.75" fill="currentColor" />
			</svg>
		</span>
	);
};
