import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconPanelSuccess() {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({ light: '#C3F8DF', dark: '#164B35' })}
					x={8}
					y={12}
					width={32}
					height={16}
					rx={1}
				/>
				<path
					d="M15 24a4 4 0 110-8 4 4 0 010 8zm.682-5.482l-1.076 2.055-.772-.695a.5.5 0 00-.668.744l1.25 1.125a.5.5 0 00.777-.14l1.375-2.625a.5.5 0 00-.886-.464z"
					fill={iconThemed({ light: '#00875A', dark: '#2ABB7F' })}
				/>
			</g>
		</svg>
	);
}
