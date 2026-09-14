import React from 'react';

import { token } from '@atlaskit/tokens';

const CustomGlyph = () => (
	<svg width="44" height="8" viewBox="0 0 44 8" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clipPath="url(#clip0_238_2909)">
			<path
				d="M-78 4H122"
				stroke={token('color.icon')}
				strokeWidth="2"
				strokeLinecap="round"
				strokeDasharray="0.01 6"
			/>
		</g>
		<defs>
			<clipPath id="clip0_238_2909">
				<rect width="44" height="8" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export const DottedStrokeIcon = (): React.JSX.Element => {
	return <CustomGlyph />;
};
