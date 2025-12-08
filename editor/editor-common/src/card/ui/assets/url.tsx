/* eslint-disable @atlaskit/design-system/no-custom-icons */
import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

const IconUrlGlyph = (props: CustomGlyphProps) => {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			<rect x="6" y="15" width="20" height="2" rx="1" fill="currentColor" />
		</svg>
	);
};

export const IconUrl = (props: IconProps): React.JSX.Element => {
	return fg('platform-custom-icon-migration') ? (
		<IconUrlGlyph
			aria-label={props.label}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '24px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '24px',
			}}
		/>
	) : (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Icon glyph={IconUrlGlyph} {...props} />
	);
};
