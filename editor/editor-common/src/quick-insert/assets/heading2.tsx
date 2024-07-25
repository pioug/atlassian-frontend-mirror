import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconHeading2() {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#454F59' })}
					x={6}
					y={32}
					width={20}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#454F59' })}
					x={6}
					y={29}
					width={28}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#454F59' })}
					x={6}
					y={26}
					width={28}
					height={1}
					rx={0.5}
				/>
				<path
					d="M14.68 8.86h2.4V22h-2.4v-5.44H8.52V22h-2.4V8.86h2.4v5.52h6.16V8.86zM28.88 22h-9.04v-2.2l4.66-3.7c1.14-.92 1.98-1.8 1.98-3.1 0-1.46-.98-2.1-2.48-2.1-1.28 0-2.6.44-3.86 1.16V9.78c.9-.52 2.06-1.12 4.14-1.12 3.14 0 4.58 1.74 4.58 4.26 0 2.02-1.28 3.4-3.04 4.7l-3.3 2.44c1.14-.14 2.74-.26 3.94-.26h2.42V22z"
					fill={iconThemed({ light: '#172B4D', dark: '#8696A7' })}
					fillRule="nonzero"
				/>
			</g>
		</svg>
	);
}
