import React from 'react';

import { token } from '@atlaskit/tokens';

import { useIconThemed } from './use-icon-themed';

export default function DiscussionNotesIcon() {
	const { iconThemed } = useIconThemed();

	return (
		<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_138_1334)">
				<rect
					y="0.259766"
					width="40"
					height="40"
					rx="3"
					fill={iconThemed({ light: '#FFF', dark: '#161A1D' })}
				/>
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
					stroke={token('color.border', '#091E4224')}
					strokeOpacity="0.14"
				/>
			</g>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.5 6.25977H13.5C13.8978 6.25977 14.2794 6.4178 14.5607 6.69911C14.842 6.98041 15 7.36194 15 7.75977V16.7598C15 17.1576 14.842 17.5391 14.5607 17.8204C14.2794 18.1017 13.8978 18.2598 13.5 18.2598H7.5C7.10218 18.2598 6.72064 18.1017 6.43934 17.8204C6.15804 17.5391 6 17.1576 6 16.7598V7.75977C6 7.36194 6.15804 6.98041 6.43934 6.69911C6.72064 6.4178 7.10218 6.25977 7.5 6.25977ZM8.625 9.25977C8.52554 9.25977 8.43016 9.29927 8.35983 9.3696C8.28951 9.43993 8.25 9.53531 8.25 9.63477V10.3848C8.25 10.4842 8.28951 10.5796 8.35983 10.6499C8.43016 10.7203 8.52554 10.7598 8.625 10.7598H12.375C12.4745 10.7598 12.5698 10.7203 12.6402 10.6499C12.7105 10.5796 12.75 10.4842 12.75 10.3848V9.63477C12.75 9.53531 12.7105 9.43993 12.6402 9.3696C12.5698 9.29927 12.4745 9.25977 12.375 9.25977H8.625ZM8.625 12.2598C8.52554 12.2598 8.43016 12.2993 8.35983 12.3696C8.28951 12.4399 8.25 12.5353 8.25 12.6348V13.3848C8.25 13.4842 8.28951 13.5796 8.35983 13.6499C8.43016 13.7203 8.52554 13.7598 8.625 13.7598H10.875C10.9745 13.7598 11.0698 13.7203 11.1402 13.6499C11.2105 13.5796 11.25 13.4842 11.25 13.3848V12.6348C11.25 12.5353 11.2105 12.4399 11.1402 12.3696C11.0698 12.2993 10.9745 12.2598 10.875 12.2598H8.625Z"
				fill={token('color.background.accent.purple.bolder', '#6E5DC6')}
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
				<clipPath id="clip0_138_1334">
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
