import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconCode() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} fillRule="evenodd">
			<path fill={iconThemed({ light: '#fff', dark: '#161A1D' })} d="M0 0h40v40H0z" />
			<path fill={iconThemed({ light: '#ebecf0', dark: '#2C333A' })} d="M13 6h26v28H13z" />
			<path
				d="M9 6h4v28H9a2 2 0 01-2-2V8a2 2 0 012-2z"
				fill={iconThemed({ light: '#dfe1e6', dark: '#454F59' })}
			/>
			<g fill={iconThemed({ light: '#a5adba', dark: '#8696A7' })}>
				<rect x={9} y={9} width={2} height={1} rx={0.5} />
				<rect x={16} y={9} width={9} height={1} rx={0.5} />
				<rect x={22} y={21} width={9} height={1} rx={0.5} />
				<rect x={22} y={29} width={9} height={1} rx={0.5} />
			</g>
			<g fill={iconThemed({ light: '#4c9aff', dark: '#1D7AFC' })}>
				<rect x={28} y={25} width={9} height={1} rx={0.5} />
				<rect x={16} y={13} width={13} height={1} rx={0.5} />
			</g>
			<g fill={iconThemed({ light: '#ff7452', dark: '#B22515' })}>
				<rect x={16} y={17} width={13} height={1} rx={0.5} />
				<rect x={19} y={25} width={7} height={1} rx={0.5} />
			</g>
			<g fill={iconThemed({ light: '#a5adba', dark: '#8696A7' })}>
				<rect x={9} y={13} width={2} height={1} rx={0.5} />
				<rect x={9} y={17} width={2} height={1} rx={0.5} />
				<rect x={9} y={21} width={2} height={1} rx={0.5} />
				<rect x={9} y={25} width={2} height={1} rx={0.5} />
				<rect x={9} y={29} width={2} height={1} rx={0.5} />
			</g>
		</svg>
	);
}
