import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const AzureIconGlyph = (props: CustomGlyphProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M8.3345 1.636H14.844L8.0865 21.6577C8.01705 21.8635 7.88482 22.0423 7.70844 22.1689C7.53205 22.2956 7.32039 22.3637 7.10325 22.3638H2.03725C1.87272 22.3638 1.71056 22.3246 1.56417 22.2495C1.41779 22.1744 1.29138 22.0656 1.19542 21.9319C1.09945 21.7983 1.03669 21.6437 1.01231 21.481C0.987939 21.3183 1.00266 21.1521 1.05525 20.9963L7.351 2.342C7.42042 2.13618 7.55267 1.95732 7.7291 1.83062C7.90554 1.70392 8.11728 1.63576 8.3345 1.63575V1.636Z"
			fill="url(#paint0_linear_2046_29423)"
		/>
		<path
			d="M17.7938 15.0653H7.47125C7.37528 15.0651 7.28151 15.0939 7.20214 15.1479C7.12278 15.2018 7.0615 15.2784 7.02629 15.3677C6.99108 15.457 6.98357 15.5548 7.00475 15.6484C7.02592 15.742 7.0748 15.8271 7.145 15.8925L13.778 22.0835C13.9711 22.2636 14.2254 22.3638 14.4895 22.3638H20.3345L17.7938 15.0653Z"
			fill="#0078D4"
		/>
		<path
			d="M8.3345 1.636C8.11491 1.63516 7.90081 1.70455 7.72346 1.83404C7.54612 1.96353 7.41482 2.14634 7.34875 2.35575L1.063 20.9792C1.00687 21.1357 0.98925 21.3034 1.01163 21.4681C1.034 21.6328 1.09572 21.7897 1.19156 21.9255C1.2874 22.0613 1.41453 22.172 1.56222 22.2483C1.7099 22.3246 1.87378 22.3642 2.04 22.3637H7.23675C7.4303 22.3292 7.6112 22.2438 7.76098 22.1165C7.91075 21.9891 8.02403 21.8242 8.08925 21.6387L9.34275 17.9445L13.8203 22.1207C14.0079 22.2759 14.2433 22.3618 14.4868 22.3637H20.31L17.756 15.0653L10.3108 15.067L14.8675 1.636H8.3345Z"
			fill="url(#paint1_linear_2046_29423)"
		/>
		<path
			d="M16.6488 2.341C16.5794 2.13551 16.4474 1.95695 16.2712 1.83047C16.095 1.70399 15.8836 1.63598 15.6668 1.636H8.412C8.62886 1.63601 8.84026 1.70405 9.01642 1.83052C9.19259 1.95699 9.32464 2.13553 9.394 2.341L15.69 20.996C15.7426 21.1519 15.7574 21.3181 15.733 21.4809C15.7087 21.6436 15.6459 21.7982 15.55 21.9319C15.454 22.0656 15.3276 22.1745 15.1812 22.2497C15.0348 22.3248 14.8726 22.364 14.708 22.364H21.963C22.1275 22.364 22.2897 22.3247 22.4361 22.2496C22.5825 22.1744 22.7088 22.0655 22.8048 21.9318C22.9007 21.7982 22.9635 21.6436 22.9878 21.4808C23.0121 21.3181 22.9974 21.1519 22.9448 20.996L16.6488 2.341Z"
			fill="url(#paint2_linear_2046_29423)"
		/>
		<defs>
			<linearGradient
				id="paint0_linear_2046_29423"
				x1="10.707"
				y1="3.172"
				x2="3.94675"
				y2="23.1435"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#114A8B" />
				<stop offset="1" stopColor="#0669BC" />
			</linearGradient>
			<linearGradient
				id="paint1_linear_2046_29423"
				x1="12.8188"
				y1="12.4793"
				x2="11.255"
				y2="13.008"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopOpacity="0.3" />
				<stop offset="0.071" stopOpacity="0.2" />
				<stop offset="0.321" stopOpacity="0.1" />
				<stop offset="0.623" stopOpacity="0.05" />
				<stop offset="1" stopOpacity="0" />
			</linearGradient>
			<linearGradient
				id="paint2_linear_2046_29423"
				x1="11.9588"
				y1="2.5895"
				x2="19.3795"
				y2="22.3598"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#3CCBF4" />
				<stop offset="1" stopColor="#2892DF" />
			</linearGradient>
		</defs>
	</svg>
);

/**
 * __AzureIcon__
 */
const AzureIcon = ({
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
		glyph={AzureIconGlyph}
	/>
);

export default AzureIcon;
