import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const UiElementIconGlyph = (props: CustomGlyphProps) => (
	// TODO replace with custom glyph
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
		<mask id="path-1-inside-1_1403_23012" fill="white">
			<rect x="2.83353" y="13.6489" width="6.97358" height="7.36887" rx="1" />
		</mask>
		<rect
			fill="none"
			x="2.83353"
			y="13.6489"
			width="6.97358"
			height="7.36887"
			rx="1"
			stroke="currentColor"
			strokeWidth="3.2"
			mask="url(#path-1-inside-1_1403_23012)"
		/>
		<mask id="path-2-inside-2_1403_23012" fill="white">
			<rect x="2.83353" y="3.01807" width="18.5455" height="8.59702" rx="1" />
		</mask>
		<rect
			fill="none"
			x="2.83353"
			y="3.01807"
			width="18.5455"
			height="8.59702"
			rx="1"
			stroke="currentColor"
			strokeWidth="3.2"
			mask="url(#path-2-inside-2_1403_23012)"
		/>
		<mask id="path-3-inside-3_1403_23012" fill="white">
			<rect x="11.5089" y="13.6489" width="9.87006" height="7.36887" rx="1" />
		</mask>
		<rect
			fill="none"
			x="11.5089"
			y="13.6489"
			width="9.87006"
			height="7.36887"
			rx="1"
			stroke="currentColor"
			strokeWidth="3.2"
			mask="url(#path-3-inside-3_1403_23012)"
		/>
	</svg>
);

/**
 * __UiElementIcon__
 */
const UiElementIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={UiElementIconGlyph}
	/>
);

export default UiElementIcon;
