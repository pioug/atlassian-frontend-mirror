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
 * __Radio icon__
 *
 * Used to visually represent the selected state in DropdownItemRadio
 *
 * @internal
 */
const RadioIcon = ({
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
					d="M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8Z"
					fill={getFillColor(checked, disabled)}
					stroke={getStrokeColor(checked, disabled)}
				/>
				<circle cx="8" cy="8" r="3" fill={checked ? token('color.icon.inverse') : 'transparent'} />
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
