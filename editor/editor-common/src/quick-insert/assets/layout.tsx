import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconLayout() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({ light: '#A5ADBA', dark: '#738496' })}
					x={6}
					y={6}
					width={28}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#A5ADBA', dark: '#738496' })}
					x={6}
					y={10}
					width={28}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#A5ADBA', dark: '#738496' })}
					x={6}
					y={29}
					width={28}
					height={1}
					rx={0.5}
				/>
				<rect
					fill={iconThemed({ light: '#A5ADBA', dark: '#738496' })}
					x={6}
					y={33}
					width={16}
					height={1}
					rx={0.5}
				/>
				<rect
					stroke={iconThemed({ light: '#4C9AFF', dark: '#0C66E4' })}
					strokeWidth={0.5}
					fill={iconThemed({ light: '#DEEBFF', dark: '#09326C' })}
					x={6.25}
					y={14.25}
					width={12.5}
					height={11.5}
					rx={1}
				/>
				<rect
					stroke={iconThemed({ light: '#4C9AFF', dark: '#0C66E4' })}
					strokeWidth={0.5}
					fill={iconThemed({ light: '#DEEBFF', dark: '#09326C' })}
					x={21.25}
					y={14.25}
					width={12.5}
					height={11.5}
					rx={1}
				/>
			</g>
		</svg>
	);
}
