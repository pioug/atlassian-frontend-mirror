import React from 'react';

import { token } from '@atlaskit/tokens';

import { useIconThemed } from '../use-icon-themed';

export default function OneColumnLayoutIcon() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40" fill="none">
			<g clipPath="url(#clip0_5808_9744)">
				<rect width="40" height="40" rx="3" fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} />
				<rect width="40" height="40" rx="3" fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} />
				<rect
					x="0.5"
					y="0.5"
					width="39"
					height="39"
					rx="2.5"
					stroke={token('color.border', '#091E42')}
					strokeOpacity="0.14"
				/>
			</g>
			<rect x="6" y="6" width="28" height="1" rx="0.5" fill="#CCE0FF" />
			<rect
				x="6"
				y="10"
				width="28"
				height="1"
				rx="0.5"
				fill={iconThemed({ light: '#FFF', dark: '#161A1D' })}
			/>
			<rect
				x="6"
				y="29"
				width="28"
				height="1"
				rx="0.5"
				fill={iconThemed({ light: '#A5ADBA', dark: '#738496' })}
			/>
			<rect
				x="6"
				y="33"
				width="16"
				height="1"
				rx="0.5"
				fill={iconThemed({ light: '#A5ADBA', dark: '#738496' })}
			/>
			<rect
				x="6.25"
				y="14.25"
				width="27.5"
				height="11.5"
				rx="0.75"
				fill={iconThemed({ light: '#DEEBFF', dark: '#09326C' })}
				stroke={iconThemed({ light: '#4C9AFF', dark: '#0C66E4' })}
				strokeWidth="0.5"
			/>
			<defs>
				<clipPath id="clip0_5808_9744">
					<rect
						width="40"
						height="40"
						rx="3"
						fill={iconThemed({ light: '#FFF', dark: '#161A1D' })}
					/>
				</clipPath>
			</defs>
		</svg>
	);
}
