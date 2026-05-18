/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import { type AvatarIconProps } from './types';

export default ({ size }: AvatarIconProps): React.JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 32 32"
		fill="none"
	>
		<rect width={size} height={size} fill="#1868DB" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M24 12C24 10.8954 23.1046 10 22 10H10C8.89543 10 8 10.8954 8 12V20.4443C8 21.5489 8.89543 22.4443 10 22.4443H22C23.1046 22.4443 24 21.5489 24 20.4443V12ZM15.1463 18.7832C15.3416 18.9784 15.6582 18.9784 15.8534 18.7832L20.2069 14.4297L18.7927 13.0155L15.4999 16.3083L14.207 15.0155L12.7928 16.4297L15.1463 18.7832Z"
			fill="white"
		/>
	</svg>
);
