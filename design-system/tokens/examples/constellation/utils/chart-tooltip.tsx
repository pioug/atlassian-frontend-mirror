/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: { overflow: 'visible' },
	layout: { display: 'flex', justifyContent: 'center' },
	tooltip: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
		color: token('color.text'),
		font: token('font.body.small'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
	},
});

export const ChartTooltip = ({
	x,
	y,
	children,
	onMouseEnter,
	onMouseLeave,
}: {
	x: number;
	y: number;
	children: React.ReactNode;
	onMouseEnter: React.MouseEventHandler<SVGForeignObjectElement>;
	onMouseLeave: React.MouseEventHandler<SVGForeignObjectElement>;
}): React.JSX.Element => (
	// HTML inside SVG lets the overlay use the actual shadow token without an SVG filter.
	<foreignObject
		x={x - 32}
		y={y - 40}
		width={64}
		height={40}
		css={styles.container}
		aria-hidden="true"
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
	>
		<div css={styles.layout}>
			<span css={styles.tooltip}>{children}</span>
		</div>
	</foreignObject>
);
