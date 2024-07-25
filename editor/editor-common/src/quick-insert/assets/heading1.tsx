import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconHeading1() {
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
					d="M16.336 7.232h2.88V23h-2.88v-6.528H8.944V23h-2.88V7.232h2.88v6.624h7.392V7.232zM28.206 23h-2.88V9.992l-3.264 1.2V8.504l4.056-1.272h2.088V23z"
					fill={iconThemed({ light: '#172B4D', dark: '#8696A7' })}
					fillRule="nonzero"
				/>
			</g>
		</svg>
	);
}
