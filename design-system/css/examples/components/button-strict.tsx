/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@compiled/react';

import { cssMap, type StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const buttonStyles = cssMap({
	container: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.brand.bold'),
		borderRadius: token('border.radius.100'),
		border: 'none',
		paddingBlock: token('space.150'),
		paddingInline: token('space.100'),
		'&:hover': {
			backgroundColor: token('color.background.brand.bold.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.brand.bold.pressed'),
		},
	},
});

export function Button({
	children,
	xcss,
}: {
	children: React.ReactNode;
	xcss?: StrictXCSSProp<'color' | 'backgroundColor', '&:hover' | '&:active'>;
}) {
	return (
		<button
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ fontWeight: token('font.weight.medium') }}
			css={buttonStyles.container}
			className={xcss}
		>
			{children}
		</button>
	);
}
