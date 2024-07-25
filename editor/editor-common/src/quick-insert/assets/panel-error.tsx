import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconPanelError() {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({ light: '#FFEBE6', dark: '#601D16' })}
					x={8}
					y={12}
					width={32}
					height={16}
					rx={1}
				/>
				<path
					d="M16.743 19.964l1.06-1.06a.5.5 0 00-.707-.707l-1.06 1.06-1.061-1.06a.5.5 0 00-.707.707l1.06 1.06-1.06 1.061a.5.5 0 10.707.707l1.06-1.06 1.061 1.06a.5.5 0 10.707-.707l-1.06-1.06zM16 24a4 4 0 110-8 4 4 0 010 8z"
					fill={iconThemed({ light: '#DE350B', dark: '#F97362' })}
				/>
			</g>
		</svg>
	);
}
