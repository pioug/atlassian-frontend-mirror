/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useMemo } from 'react';

import { jsx } from '@atlaskit/css';
import PrimitiveSVGIcon from '@atlaskit/icon/svg';
import { fg } from '@atlaskit/platform-feature-flags';

function getIcon(isIndeterminate: boolean, isChecked: boolean) {
	if (isIndeterminate) {
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		if (fg('platform-visual-refresh-icons')) {
			return (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7.75 12.75H16.25V11.25H7.75V12.75Z"
					fill="inherit"
				/>
			);
		} else {
			return <rect fill="inherit" x="8" y="11" width="8" height="2" rx="1" />;
		}
	}

	if (isChecked) {
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		if (fg('platform-visual-refresh-icons')) {
			return (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.3262 9.48011L15.1738 8.51984L10.75 13.8284L8.82616 11.5198L7.67383 12.4801L10.1738 15.4801C10.3163 15.6511 10.5274 15.75 10.75 15.75C10.9726 15.75 11.1837 15.6511 11.3262 15.4801L16.3262 9.48011Z"
					fill="inherit"
				/>
			);
		} else {
			return (
				<path
					d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"
					fill="inherit"
				/>
			);
		}
	}

	// No icon
	return null;
}

/**
 * __Checkbox icon__
 *
 * A checkbox icon is the visual representation of checkbox state,
 * which is shown instead of the native input.
 *
 * @internal
 */
const CheckboxIcon = memo<{
	isIndeterminate: boolean;
	isChecked: boolean;
}>(({ isIndeterminate, isChecked }) => {
	const icon = useMemo(() => getIcon(isIndeterminate, isChecked), [isIndeterminate, isChecked]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-custom-icons
		<PrimitiveSVGIcon
			label=""
			primaryColor="var(--checkbox-background-color)"
			secondaryColor="var(--checkbox-tick-color)"
		>
			<g fillRule="evenodd">
				{
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
					fg('platform-visual-refresh-icons') ? (
						<rect fill="currentColor" x="5.5" y="5.5" width="13" height="13" rx="1.5" />
					) : (
						<rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2" />
					)
				}
				{icon}
			</g>
		</PrimitiveSVGIcon>
	);
});

export default CheckboxIcon;
