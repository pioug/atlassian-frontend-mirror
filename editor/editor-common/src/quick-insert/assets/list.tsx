import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconList() {
	const { iconThemed } = useIconThemed();
	const dotColour = iconThemed({ light: '#6C798F', dark: '#5A6977' });
	const lineColour = iconThemed({ light: '#C1C7D0', dark: '#454F59' });

	return (
		<svg focusable="false" aria-hidden width={40} height={40}>
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<g transform="translate(8 10)">
					<rect fill={dotColour} width={4} height={4} rx={2} />
					<rect fill={lineColour} x={7} y={9} width={17} height={2} rx={1} />
					<rect fill={lineColour} x={7} y={1} width={17} height={2} rx={1} />
					<rect fill={lineColour} x={7} y={17} width={17} height={2} rx={1} />
					<rect fill={dotColour} y={8} width={4} height={4} rx={2} />
					<rect fill={dotColour} y={16} width={4} height={4} rx={2} />
				</g>
			</g>
		</svg>
	);
}
