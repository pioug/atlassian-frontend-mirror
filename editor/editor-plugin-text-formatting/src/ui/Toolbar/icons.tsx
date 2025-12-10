/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import { token } from '@atlaskit/tokens';

const SVGContainer = ({ children }: React.PropsWithChildren<object>) => (
	<span
		style={{
			width: token('space.300', '24px'),
			height: token('space.300', '24px'),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		{children}
	</span>
);

export const Subscript = (): React.JSX.Element => (
	<SVGContainer>
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M5.10609 6.54799L7.88895 2.09448L9.16102 2.88936L5.99047 7.9633L9.21219 13.1191L7.94012 13.914L5.10609 9.37861L2.27207 13.914L1 13.1191L4.2217 7.9633L1.05117 2.88939L2.32324 2.09451L5.10609 6.54799ZM10.858 15.0001V13.696H12.3499V10.3153L10.8418 11.4343V9.86413L12.3138 8.83114H13.8161V13.696H14.9999V15.0001H10.858Z"
				fill="currentColor"
			/>
		</svg>
	</SVGContainer>
);

export const Superscript = (): React.JSX.Element => (
	<SVGContainer>
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M10.858 7.16892V5.86487H12.3499V2.4842L10.8418 3.60312V2.03298L12.3138 1H13.8161V5.86487H14.9999V7.16892H10.858ZM5.10609 6.5479L7.88895 2.09439L9.16102 2.88927L5.99047 7.96321L9.21219 13.119L7.94012 13.9139L5.10609 9.37852L2.27207 13.9139L1 13.119L4.2217 7.96321L1.05117 2.8893L2.32324 2.09442L5.10609 6.5479Z"
				fill="currentColor"
			/>
		</svg>
	</SVGContainer>
);
