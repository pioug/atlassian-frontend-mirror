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
	>
		<path
			d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
			fill="#191919"
		/>
		<mask
			id="mask0_789_23491"
			style={{ maskType: 'alpha' }}
			maskUnits="userSpaceOnUse"
			x="8"
			y="6"
			width="18"
			height="18"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.3113 6C16.2448 6 18.6228 8.38427 18.6228 11.3254V13.3492H20.3903C23.3238 13.3492 25.7018 15.7335 25.7018 18.6746C25.7018 21.6157 23.3238 24 20.3905 24H8V11.3254C8 8.38427 10.3778 6 13.3113 6Z"
				fill="url(#paint0_linear_789_23491)"
			/>
		</mask>
		<g mask="url(#mask0_789_23491)">
			<g filter="url(#filter0_f_789_23491)">
				<path
					d="M15.7651 27.5906C22.3829 27.5906 27.7477 22.2258 27.7477 15.608C27.7477 8.99013 22.3829 3.62531 15.7651 3.62531C9.14722 3.62531 3.7824 8.99013 3.7824 15.608C3.7824 22.2258 9.14722 27.5906 15.7651 27.5906Z"
					fill="#4B73FF"
				/>
			</g>
			<g filter="url(#filter1_f_789_23491)">
				<path
					d="M17.0815 21.0151C25.5571 21.0151 32.428 15.6503 32.428 9.03242C32.428 2.41457 25.5571 -2.95026 17.0815 -2.95026C8.60584 -2.95026 1.73498 2.41457 1.73498 9.03242C1.73498 15.6503 8.60584 21.0151 17.0815 21.0151Z"
					fill="#FF66F4"
				/>
			</g>
			<g filter="url(#filter2_f_789_23491)">
				<path
					d="M19.5849 17.3008C26.2028 17.3008 31.5676 12.5893 31.5676 6.77736C31.5676 0.96545 26.2028 -3.74603 19.5849 -3.74603C12.9671 -3.74603 7.60226 0.96545 7.60226 6.77736C7.60226 12.5893 12.9671 17.3008 19.5849 17.3008Z"
					fill="#FF0105"
				/>
			</g>
			<g filter="url(#filter3_f_789_23491)">
				<path
					d="M17.2949 16.2359C21.2748 16.2359 24.5012 13.0095 24.5012 9.02956C24.5012 5.04958 21.2748 1.82318 17.2949 1.82318C13.3149 1.82318 10.0885 5.04958 10.0885 9.02956C10.0885 13.0095 13.3149 16.2359 17.2949 16.2359Z"
					fill="#FE7B02"
				/>
			</g>
		</g>
		<defs>
			<filter
				id="filter0_f_789_23491"
				x="-1.58778"
				y="-1.74487"
				width="34.7057"
				height="34.7057"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="2.68509" result="effect1_foregroundBlur_789_23491" />
			</filter>
			<filter
				id="filter1_f_789_23491"
				x="-3.6352"
				y="-8.32043"
				width="41.4334"
				height="34.7057"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="2.68509" result="effect1_foregroundBlur_789_23491" />
			</filter>
			<filter
				id="filter2_f_789_23491"
				x="2.23208"
				y="-9.11621"
				width="34.7057"
				height="31.7872"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="2.68509" result="effect1_foregroundBlur_789_23491" />
			</filter>
			<filter
				id="filter3_f_789_23491"
				x="4.7183"
				y="-3.547"
				width="25.1531"
				height="25.1531"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="2.68509" result="effect1_foregroundBlur_789_23491" />
			</filter>
			<linearGradient
				id="paint0_linear_789_23491"
				x1="13.957"
				y1="9.16309"
				x2="19.35"
				y2="23.9933"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0.025" stopColor="#FF8E63" />
				<stop offset="0.56" stopColor="#FF7EB0" />
				<stop offset="0.95" stopColor="#4B73FF" />
			</linearGradient>
		</defs>
	</svg>
);
