/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect } from 'react';

import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';
// ── Rovo gradient animation setup ───────────────────────────────────────────
// Mirrors the shared rovo-gradient component but self-contained to avoid
// circular dependency (media-card cannot depend on rovo-platform-ui-components).

let propertyRegistered = false;

function ensureGradientAngleRegistered(): void {
	if (propertyRegistered) {
		return;
	}
	if (typeof window === 'undefined' || typeof CSS === 'undefined') {
		return;
	}
	propertyRegistered = true;
	try {
		if (typeof CSS.registerProperty === 'function') {
			CSS.registerProperty({
				name: '--gradient-angle',
				syntax: '<angle>',
				initialValue: '270deg',
				inherits: false,
			});
		}
	} catch {
		// Already registered or unsupported
	}
}

const GRADIENT_BACKGROUND = `conic-gradient(
	from var(--gradient-angle, 45deg),
	#FCA700 0%,
	#6A9A23 25%,
	#1868DB 50%,
	#AF59E0 75%,
	#FCA700 100%
)`;

const KEYFRAMES_CSS = `
@keyframes rovoGradientRotation {
	0% { --gradient-angle: 0deg; }
	100% { --gradient-angle: 360deg; }
}
`;

// ── Component ───────────────────────────────────────────────────────────────

const borderStyles = css({
	position: 'absolute',
	top: '-2px',
	left: '-2px',
	width: 'calc(100% + 4px)',
	height: 'calc(100% + 4px)',
	pointerEvents: 'none',
	zIndex: 1,
	borderRadius: `calc(${token('radius.large', '3px')} + 2px)`,
	WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
	WebkitMaskComposite: 'xor',
	maskComposite: 'exclude',
	paddingTop: token('space.025', '2px'),
	paddingRight: token('space.025', '2px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.025', '2px'),
	'@media (prefers-reduced-motion)': {
		animationName: 'none',
	},
});

/**
 * AIBorder renders an animated rainbow border as a positioned overlay.
 * Uses the same Rovo gradient colors as rovo-platform-ui-components for
 * consistent branding across all AI-related border animations.
 *
 * Must be placed inside a positioned container with no overflow:hidden.
 * Uses CSS mask to show only the border ring (not the fill).
 */
const AIBorderComponent = (): React.JSX.Element => {
	useEffect(() => {
		ensureGradientAngleRegistered();
	}, []);

	return (
		<div
			data-testid="media-card-ai-border"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- pointerEvents cannot be set via css prop on a wrapper div without compiled
			style={{ pointerEvents: 'none' }}
		>
			{/* eslint-disable-next-line react/no-danger, @atlaskit/ui-styling-standard/no-global-styles -- @keyframes for CSS custom property animation */}
			<style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} />
			{/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop -- gradient and animation not expressible in compiled css */}
			<div
				css={borderStyles}
				style={{
					background: GRADIENT_BACKGROUND,
					animation: 'rovoGradientRotation linear 2s infinite',
				}}
			/>
			{/* eslint-enable @atlaskit/ui-styling-standard/enforce-style-prop */}
		</div>
	);
};

AIBorderComponent.displayName = 'AIBorder';
export const AIBorder: React.FC & { displayName?: string } = AIBorderComponent;
