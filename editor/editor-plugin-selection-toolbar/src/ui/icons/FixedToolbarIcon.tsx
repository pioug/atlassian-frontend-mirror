import React from 'react';

import type { SVGProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

export const FixedToolbarIcon = (props: SVGProps) => {
	const { primaryColor, label } = props;
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			style={{
				color: primaryColor,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				fill: token('color.background.neutral.subtle'),
			}}
			aria-label={label || undefined}
			role={label ? 'img' : 'presentation'}
		>
			<rect
				x="0.75"
				y="1.00586"
				width="14.5"
				height="13.9879"
				rx="2.25"
				stroke="currentColor"
				stroke-width="1.5"
			/>
			<rect x="4" y="3.75586" width="8" height="1.5" fill="currentColor" />
		</svg>
	);
};
