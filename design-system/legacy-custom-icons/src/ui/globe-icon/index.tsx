import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GlobeIconGlyph = (props: CustomGlyphProps) => (
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
		<mask id="path-5-inside-5_1403_23012" fill="white">
			<rect width="24" height="24" rx="3" fill="#22A06B" />
		</mask>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12 18.375C12.8372 18.375 13.6662 18.2101 14.4396 17.8897C15.2131 17.5694 15.9158 17.0998 16.5078 16.5078C17.0998 15.9158 17.5694 15.2131 17.8897 14.4396C18.2101 13.6662 18.375 12.8372 18.375 12C18.375 11.1628 18.2101 10.3338 17.8897 9.56039C17.5694 8.78694 17.0998 8.08417 16.5078 7.49219C15.9158 6.90022 15.2131 6.43064 14.4396 6.11027C13.6662 5.78989 12.8372 5.625 12 5.625C10.3092 5.625 8.68774 6.29665 7.49219 7.49219C6.29665 8.68774 5.625 10.3092 5.625 12C5.625 13.6908 6.29665 15.3123 7.49219 16.5078C8.68774 17.7033 10.3092 18.375 12 18.375ZM11.3625 17.0554C10.1302 16.9017 8.99657 16.303 8.17476 15.372C7.35294 14.441 6.8996 13.2418 6.9 12C6.9 11.6047 6.951 11.2286 7.03387 10.8589L10.0875 13.9125V14.55C10.0875 15.2513 10.6613 15.825 11.3625 15.825V17.0554ZM15.7612 15.4361C15.6804 15.1785 15.5192 14.9535 15.3012 14.7941C15.0833 14.6346 14.82 14.5491 14.55 14.55H13.9125V12.6375C13.9125 12.2869 13.6256 12 13.275 12H9.45V10.725H10.725C11.0756 10.725 11.3625 10.4381 11.3625 10.0875V8.8125H12.6375C13.3387 8.8125 13.9125 8.23875 13.9125 7.5375V7.27612C15.7804 8.03475 17.1 9.86437 17.1 12C17.1 13.326 16.59 14.5309 15.7612 15.4361Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __GlobeIcon__
 */
const GlobeIcon = ({
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
		glyph={GlobeIconGlyph}
	/>
);

export default GlobeIcon;
