import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const AnsibleIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M20 10C20 15.523 15.5231 19.9999 10 19.9999C4.47736 19.9999 0 15.5231 0 10C0 4.47736 4.47738 0 10 0C15.5231 0 20 4.47738 20 10Z"
			fill="#1A1918"
		/>
		<path
			d="M10.1686 6.10884L12.7564 12.4958L8.84759 9.41682L10.1686 6.10884ZM14.7658 13.9671L10.7852 4.38762C10.6716 4.11134 10.4444 3.96515 10.1686 3.96515C9.89235 3.96515 9.64859 4.11134 9.53496 4.38762L5.16602 14.8951H6.66056L8.39004 10.5628L13.5512 14.7324C13.7588 14.9003 13.9086 14.9762 14.1032 14.9762C14.4932 14.9762 14.834 14.6839 14.834 14.262C14.834 14.1933 14.8097 14.0843 14.7658 13.9671Z"
			fill="white"
		/>
	</svg>
);

/**
 * __AnsibleIcon__
 */
const AnsibleIcon = ({
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
		glyph={AnsibleIconGlyph}
	/>
);

export default AnsibleIcon;
