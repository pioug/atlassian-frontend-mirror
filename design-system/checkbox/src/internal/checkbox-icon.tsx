/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useMemo } from 'react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

function getIcon(isIndeterminate: boolean, isChecked: boolean) {
	if (isIndeterminate) {
		return (
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.75 12.75H16.25V11.25H7.75V12.75Z"
				fill="inherit"
			/>
		);
	}

	if (isChecked) {
		return (
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.3262 9.48011L15.1738 8.51984L10.75 13.8284L8.82616 11.5198L7.67383 12.4801L10.1738 15.4801C10.3163 15.6511 10.5274 15.75 10.75 15.75C10.9726 15.75 11.1837 15.6511 11.3262 15.4801L16.3262 9.48011Z"
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
	isIndeterminate: boolean;
	isChecked: boolean;
}>(({ isIndeterminate, isChecked }) => {
	const icon = useMemo(() => getIcon(isIndeterminate, isChecked), [isIndeterminate, isChecked]);

	return (
		<svg
			width={24}
			height={24}
			viewBox="0 0 24 24"
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				color: 'var(--checkbox-background-color)',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				fill: 'var(--checkbox-tick-color)',
			}}
			css={svgStyles}
			role="presentation"
		>
			<g fillRule="evenodd">
				<rect fill="currentColor" x="5.5" y="5.5" width="13" height="13" rx="1.5" />
				{icon}
			</g>
		</svg>
	);
});

export default CheckboxIcon;
