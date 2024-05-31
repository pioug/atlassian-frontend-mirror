import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconPanelNote() {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40}>
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({ light: '#EAE6FF', dark: '#352C63' })}
					x={8}
					y={12}
					width={32}
					height={16}
					rx={1}
				/>
				<path
					d="M13 16h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6a1 1 0 011-1zm1 2a.5.5 0 100 1h2a.5.5 0 100-1h-2zm0 2a.5.5 0 100 1h1a.5.5 0 100-1h-1z"
					fill={iconThemed({ light: '#403294', dark: '#8F7EE7' })}
				/>
			</g>
		</svg>
	);
}
