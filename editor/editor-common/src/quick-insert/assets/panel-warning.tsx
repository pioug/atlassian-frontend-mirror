import React from 'react';

import { token } from '@atlaskit/tokens';

import { useIconThemed } from '../use-icon-themed';

export default function IconPanelWarning() {
	const { iconThemed } = useIconThemed();
	return (
		<svg focusable="false" aria-hidden width={40} height={40} viewBox="0 0 40 40">
			<g fill="none" fillRule="evenodd">
				<path fill={iconThemed({ light: '#FFF', dark: '#161A1D' })} d="M0 0h40v40H0z" />
				<rect
					fill={iconThemed({
						light: token('color.background.accent.yellow.subtlest'),
						dark: token('color.background.accent.yellow.subtlest'),
					})}
					x={8}
					y={12}
					width={32}
					height={16}
					rx={1}
				/>
				<path
					d="M16.847 16.83l2.808 5.73a1 1 0 01-.898 1.44h-6.514a1 1 0 01-.898-1.44l2.808-5.73a1.5 1.5 0 012.694 0zm-1.347.46a.568.568 0 00-.564.635l.278 2.32a.288.288 0 00.572 0l.278-2.32a.568.568 0 00-.564-.635zm0 5.035c.318 0 .576-.293.576-.656 0-.362-.258-.656-.576-.656-.318 0-.576.294-.576.656 0 .363.258.656.576.656z"
					fill={iconThemed({
						light: token('color.icon.warning'),
						dark: token('color.icon.warning'),
					})}
				/>
			</g>
		</svg>
	);
}
