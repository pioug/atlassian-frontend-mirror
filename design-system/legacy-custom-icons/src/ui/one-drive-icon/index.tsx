import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const OneDriveIconGlyph = (props: CustomGlyphProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="26"
		width="26"
		viewBox="-1 0 26 26"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g id="OneDrive">
			<rect fill="none" width="24" height="24" />
			<path d="M14.5,15l4.95-4.74A7.5,7.5,0,0,0,5.92,8C6,8,14.5,15,14.5,15Z" fill="#0364BA" />
			<path
				d="M9.15,8.89h0A6,6,0,0,0,6,8H5.92a6,6,0,0,0-4.84,9.43L8.5,16.5l5.69-4.59Z"
				fill="#0078D4"
			/>
			<path
				d="M19.45,10.26h-.32a4.84,4.84,0,0,0-1.94.4h0l-3,1.26L17.5,16l5.92,1.44a4.88,4.88,0,0,0-4-7.18Z"
				fill="#1490DF"
			/>
			<path
				d="M1.08,17.43A6,6,0,0,0,6,20H19.13a4.89,4.89,0,0,0,4.29-2.56l-9.23-5.53Z"
				fill="#28A8EA"
			/>
		</g>
	</svg>
);

/**
 * __OneDriveIcon__
 */
const OneDriveIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={OneDriveIconGlyph}
	/>
);

export default OneDriveIcon;
