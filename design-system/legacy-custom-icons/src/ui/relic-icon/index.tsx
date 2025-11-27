import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const RelicIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="26"
		height="28"
		viewBox="0 0 26 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M0 8C0 3.58172 3.58172 0 8 0H17.352C21.7703 0 25.352 3.58172 25.352 8V20C25.352 24.4183 21.7703 28 17.352 28H8C3.58172 28 0 24.4183 0 20V8Z"
			fill="#A1BDD9"
			fillOpacity="0.08"
		/>
		<g clipPath="url(#clip0_504_8187)">
			<path
				d="M18.0141 10.9246L21.352 8.99942V19.0006L12.676 23.9991V20.1528L18.0141 17.0774V10.9246Z"
				fill="#00AC69"
			/>
			<path
				d="M12.676 7.84721L7.33788 10.9246L4 8.99942L12.676 4.00093L21.352 8.99942L18.0141 10.9246L12.676 7.84721Z"
				fill="#1CE783"
			/>
			<path
				d="M9.33812 15.9252L4 12.8478V8.99942L12.676 14V23.9991L9.33812 22.078V15.9252Z"
				fill="#1D252C"
			/>
		</g>
		<defs>
			<clipPath id="clip0_504_8187">
				<rect width="17.352" height="20" fill="white" transform="translate(4 4)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __RelicIcon__
 */
const RelicIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={RelicIconGlyph}
	/>
);

export default RelicIcon;
