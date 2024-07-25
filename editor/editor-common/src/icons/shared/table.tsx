/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { useIconThemed } from '../../quick-insert/use-icon-themed';

export default function IconTable() {
	const { iconThemed } = useIconThemed();
	const cellBackgroundColour = iconThemed({ light: '#FFF', dark: '#1D2125' });
	const headerBackgroundColour = iconThemed({
		light: '#DFE1E6',
		dark: '#5A6977',
	});
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<g stroke={iconThemed({ light: '#C1C7D0', dark: '#454F59' })}>
					<path fill={cellBackgroundColour} d="M20 16h14v8H20z" />
					<path d="M20 8h13a1 1 0 011 1v7H20V8z" fill={headerBackgroundColour} />
					<path d="M20 24h14v7a1 1 0 01-1 1H20v-8zM6 16h14v8H6z" fill={cellBackgroundColour} />
					<path d="M7 8h13v8H6V9a1 1 0 011-1z" fill={headerBackgroundColour} />
					<path d="M6 24h14v8H7a1 1 0 01-1-1v-7z" fill={cellBackgroundColour} />
				</g>
			</g>
		</svg>
	);
}
