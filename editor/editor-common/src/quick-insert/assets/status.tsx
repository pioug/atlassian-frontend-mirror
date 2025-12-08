import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconStatus(): React.JSX.Element {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<g transform="translate(5 11)">
					<rect
						fill={iconThemed({ light: '#B3D4FF', dark: '#09326C' })}
						width={14}
						height={5}
						rx={1}
					/>
					<rect
						fill={iconThemed({ light: '#0065FF', dark: '#1D7AFC' })}
						x={2}
						y={2}
						width={10}
						height={1}
						rx={0.5}
					/>
				</g>
				<g transform="translate(5 18)">
					<rect
						fill={iconThemed({ light: '#C3F8DF', dark: '#164B35' })}
						width={14}
						height={5}
						rx={1}
					/>
					<rect
						fill={iconThemed({ light: '#36B37E', dark: '#22A06B' })}
						x={2}
						y={2}
						width={10}
						height={1}
						rx={0.5}
					/>
				</g>
				<g transform="translate(5 25)">
					<rect
						fill={iconThemed({ light: '#DFE1E6', dark: '#2C333A' })}
						width={14}
						height={5}
						rx={1}
					/>
					<rect
						fill={iconThemed({ light: '#8993A4', dark: '#5A6977' })}
						x={2}
						y={2}
						width={10}
						height={1}
						rx={0.5}
					/>
				</g>
				<g transform="translate(21 25)">
					<rect
						fill={iconThemed({ light: '#FFD3C8', dark: '#601D16' })}
						width={14}
						height={5}
						rx={1}
					/>
					<rect
						fill={iconThemed({ light: '#FF5230', dark: '#F35844' })}
						x={2}
						y={2}
						width={10}
						height={1}
						rx={0.5}
					/>
				</g>
				<g transform="translate(21 11)">
					<rect
						fill={iconThemed({ light: '#EAE6FF', dark: '#352C63' })}
						width={14}
						height={5}
						rx={1}
					/>
					<rect
						fill={iconThemed({ light: '#8777D9', dark: '#8270DB' })}
						x={2}
						y={2}
						width={10}
						height={1}
						rx={0.5}
					/>
				</g>
				<g transform="translate(21 18)">
					<rect
						fill={iconThemed({ light: '#FFF0B3', dark: '#5F3811' })}
						width={14}
						height={5}
						rx={1}
					/>
					<rect
						fill={iconThemed({ light: '#FF991F', dark: '#D19D00' })}
						x={2}
						y={2}
						width={10}
						height={1}
						rx={0.5}
					/>
				</g>
			</g>
		</svg>
	);
}
