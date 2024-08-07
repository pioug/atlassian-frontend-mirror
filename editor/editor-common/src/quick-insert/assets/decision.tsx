import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconDecision() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<path
					d="M10 10h29v20H10a3 3 0 01-3-3V13a3 3 0 013-3z"
					fill={iconThemed({ light: '#ECEDF0', dark: '#454F59' })}
				/>
				<path
					d="M14.414 16l3.293 3.293c.187.187.293.442.293.707v5a1 1 0 01-2 0v-4.586l-3-3V18.5a1 1 0 01-2 0V15a1 1 0 011-1h3.5a1 1 0 010 2h-1.086zm8.293-1.707a.999.999 0 010 1.414l-2.5 2.5a.997.997 0 01-1.414 0 .999.999 0 010-1.414l2.5-2.5a.999.999 0 011.414 0z"
					fill={iconThemed({ light: '#36B37E', dark: '#1F845A' })}
				/>
				<path
					d="M27 19h12v2H27a1 1 0 010-2z"
					fill={iconThemed({ light: '#C1C7D0', dark: '#738496' })}
				/>
			</g>
		</svg>
	);
}
