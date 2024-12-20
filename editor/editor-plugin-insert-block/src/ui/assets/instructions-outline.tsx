import React from 'react';

import { token } from '@atlaskit/tokens';

import { useIconThemed } from './use-icon-themed';

export default function InstructionsOutlineIcon() {
	const { iconThemed } = useIconThemed();

	return (
		<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_138_1254)">
				<rect
					y="0.259766"
					width="40"
					height="40"
					rx="3"
					fill={iconThemed({ light: '#FFF', dark: '#161A1D' })}
				/>

				<rect
					x="0.5"
					y="0.759766"
					width="39"
					height="39"
					rx="2.5"
					stroke={token('color.border', '#091E42')}
					strokeOpacity="0.14"
				/>
			</g>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 18.2598C10.4087 18.2598 8.88258 17.6276 7.75736 16.5024C6.63214 15.3772 6 13.8511 6 12.2598C6 10.6685 6.63214 9.14234 7.75736 8.01713C8.88258 6.89191 10.4087 6.25977 12 6.25977C13.5913 6.25977 15.1174 6.89191 16.2426 8.01713C17.3679 9.14234 18 10.6685 18 12.2598C18 13.8511 17.3679 15.3772 16.2426 16.5024C15.1174 17.6276 13.5913 18.2598 12 18.2598ZM12 11.8848C11.8011 11.8848 11.6103 11.9638 11.4697 12.1044C11.329 12.2451 11.25 12.4359 11.25 12.6348V14.5098C11.25 14.7087 11.329 14.8994 11.4697 15.0401C11.6103 15.1807 11.8011 15.2598 12 15.2598C12.1989 15.2598 12.3897 15.1807 12.5303 15.0401C12.671 14.8994 12.75 14.7087 12.75 14.5098V12.6348C12.75 12.4359 12.671 12.2451 12.5303 12.1044C12.3897 11.9638 12.1989 11.8848 12 11.8848ZM12 11.041C12.2735 11.041 12.5358 10.9324 12.7292 10.739C12.9226 10.5456 13.0312 10.2833 13.0312 10.0098C13.0312 9.73626 12.9226 9.47396 12.7292 9.28056C12.5358 9.08716 12.2735 8.97852 12 8.97852C11.7265 8.97852 11.4642 9.08716 11.2708 9.28056C11.0774 9.47396 10.9688 9.73626 10.9688 10.0098C10.9688 10.2833 11.0774 10.5456 11.2708 10.739C11.4642 10.9324 11.7265 11.041 12 11.041Z"
				fill="#4D8CED"
			/>
			<rect
				x="6"
				y="22.2598"
				width="28"
				height="1"
				rx="0.5"
				fill={token('color.text.disabled', '#A5ADBA')}
			/>
			<rect
				x="6"
				y="25.2598"
				width="28"
				height="1"
				rx="0.5"
				fill={token('color.text.disabled', '#A5ADBA')}
			/>
			<rect
				x="6"
				y="28.2598"
				width="14"
				height="1"
				rx="0.5"
				fill={token('color.text.disabled', '#A5ADBA')}
			/>
			<defs>
				<clipPath id="clip0_138_1254">
					<rect
						y="0.259766"
						width="40"
						height="40"
						rx="3"
						fill={token('elevation.surface', '#FFFFFF')}
					/>
				</clipPath>
			</defs>
		</svg>
	);
}
