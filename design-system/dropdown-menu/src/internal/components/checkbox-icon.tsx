import React from 'react';

import SVGIcon from '@atlaskit/icon/svg';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400, N10, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * __Checkbox icon__
 *
 * Used to visually represent the selected state in DropdownItemCheckbox
 *
 * @internal
 */
const CheckboxIcon = ({ checked }: { checked: boolean }): React.JSX.Element => {
	return (
		<SVGIcon
			label=""
			size="medium"
			primaryColor={
				checked
					? token('color.background.selected.bold', B400)
					: token('color.background.input', N10)
			}
			secondaryColor={checked ? token('color.icon.inverse', N10) : 'transparent'}
		>
			<g fillRule="evenodd">
				{fg('platform-visual-refresh-icons') ? (
					<>
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
					</>
				) : (
					<>
						<rect
							fill="currentColor"
							x="6"
							y="6"
							width="12"
							height="12"
							rx="2"
							stroke={
								checked ? token('color.border.selected', B400) : token('color.border.input', N100)
							}
							strokeWidth={1}
						/>
						<path
							d="M9.707 11.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 10-1.414-1.414L11 12.586l-1.293-1.293z"
							fill="inherit"
						/>
					</>
				)}
			</g>
		</SVGIcon>
	);
};

export default CheckboxIcon;
