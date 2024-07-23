/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import PrimitiveSVGIcon from '@atlaskit/icon/svg';

import type { Size } from '../types';

function getIcon(isIndeterminate: boolean, isChecked: boolean) {
	if (isIndeterminate) {
		return <rect fill="inherit" x="8" y="11" width="8" height="2" rx="1" />;
	}

	if (isChecked) {
		return (
			<path
				d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"
				fill="inherit"
			/>
		);
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
	size: Size;
	isIndeterminate: boolean;
	isChecked: boolean;
}>(({ size, isIndeterminate, isChecked }) => {
	const icon = useMemo(() => getIcon(isIndeterminate, isChecked), [isIndeterminate, isChecked]);

	return (
		<PrimitiveSVGIcon
			label=""
			size={size}
			primaryColor="var(--checkbox-background-color)"
			secondaryColor="var(--checkbox-tick-color)"
		>
			<g fillRule="evenodd">
				<rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2" />
				{icon}
			</g>
		</PrimitiveSVGIcon>
	);
});

export default CheckboxIcon;
