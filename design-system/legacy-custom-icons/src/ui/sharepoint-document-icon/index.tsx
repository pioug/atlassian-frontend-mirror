import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const SharepointDocumentIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g>
			<g clipPath="url(#clip0_271_181625)">
				<path
					d="M21.1472 3H7.50344C7.03258 3 6.65088 3.37303 6.65088 3.83318V7.54545L14.5579 9.81818L21.9997 7.54545V3.83318C21.9997 3.37303 21.618 3 21.1472 3Z"
					fill="#41A5EE"
				/>
				<path
					d="M21.9997 7.54541H6.65088V12.0909L14.5579 13.4545L21.9997 12.0909V7.54541Z"
					fill="#2B7CD3"
				/>
				<path
					d="M6.65088 12.0908V16.6363L14.0927 17.5454L21.9997 16.6363V12.0908H6.65088Z"
					fill="#185ABD"
				/>
				<path
					d="M7.50344 21.1819H21.1472C21.618 21.1819 21.9997 20.8089 21.9997 20.3487V16.6365H6.65088V20.3487C6.65088 20.8089 7.03258 21.1819 7.50344 21.1819Z"
					fill="#103F91"
				/>
				<path
					opacity="0.1"
					d="M12.3099 6.63647H6.65088V18.0001H12.3099C12.7802 17.9986 13.161 17.6265 13.1625 17.1669V7.46966C13.161 7.01013 12.7802 6.63797 12.3099 6.63647Z"
					fill="black"
				/>
				<path
					opacity="0.2"
					d="M11.8448 7.09082H6.65088V18.4545H11.8448C12.315 18.453 12.6959 18.0808 12.6974 17.6213V7.924C12.6959 7.46447 12.315 7.09232 11.8448 7.09082Z"
					fill="black"
				/>
				<path
					opacity="0.2"
					d="M11.8448 7.09082H6.65088V17.5454H11.8448C12.315 17.5439 12.6959 17.1717 12.6974 16.7122V7.924C12.6959 7.46447 12.315 7.09232 11.8448 7.09082Z"
					fill="black"
				/>
				<path
					opacity="0.2"
					d="M11.3797 7.09082H6.65088V17.5454H11.3797C11.8499 17.5439 12.2307 17.1717 12.2323 16.7122V7.924C12.2307 7.46447 11.8499 7.09232 11.3797 7.09082Z"
					fill="black"
				/>
				<path
					d="M2.85256 7.09082H11.38C11.8509 7.09082 12.2326 7.46385 12.2326 7.924V16.2576C12.2326 16.7178 11.8509 17.0908 11.38 17.0908H2.85256C2.3817 17.0908 2 16.7178 2 16.2576V7.924C2 7.46385 2.3817 7.09082 2.85256 7.09082Z"
					fill="#1a5bb8"
				/>
				<path
					d="M5.49864 13.4809C5.51538 13.6095 5.52654 13.7213 5.53166 13.8172H5.55119C5.55863 13.7263 5.57413 13.6168 5.5977 13.4886C5.62127 13.3604 5.64251 13.2521 5.66142 13.1636L6.55817 9.38268H7.7177L8.64793 13.1068C8.70198 13.3383 8.74067 13.5731 8.76375 13.8095H8.7791C8.79644 13.5804 8.82876 13.3527 8.87585 13.1277L9.61771 9.38086H10.6731L9.3698 14.799H8.13677L7.25305 11.2109C7.22748 11.1077 7.19818 10.9727 7.16608 10.8068C7.13398 10.6408 7.11399 10.5195 7.10608 10.4431H7.09073C7.0805 10.5313 7.06049 10.6622 7.03072 10.8359C7.00096 11.0095 6.97708 11.138 6.95909 11.2213L6.12839 14.7981H4.87443L3.56421 9.38267H4.63862L5.44653 13.1713C5.46468 13.249 5.48189 13.3527 5.49864 13.4809Z"
					fill="white"
				/>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_271_181625">
				<rect width="20" height="18.1818" fill="white" transform="translate(2 3)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __SharepointDocumentIcon__
 */
const SharepointDocumentIcon = ({
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
		glyph={SharepointDocumentIconGlyph}
	/>
);

export default SharepointDocumentIcon;
