/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx, type XCSSProp } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const buttonStyles = cssMap({
	container: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.brand.bold'),
		borderRadius: token('radius.small'),
		border: 0,
		fontWeight: token('font.weight.medium'),
		paddingBlock: '4px',
		paddingInline: '8px',
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
	xcss?: XCSSProp<'color' | 'backgroundColor', '&:hover' | '&:active'>;
}) {
	return (
		<button type="button" css={buttonStyles.container} className={xcss}>
			{children}
		</button>
	);
}
