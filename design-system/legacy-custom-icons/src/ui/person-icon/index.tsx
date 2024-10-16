import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const PersonIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			d="M13.523 11.3a4.504 4.504 0 0 1 4.478 4.063l.017.218.005.219v2.5c0 .964-.685 1.78-1.66 1.966l-.165.025-.175.009h-8c-.964 0-1.78-.686-1.966-1.66l-.025-.166-.009-.174v-2.5a4.504 4.504 0 0 1 4.064-4.478l.217-.017.22-.005h3Zm0 2H10.55l-.165.003a2.5 2.5 0 0 0-2.356 2.332l-.006.165-.001 2.442.001.058 7.943.002.057-.002v-2.473l-.003-.165a2.5 2.5 0 0 0-2.332-2.357l-.165-.005Zm-1.5-10a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
		/>
	</svg>
);

/**
 * __PersonIcon__
 */
const PersonIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={PersonIconGlyph}
	/>
);

export default PersonIcon;
