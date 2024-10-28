import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const PeopleGroupIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="25"
		height="25"
		viewBox="0 0 25 25"
		fill="none"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M12.5234 11.2999C15.0087 11.2999 17.0234 13.3146 17.0234 15.7999V18.2999C17.0234 19.4045 16.128 20.2999 15.0234 20.2999H9.02344C7.91887 20.2999 7.02344 19.4045 7.02344 18.2999V15.7999C7.02344 13.3146 9.03816 11.2999 11.5234 11.2999H12.5234ZM18.5234 11.2999L18.7353 11.3048C21.0499 11.4121 22.9078 13.2679 23.0182 15.5817L23.0234 15.7999V18.2999L23.018 18.4492C22.9454 19.4323 22.1622 20.2178 21.1801 20.2938L21.0234 20.2999H19.0234L18.9068 20.2932C18.4095 20.2354 18.0234 19.8127 18.0234 19.2999C18.0234 18.7871 18.4095 18.3644 18.9068 18.3066L19.0234 18.2999H21.0234V15.7999L21.0181 15.6355C20.937 14.3858 19.9376 13.3863 18.6878 13.3052L18.5234 13.2999H18.0234L17.9068 13.2932C17.4095 13.2354 17.0234 12.8127 17.0234 12.2999C17.0234 11.7871 17.4095 11.3644 17.9068 11.3066L18.0234 11.2999H18.5234ZM6.02344 11.2999C6.57572 11.2999 7.02344 11.7476 7.02344 12.2999C7.02344 12.8127 6.6374 13.2354 6.14006 13.2932L6.02344 13.2999H5.52344C4.19795 13.2999 3.1134 14.3314 3.02876 15.6355L3.02344 15.7999V18.2999H5.02344C5.57572 18.2999 6.02344 18.7476 6.02344 19.2999C6.02344 19.8127 5.6374 20.2354 5.14006 20.2932L5.02344 20.2999H3.02344C1.96908 20.2999 1.10527 19.484 1.02892 18.4492L1.02344 18.2999V15.7999C1.02344 13.3856 2.92467 11.4154 5.3116 11.3048L5.52344 11.2999H6.02344ZM12.5234 13.2999H11.5234C10.1427 13.2999 9.02344 14.4192 9.02344 15.7999V18.2999H15.0234V15.7999C15.0234 14.4192 13.9041 13.2999 12.5234 13.2999ZM12.0234 3.29989C13.9564 3.29989 15.5234 4.86689 15.5234 6.79989C15.5234 8.73289 13.9564 10.2999 12.0234 10.2999C10.0904 10.2999 8.52344 8.73289 8.52344 6.79989C8.52344 4.86689 10.0904 3.29989 12.0234 3.29989ZM7.42909 3.59394C7.93494 3.81561 8.16532 4.40537 7.94365 4.91122C7.73782 5.38094 7.2146 5.61313 6.73589 5.46643L6.62637 5.42578C6.06501 5.17979 5.40352 5.29857 4.96272 5.73937C4.37694 6.32515 4.37694 7.2749 4.96272 7.86069C5.36964 8.2676 5.96452 8.40009 6.49516 8.22456L6.62633 8.17424C7.13217 7.95255 7.72195 8.1829 7.94363 8.68874C8.16532 9.19458 7.93497 9.78436 7.42914 10.006C6.11941 10.58 4.57667 10.3031 3.54851 9.2749C2.18167 7.90806 2.18167 5.69199 3.54851 4.32515C4.57662 3.29704 6.11939 3.02002 7.42909 3.59394ZM16.6336 3.59394C17.9433 3.02002 19.4861 3.29704 20.5142 4.32515C21.881 5.69199 21.881 7.90806 20.5142 9.2749C19.486 10.3031 17.9433 10.58 16.6335 10.006C16.1277 9.78436 15.8974 9.19458 16.119 8.68874C16.3249 8.21903 16.8481 7.98686 17.3268 8.13359L17.5675 8.22456C18.0982 8.40009 18.693 8.2676 19.1 7.86069C19.6857 7.2749 19.6857 6.32515 19.1 5.73937C18.6959 5.3353 18.1064 5.20182 17.5786 5.37186L17.3268 5.46643C16.8481 5.61313 16.3249 5.38094 16.119 4.91122C15.8974 4.40537 16.1277 3.81561 16.6336 3.59394ZM12.0234 5.29989C11.195 5.29989 10.5234 5.97146 10.5234 6.79989C10.5234 7.62832 11.195 8.29989 12.0234 8.29989C12.8519 8.29989 13.5234 7.62832 13.5234 6.79989C13.5234 5.97146 12.8519 5.29989 12.0234 5.29989Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __PeopleGroupIcon__
 */
const PeopleGroupIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={PeopleGroupIconGlyph}
	/>
);

export default PeopleGroupIcon;
