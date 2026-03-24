/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx, keyframes } from '@emotion/react';
import { token } from '@atlaskit/tokens';

type Props = { children: React.ReactNode; left: number; top: number };
export const Popup = React.forwardRef<HTMLDivElement, Props>(function Popup(
	{ children, top, left }: Props,
	ref,
) {
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	return (
		<div style={{ top }} css={popupPanelStyles}>
			<div
				css={buttonContainer}
				ref={ref}
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				style={{ left: left }}
				data-testid="highlightActionsPopup"
			>
				{children}
			</div>
		</div>
	);
});

const buttonContainer = css({
	transform: `translate(calc(-50% - 5px), calc(-100% - 20px))`,
	boxShadow: token('elevation.shadow.overlay'),
	borderRadius: 3,
	position: 'absolute',
	top: 0,
	backgroundColor: token('elevation.surface.overlay'),
	display: 'flex',
});

const fadeIn = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

const popupPanelStyles = css({
	position: 'absolute',
	animationName: fadeIn,
	animationDuration: '100ms',
	animationTimingFunction: 'linear',
	animationFillMode: 'forwards',
	transition: 'top 100ms ease-out, left 100ms ease-out',
});
