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
		<g clipPath="url(#clip0_995_20751)">
			<rect width={size} height={size} rx="8" fill="#7D2AE7" />
			<rect width={size} height={size} rx="8" fill="url(#paint0_radial_995_20751)" />
			<rect width={size} height={size} rx="8" fill="url(#paint1_radial_995_20751)" />
			<rect width={size} height={size} rx="8" fill="url(#paint2_radial_995_20751)" />
			<rect width={size} height={size} rx="8" fill="url(#paint3_radial_995_20751)" />
			<path
				d="M22.0849 18.0722C21.9749 18.0722 21.878 18.1651 21.7773 18.3681C20.6393 20.6756 18.6738 22.3083 16.3994 22.3083C13.7695 22.3083 12.1409 19.9343 12.1409 16.6546C12.1409 11.099 15.2363 7.88687 17.9551 7.88687C19.2255 7.88687 20.0014 8.68526 20.0014 9.95579C20.0014 11.4637 19.1447 12.2621 19.1447 12.7939C19.1447 13.0326 19.2932 13.1772 19.5876 13.1772C20.7707 13.1772 22.1591 11.8178 22.1591 9.89743C22.1591 8.03541 20.5385 6.66675 17.8198 6.66675C13.3265 6.66675 9.33325 10.8324 9.33325 16.5962C9.33325 21.0576 11.8809 24.0058 15.8119 24.0058C19.9841 24.0058 22.3966 19.8547 22.3966 18.5073C22.3966 18.2089 22.2441 18.0722 22.0849 18.0722Z"
				fill="white"
			/>
		</g>
		<defs>
			<radialGradient
				id="paint0_radial_995_20751"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(6.1812 28.3623) rotate(-49.416) scale(24.7493)"
			>
				<stop stopColor="#6420FF" />
				<stop offset="1" stopColor="#6420FF" stopOpacity="0" />
			</radialGradient>
			<radialGradient
				id="paint1_radial_995_20751"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(8.47152 3.63783) rotate(54.703) scale(27.9094)"
			>
				<stop stopColor="#00C4CC" />
				<stop offset="1" stopColor="#00C4CC" stopOpacity="0" />
			</radialGradient>
			<radialGradient
				id="paint2_radial_995_20751"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(6.18105 28.3621) rotate(-45.1954) scale(24.4497 11.2447)"
			>
				<stop stopColor="#6420FF" />
				<stop offset="1" stopColor="#6420FF" stopOpacity="0" />
			</radialGradient>
			<radialGradient
				id="paint3_radial_995_20751"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(13.0863 4.31158) rotate(66.5198) scale(25.1934 42.2046)"
			>
				<stop stopColor="#00C4CC" stopOpacity="0.725916" />
				<stop offset="0.0001" stopColor="#00C4CC" />
				<stop offset="1" stopColor="#00C4CC" stopOpacity="0" />
			</radialGradient>
			<clipPath id="clip0_995_20751">
				<path
					d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
					fill="white"
				/>
			</clipPath>
		</defs>
	</svg>
);
