/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag jsx
 */
import React from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

const styles = cssMap({
	svg: {
		pointerEvents: 'none',
	},
});

function getFillColor(checked: boolean, disabled?: boolean) {
	if (disabled) {
		if (checked) {
			return token('color.icon.disabled');
		} else {
			return token('color.background.input');
		}
	}
	if (checked) {
		return token('color.background.selected.bold');
	}
	return token('color.background.input');
}

function getStrokeColor(checked: boolean, disabled?: boolean) {
	if (disabled) {
		return token('color.border.disabled');
	}
	if (checked) {
		return token('color.border.selected');
	}
	return token('color.border.input');
}

/**
 * __Checkbox icon__
 *
 * Used to visually represent the selected state in DropdownItemCheckbox
 *
 * @internal
 */
const CheckboxIcon = ({
	checked,
	disabled,
}: {
	checked: boolean;
	disabled?: boolean;
}): React.JSX.Element => {
	if (fg('platform-dst-new-menu')) {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" css={styles.svg}>
				<path
					d="M3 1.5H13C13.8284 1.5 14.5 2.17157 14.5 3V13C14.5 13.8284 13.8284 14.5 13 14.5H3C2.17157 14.5 1.5 13.8284 1.5 13V3C1.5 2.17157 2.17157 1.5 3 1.5Z"
					fill={getFillColor(checked, disabled)}
					stroke={getStrokeColor(checked, disabled)}
				/>
				<path
					d="M12.3223 5.4803L11.1699 4.52002L6.74609 9.82862L4.82225 7.52002L3.66992 8.4803L6.16992 11.4803C6.31242 11.6513 6.5235 11.7502 6.74609 11.7502C6.96867 11.7502 7.17976 11.6513 7.32225 11.4803L12.3223 5.4803Z"
					fillRule="evenodd"
					clipRule="evenodd"
					fill={checked ? token('color.icon.inverse') : 'transparent'}
				/>
			</svg>
		);
	}

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
				<rect
					stroke={checked ? token('color.border.selected') : token('color.border.input')}
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
