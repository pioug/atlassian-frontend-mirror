/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import { type AvatarIconProps } from './types';

export default ({ size }: AvatarIconProps): React.JSX.Element => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
			fill="#1C1D21"
		/>
		<path
			d="M16.2032 24.7882C16.2031 25.4524 15.6463 26 14.9716 26H9.23065C8.55611 25.9999 8.00008 25.4523 8 24.7882V20.7443C8.00001 20.0802 8.55607 19.5326 9.23065 19.5325H16.2032V24.7882Z"
			fill="#FD5402"
		/>
		<path
			d="M23.6809 12.4577C24.4037 12.4578 25 13.0551 25 13.7797V18.1911C24.9999 18.9282 24.4037 19.5129 23.6809 19.513H16.2103V12.4577H23.6809Z"
			fill="#FD5402"
		/>
		<path
			d="M14.9716 6C15.6582 6 16.2032 6.54905 16.2032 7.21449V12.4675H9.23065C8.54437 12.4674 8.00022 11.9191 8 11.2539V7.21449C8 6.53747 8.55606 6.00015 9.23065 6H14.9716Z"
			fill="#FD5402"
		/>
	</svg>
);
