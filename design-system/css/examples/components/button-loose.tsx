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
		borderRadius: '3px',
		border: 0,
		fontWeight: '500',
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<button type="button" css={buttonStyles.container} className={xcss}>
			{children}
		</button>
	);
}
