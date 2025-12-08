import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconMention(): React.JSX.Element {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<g transform="translate(6 12)">
					<circle fill={iconThemed({ light: '#388BFF', dark: '#0055CC' })} cx={8} cy={8} r={8} />
					<path
						d="M12.875 12.767A6.891 6.891 0 018.02 14.75a6.889 6.889 0 01-4.895-2.026V11.9c0-1.049.873-1.9 1.95-1.9h5.85c1.077 0 1.95.851 1.95 1.9v.867zM8 3a2.874 2.874 0 10-.001 5.748 2.874 2.874 0 000-5.748"
						fill={iconThemed({ light: '#85B8FF', dark: '#388BFF' })}
					/>
					<rect
						fill={iconThemed({ light: '#A4ACB9', dark: '#A4ACB9' })}
						x={19}
						y={3}
						width={12}
						height={1}
						rx={0.5}
					/>
					<rect
						fill={iconThemed({ light: '#A4ACB9', dark: '#A4ACB9' })}
						x={19}
						y={7}
						width={6}
						height={1}
						rx={0.5}
					/>
					<rect
						fill={iconThemed({ light: '#A4ACB9', dark: '#A4ACB9' })}
						x={19}
						y={11}
						width={8}
						height={1}
						rx={0.5}
					/>
				</g>
			</g>
		</svg>
	);
}
