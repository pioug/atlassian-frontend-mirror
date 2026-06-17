/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { AnchorDocMarginKey } from '../../pm-plugins/decorations/decorationKeys';

const barStyles = css({
	position: 'absolute',
	width: '3px',
	borderRadius: token('radius.full'),
	backgroundColor: token('color.border.information'),
	pointerEvents: 'none',
	marginLeft: token('space.negative.200'),
	// Hide the bar if either anchor is not in the DOM (e.g. filtered out)
	positionVisibility: 'anchors-valid',
	/**
	 * These negative margins are to make sure the indicator bars join when
	 * they are at consecutive lines
	 */
	marginTop: token('space.negative.075'),
	marginBottom: token('space.negative.075'),
});

export function IndicatorBar({
	anchorTop,
	anchorBottom,
	anchorLeft,
	anchorLeftFallback,
}: {
	anchorBottom: string;
	anchorLeft: string;
	anchorLeftFallback?: string;
	anchorTop: string;
}): JSX.Element {
	const leftAnchors = [anchorLeft, anchorLeftFallback, AnchorDocMarginKey]
		.filter(Boolean)
		.map((anchor) => `anchor(--${anchor} left)`)
		.join(', ');
	return (
		<span
			data-testid="diff-indicator-bar"
			css={barStyles}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				left: `min(${leftAnchors})`,
				top: `anchor(--${anchorTop} top)`,
				bottom: `anchor(--${anchorBottom} bottom)`,
			}}
		/>
	);
}
