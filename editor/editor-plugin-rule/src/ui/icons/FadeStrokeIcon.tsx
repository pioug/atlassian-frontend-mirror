import React from 'react';

import { token } from '@atlaskit/tokens';

const CustomGlyph = () => (
	<svg width="79" height="2" viewBox="0 0 79 2" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M0 1C1.31667 1.06667 2.63333 1.13 3.95 1.19C15.8 1.73 27.65 2 39.5 2C51.35 2 63.2 1.73 75.05 1.19C76.3667 1.13 77.6833 1.06667 79 1C77.6833 0.933333 76.3667 0.87 75.05 0.81C63.2 0.27 51.35 0 39.5 0C27.65 0 15.8 0.27 3.95 0.81C2.63333 0.87 1.31667 0.933333 0 1Z"
			fill="url(#paint0_linear_238_2941)"
		/>
		<defs>
			<linearGradient
				id="paint0_linear_238_2941"
				x1="0"
				y1="1.5"
				x2="79"
				y2="1.5"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor={token('color.icon')} stopOpacity={0} />
				<stop offset="0.274038" stopColor={token('color.icon')} />
				<stop offset="0.740385" stopColor={token('color.icon')} />
				<stop offset="1" stopColor={token('color.icon')} stopOpacity={0} />
			</linearGradient>
		</defs>
	</svg>
);

export const FadeStrokeIcon = (): React.JSX.Element => {
	return <CustomGlyph />;
};
