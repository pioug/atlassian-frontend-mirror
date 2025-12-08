import React from 'react';

import { token } from '@atlaskit/tokens';

import { useIconThemed } from '../use-icon-themed';

export default function IconPanel(): React.JSX.Element {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({
						light: token('color.background.accent.blue.subtlest'),
						dark: token('color.background.accent.blue.subtlest'),
					})}
					x={8}
					y={12}
					width={32}
					height={16}
					rx={1}
				/>
				<path
					d="M12 20a4 4 0 108 0 4 4 0 00-8 0z"
					fill={iconThemed({
						light: token('color.icon.information'),
						dark: token('color.icon.information'),
					})}
					fillRule="nonzero"
				/>
				<rect
					fill={iconThemed({ light: '#FFF', dark: '#09326C' })}
					fillRule="nonzero"
					x={15.556}
					y={19.722}
					width={1}
					height={2.2}
					rx={0.5}
				/>
				<circle
					fill={iconThemed({ light: '#FFF', dark: '#09326C' })}
					fillRule="nonzero"
					cx={16}
					cy={18.444}
					r={1}
				/>
			</g>
		</svg>
	);
}
