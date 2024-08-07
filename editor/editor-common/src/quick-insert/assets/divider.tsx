import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconDivider() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={6}
					y={19}
					width={28}
					height={2}
					rx={1}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={12}
					y={14}
					width={16}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={12}
					y={11}
					width={16}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={12}
					y={8}
					width={16}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={12}
					y={31}
					width={9}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={12}
					y={28}
					width={16}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#C1C7D0', dark: '#5A6977' })}
					x={12}
					y={25}
					width={16}
					height={1}
					rx={0.5}
				/>
			</g>
		</svg>
	);
}
