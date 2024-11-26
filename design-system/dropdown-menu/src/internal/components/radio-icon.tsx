import React from 'react';

import SVGIcon from '@atlaskit/icon/svg';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400, N10, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * __Radio icon__
 *
 * Used to visually represent the selected state in DropdownItemRadio
 *
 * @internal
 */
const RadioIcon = ({ checked }: { checked: boolean }) => {
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
				{
					// eslint-disable-next-line @atlaskit/platform/no-preconditioning, @atlaskit/platform/ensure-feature-flag-prefix
					fg('platform-visual-refresh-icons') && fg('platform-icon-control-migration') ? (
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
					)
				}
			</g>
		</SVGIcon>
	);
};

export default RadioIcon;
