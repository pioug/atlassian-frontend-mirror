/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag jsx
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

/**
 * __Radio icon__
 *
 * Used to visually represent the selected state in DropdownItemRadio
 *
 * @internal
 */
const RadioIcon = ({ checked }: { checked: boolean }): React.JSX.Element => {
	return (
		<svg
			width={24}
			height={24}
			viewBox="0 0 24 24"
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				color: checked ? token('color.background.selected.bold') : token('color.background.input'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				fill: checked ? token('color.icon.inverse') : 'transparent',
			}}
			css={svgStyles}
			role="presentation"
		>
			<g fillRule="evenodd">
				<circle
					cx="12"
					cy="12"
					r="7.5"
					fill="currentColor"
					stroke={checked ? token('color.border.selected') : token('color.border.input')}
					strokeWidth="1"
				/>
				<circle cx="12" cy="12" r="3" fill="inherit" />
			</g>
		</svg>
	);
};

export default RadioIcon;
