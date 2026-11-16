import React from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

export const SolidStrokeIcon = ({
	color = token('color.icon.subtle'),
}: NewCoreIconProps): React.JSX.Element => (
	<svg width="44" height="8" viewBox="0 0 44 8" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clipPath="url(#clip0_238_17340)">
			<path d="M-78 4H122" stroke={color} strokeWidth="2" />
		</g>
		<defs>
			<clipPath id="clip0_238_17340">
				<rect width="44" height="8" fill="white" />
			</clipPath>
		</defs>
	</svg>
);
