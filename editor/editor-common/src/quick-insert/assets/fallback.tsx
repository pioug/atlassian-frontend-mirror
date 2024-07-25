/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconFallback() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<defs>
				<linearGradient x1="-26.046%" y1="100%" x2="62.626%" y2="0%" id="fallback-a">
					<stop stopColor="#B3BAC5" offset="0%" />
					<stop stopColor="#A5ADBA" offset="100%" />
				</linearGradient>
				<linearGradient x1="-12.24%" y1="100%" x2="82.44%" y2="0%" id="fallback-b">
					<stop stopColor="#5A6977" offset="0%" />
					<stop stopColor="#454F59" offset="100%" />
				</linearGradient>
			</defs>
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<path fill={iconThemed({ light: '#DFE1E6', dark: '#738496' })} d="M20 16h12v12H20z" />
				<path
					fill={iconThemed({
						light: 'url(#fallback-a)',
						dark: 'url(#fallback-b)',
					})}
					d="M8 16h12v12H8z"
				/>
				<path
					d="M20 16c-4 .5-6.029 2.5-6.086 6-.057 3.5-2.028 5.5-5.914 6h12V16z"
					fill={iconThemed({ light: '#A5ADBA', dark: '#454F59' })}
				/>
				<path fill={iconThemed({ light: '#B3BAC5', dark: '#454F59' })} d="M17.5 13h5v3h-5z" />
				<path fill={iconThemed({ light: '#A5ADBA', dark: '#454F59' })} d="M10 13h5v3h-5z" />
				<path fill={iconThemed({ light: '#DFE1E6', dark: '#738496' })} d="M25 13h5v3h-5z" />
			</g>
		</svg>
	);
}
