/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import { token } from '@atlaskit/tokens';

const SVGContainer = ({ children }: React.PropsWithChildren<object>) => (
	<span
		style={{
			width: token('space.200', '16px'),
			height: token('space.200', '16px'),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		{children}
	</span>
);

export const SubscriptIcon = () => (
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
