import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SlackIconGlyph = (props: CustomGlyphProps) => (
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
			d="m6.8322 14.352c0 1.0306-0.84194 1.8726-1.8726 1.8726-1.0306 0-1.8726-0.842-1.8726-1.8726 0-1.0307 0.84193-1.8726 1.8726-1.8726h1.8726v1.8726z"
			fill="#E01E5A"
		/>
		<path
			d="m7.7758 14.352c0-1.0307 0.84193-1.8726 1.8726-1.8726 1.0307 0 1.8726 0.8419 1.8726 1.8726v4.6887c0 1.0306-0.8419 1.8726-1.8726 1.8726-1.0306 0-1.8726-0.842-1.8726-1.8726v-4.6887z"
			fill="#E01E5A"
		/>
		<path
			d="m9.6483 6.8323c-1.0306 0-1.8726-0.84194-1.8726-1.8726 0-1.0306 0.84193-1.8726 1.8726-1.8726 1.0307 0 1.8726 0.84193 1.8726 1.8726v1.8726h-1.8726z"
			fill="#36C5F0"
		/>
		<path
			d="m9.6483 7.7758c1.0307 0 1.8726 0.84193 1.8726 1.8726 0 1.0306-0.8419 1.8726-1.8726 1.8726h-4.6887c-1.0306 0-1.8726-0.842-1.8726-1.8726 0-1.0306 0.84193-1.8726 1.8726-1.8726h4.6887z"
			fill="#36C5F0"
		/>
		<path
			d="m17.168 9.6484c0-1.0306 0.842-1.8726 1.8726-1.8726 1.0307 0 1.8726 0.84193 1.8726 1.8726 0 1.0306-0.8419 1.8726-1.8726 1.8726h-1.8726v-1.8726z"
			fill="#2EB67D"
		/>
		<path
			d="m16.224 9.6484c0 1.0306-0.842 1.8726-1.8726 1.8726-1.0307 0-1.8726-0.842-1.8726-1.8726v-4.6887c0-1.0306 0.8419-1.8726 1.8726-1.8726 1.0306 0 1.8726 0.84193 1.8726 1.8726v4.6887z"
			fill="#2EB67D"
		/>
		<path
			d="m14.352 17.168c1.0306 0 1.8726 0.842 1.8726 1.8726 0 1.0307-0.842 1.8726-1.8726 1.8726-1.0307 0-1.8726-0.8419-1.8726-1.8726v-1.8726h1.8726z"
			fill="#ECB22E"
		/>
		<path
			d="m14.352 16.224c-1.0307 0-1.8726-0.842-1.8726-1.8726 0-1.0307 0.8419-1.8726 1.8726-1.8726h4.6887c1.0306 0 1.8726 0.8419 1.8726 1.8726 0 1.0306-0.842 1.8726-1.8726 1.8726h-4.6887z"
			fill="#ECB22E"
		/>
	</svg>
);

/**
 * __SlackIcon__
 */
const SlackIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={SlackIconGlyph}
	/>
);

export default SlackIcon;
