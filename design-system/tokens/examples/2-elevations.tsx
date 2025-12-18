/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, type CSSProperties, jsx } from '@compiled/react';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import { token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const nonInteractiveStyles = {
	sunken: {
		label: 'elevation.surface.sunken',
		surface: token('elevation.surface.sunken'),
		shadow: 'none',
	},
};
const interactiveBackgroundStyles = {
	default: {
		label: 'elevation.surface',
		surface: token('elevation.surface'),
		surfaceHovered: token('elevation.surface.hovered'),
		surfacePressed: token('elevation.surface.pressed'),
		shadow: 'none',
	},
	defaultOutline: {
		label: 'elevation.surface (with border)',
		surface: token('elevation.surface'),
		surfaceHovered: token('elevation.surface.hovered'),
		surfacePressed: token('elevation.surface.pressed'),
		shadow: 'none',
		border: token('color.border'),
	},
	raised: {
		label: 'elevation.surface.raised',
		surface: token('elevation.surface.raised'),
		surfaceHovered: token('elevation.surface.raised.hovered'),
		surfacePressed: token('elevation.surface.raised.pressed'),
		shadow: token('elevation.shadow.raised'),
	},
	overlay: {
		label: 'elevation.surface.overlay',
		surface: token('elevation.surface.overlay'),
		surfaceHovered: token('elevation.surface.overlay.hovered'),
		surfacePressed: token('elevation.surface.overlay.pressed'),
		shadow: token('elevation.shadow.overlay'),
	},
};

const interactiveElevationStyles = {
	default: {
		label: 'elevation.surface',
		surface: token('elevation.surface'),
		surfaceHovered: token('elevation.surface.overlay'),
		surfacePressed: token('elevation.surface.raised'),
		shadow: 'none',
		shadowHovered: token('elevation.shadow.overlay'),
		shadowPressed: token('elevation.shadow.raised'),
	},
	defaultOutline: {
		label: 'elevation.surface (with border)',
		surface: token('elevation.surface'),
		surfaceHovered: token('elevation.surface.overlay'),
		surfacePressed: token('elevation.surface.raised'),
		border: token('color.border'),
		shadow: 'none',
		shadowHovered: token('elevation.shadow.overlay'),
		shadowPressed: token('elevation.shadow.raised'),
	},
	raised: {
		label: 'elevation.surface.raised',
		surface: token('elevation.surface.raised'),
		surfaceHovered: token('elevation.surface.overlay'),
		surfacePressed: token('elevation.surface.raised'),
		shadow: token('elevation.shadow.raised'),
		shadowHovered: token('elevation.shadow.overlay'),
		shadowPressed: token('elevation.shadow.raised'),
	},
};

const surfaceColorCssVar = `--surface-color`;
const shadowColorCssVar = `--shadow-color`;
const surfaceHoverColorCssVar = `--surface-hover-color`;
const surfacePressedCssVar = `--surface-pressed-color`;
const shadowHoverCssVar = `--shadow-hover-color`;
const shadowPressedCssVar = `--shadow-pressed-color`;

const styles = cssMap({
	container: {
		padding: '2em',
	},
	box: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		maxWidth: '200px',
		minHeight: '100px',
		padding: '1em',
		alignItems: 'center',
		borderRadius: token('radius.small', '3px'),
		marginBlockStart: '1em',
		textAlign: 'left',
		color: token('color.text'),
		transition: 'box-shadow 200ms, background 200ms, border 200ms',
		backgroundColor: `var(${surfaceColorCssVar})`,
		boxShadow: `var(${shadowColorCssVar})`,
		'&:hover': {
			backgroundColor: `var(${surfaceHoverColorCssVar})`,
			boxShadow: `var(${shadowHoverCssVar})`,
		},
		'&:active': {
			backgroundColor: `var(${surfacePressedCssVar})`,
			boxShadow: `var(${shadowPressedCssVar})`,
		},
	},
	boxInteractive: {
		cursor: 'pointer',
	},
});

const Box = ({ text, style }: { text: string; style: Record<string, string> }) => {
	const isInteractive = style.surfacePressed || style.shadowPressed;
	const ComponentType = isInteractive ? 'button' : 'div';
	return (
		<ComponentType
			css={[styles.box, styles.boxInteractive]}
			style={
				{
					border: style.border ? `1px solid ${style.border}` : 'none',
					[surfaceColorCssVar]: style.surface,
					[shadowColorCssVar]: style.shadow,
					[surfaceHoverColorCssVar]: style.surfaceHovered || style.surface,
					[shadowHoverCssVar]: style.shadowHovered || style.shadow,
					[surfacePressedCssVar]: style.surfacePressed || style.surface,
					[shadowPressedCssVar]: style.shadowPressed || style.shadow,
				} as CSSProperties
			}
		>
			<StarStarredIcon label="Star icon" spacing="spacious" />
			{text}
		</ComponentType>
	);
};

export default () => {
	useVrGlobalTheme();

	return (
		<div css={styles.container}>
			<h2>Elevations & Surfaces</h2>
			<h3>Non-interactive surfaces</h3>
			{Object.entries(nonInteractiveStyles).map(([key, styles]) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<Box key={key} style={styles} text={styles.label || key} />
			))}
			<h3>Interactive elevations (approach 1: background change)</h3>
			{Object.entries(interactiveBackgroundStyles).map(([key, styles]) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<Box key={key} style={styles} text={styles.label || key} />
			))}
			<h3>Interactive elevations (approach 2: elevation change)</h3>
			{Object.entries(interactiveElevationStyles).map(([key, styles]) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<Box key={key} style={styles} text={styles.label || key} />
			))}
		</div>
	);
};
