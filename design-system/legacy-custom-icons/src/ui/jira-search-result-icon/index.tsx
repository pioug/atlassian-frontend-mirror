import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const JiraSearchResultIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M16 14V16M16 18V16M16 16H18M16 16H14"
			stroke="#E2483D"
			strokeWidth="0.0333333"
			strokeDasharray="0.13 0.13"
		/>
		<g clipPath="url(#clip0_6321_165880)">
			<path
				d="M11.7181 20.2933H9.56828C6.32599 20.2933 4 18.3226 4 15.4369H15.5595C16.1586 15.4369 16.5463 15.8592 16.5463 16.4575V28C13.6564 28 11.7181 25.6774 11.7181 22.4399V20.2933ZM17.4273 14.5572H15.2775C12.0352 14.5572 9.70925 12.6217 9.70925 9.73607H21.2687C21.8678 9.73607 22.2907 10.1232 22.2907 10.7214V22.2639C19.4009 22.2639 17.4273 19.9413 17.4273 16.7038V14.5572ZM23.1718 8.85631H21.022C17.7797 8.85631 15.4537 6.88563 15.4537 4H27.0132C27.6123 4 28 4.42229 28 4.98534V16.5279C25.1101 16.5279 23.1718 14.2053 23.1718 10.9677V8.85631Z"
				fill="currentColor"
			/>
		</g>
		<defs>
			<clipPath id="clip0_6321_165880">
				<rect width="24" height="24" fill="white" transform="translate(4 4)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __JiraSearchResultIcon__
 */
const JiraSearchResultIcon = ({
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
		glyph={JiraSearchResultIconGlyph}
	/>
);

export default JiraSearchResultIcon;
