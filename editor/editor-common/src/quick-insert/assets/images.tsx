import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconImages() {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40}>
			<defs></defs>
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<g transform="translate(4 9)" fillRule="nonzero">
					<rect
						fill={iconThemed({ light: '#EBB800', dark: '#09326C' })}
						width={32}
						height={24}
						rx={1}
					/>
					<path fill={iconThemed({ light: '#F7F8F9', dark: '#161A1D' })} d="M4 4h24v16H4z" />
					<path
						fill={iconThemed({ light: '#09326C', dark: '#09326C' })}
						d="M6.351 18.062l5.594-6.017 5.594 6.017z"
					/>
					<path
						fill={iconThemed({ light: '#0065FF', dark: '#0055CC' })}
						d="M9.341 18.062l8.198-8.818 8.198 8.818z"
					/>
					<ellipse
						fill={iconThemed({ light: '#F88A0D', dark: '#B85C00' })}
						cx={9}
						cy={9.028}
						rx={2}
						ry={2.028}
					/>
				</g>
			</g>
		</svg>
	);
}
