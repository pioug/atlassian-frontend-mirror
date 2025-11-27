import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const OpenFolderIconGlyph = (props: CustomGlyphProps) => (
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
		<path
			d="M5.659 20C4.91228 20 4.23261 19.5847 3.88908 18.9314L3.8207 18.7878L1.67785 13.7878C1.24274 12.7726 1.71304 11.5968 2.7283 11.1617C2.92746 11.0764 3.13883 11.0241 3.35409 11.0066L3.51614 11H3.99862L3.9996 6C3.9996 4.94564 4.81548 4.08183 5.85034 4.00549L5.9996 4H9.9996C10.2206 4 10.4341 4.07316 10.6076 4.20608L10.7067 4.29289L12.4146 6H17.9996C19.054 6 19.9178 6.81588 19.9941 7.85074L19.9996 8V18C19.9996 19.1046 19.1042 20 17.9996 20H5.659ZM13.6808 13H3.5156L5.659 18H16.4826L14.6 13.6061C14.4739 13.3119 14.2173 13.1005 13.9149 13.0277L13.7995 13.007L13.6808 13ZM9.5846 6H5.9996L5.99863 11H13.6808C14.8142 11 15.8446 11.6379 16.3539 12.638L16.4382 12.8182L17.9986 16.46L17.9996 8H11.9996C11.7786 8 11.5651 7.92684 11.3916 7.79392L11.2925 7.70711L9.5846 6Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __OpenFolderIcon__
 */
const OpenFolderIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
	...props
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={OpenFolderIconGlyph}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

export default OpenFolderIcon;
