import React from 'react';

import type { SVGProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

export const ContextualToolbarIcon = (props: SVGProps) => {
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
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M14 8.75H2V7.25H14V8.75Z"
				fill="currentColor"
			/>
		</svg>
	);
};
