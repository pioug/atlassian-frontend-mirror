/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag jsx
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { B400, N10, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

/**
 * __Checkbox icon__
 *
 * Used to visually represent the selected state in DropdownItemCheckbox
 *
 * @internal
 */
const CheckboxIcon = ({ checked }: { checked: boolean }): React.JSX.Element => {
	return (
		<svg
			width={24}
			height={24}
			viewBox="0 0 24 24"
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				color: checked
					? token('color.background.selected.bold', B400)
					: token('color.background.input', N10),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				fill: checked ? token('color.icon.inverse', N10) : 'transparent',
			}}
			css={svgStyles}
			role="presentation"
		>
			<g fillRule="evenodd">
				<rect
					stroke={
						checked ? token('color.border.selected', B400) : token('color.border.input', N100)
					}
					x="5.5"
					y="5.5"
					width="13"
					height="13"
					rx="1.5"
					fill="currentColor"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.3262 9.48011L15.1738 8.51984L10.75 13.8284L8.82616 11.5198L7.67383 12.4801L10.1738 15.4801C10.3163 15.6511 10.5274 15.75 10.75 15.75C10.9726 15.75 11.1837 15.6511 11.3262 15.4801L16.3262 9.48011Z"
					fill="inherit"
				/>
			</g>
		</svg>
	);
};

export default CheckboxIcon;
