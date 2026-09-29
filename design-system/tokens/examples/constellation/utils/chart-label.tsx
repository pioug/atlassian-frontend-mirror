/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	label: {
		fill: token('color.text.subtle'),
		font: token('font.body.small'),
		pointerEvents: 'none',
	},
});

export const ChartLabel = ({
	x,
	y,
	children,
	textAnchor = 'middle',
}: {
	x: number;
	y: number;
	children: React.ReactNode;
	textAnchor?: 'start' | 'middle' | 'end';
}): React.JSX.Element => (
	<text x={x} y={y} textAnchor={textAnchor} css={styles.label}>
		{children}
	</text>
);
