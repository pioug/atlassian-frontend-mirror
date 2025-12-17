/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag jsx
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400, N10, N100 } from '@atlaskit/theme/colors';
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
				{fg('platform-visual-refresh-icons') ? (
					<>
						<circle
							cx="12"
							cy="12"
							r="7.5"
							fill="currentColor"
							stroke={
								checked ? token('color.border.selected', B400) : token('color.border.input', N100)
							}
							strokeWidth="1"
						/>
						<circle cx="12" cy="12" r="3" fill="inherit" />
					</>
				) : (
					<>
						<circle
							fill="currentColor"
							cx="12"
							cy="12"
							r="6"
							stroke={
								checked ? token('color.border.selected', B400) : token('color.border.input', N100)
							}
							strokeWidth={1}
						/>
						<circle fill="inherit" cx="12" cy="12" r="2" />
					</>
				)}
			</g>
		</svg>
	);
};

export default RadioIcon;
