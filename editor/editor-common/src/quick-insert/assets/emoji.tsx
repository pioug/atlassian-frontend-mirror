import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconEmoji() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<path
					d="M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8s12 5.373 12 12"
					fill={iconThemed({ light: '#FFCC4D', dark: '#946F00' })}
				/>
				<path
					d="M20 22c-2.415 0-4.018-.281-6-.667-.453-.087-1.333 0-1.333 1.334 0 2.666 3.063 6 7.333 6s7.333-3.334 7.333-6c0-1.334-.88-1.422-1.333-1.334-1.982.386-3.585.667-6 .667"
					fill={iconThemed({ light: '#664500', dark: '#43290F' })}
				/>
				<path
					d="M14 22.667s2 .666 6 .666 6-.666 6-.666-1.333 2.666-6 2.666-6-2.666-6-2.666"
					fill={iconThemed({ light: '#FFF', dark: '#8696A7' })}
				/>
				<path
					d="M17.667 17c0 1.29-.746 2.333-1.667 2.333-.92 0-1.667-1.044-1.667-2.333 0-1.289.746-2.333 1.667-2.333.92 0 1.667 1.044 1.667 2.333m8 0c0 1.29-.746 2.333-1.667 2.333-.92 0-1.667-1.044-1.667-2.333 0-1.289.746-2.333 1.667-2.333.92 0 1.667 1.044 1.667 2.333"
					fill={iconThemed({ light: '#664500', dark: '#43290F' })}
				/>
			</g>
		</svg>
	);
}
