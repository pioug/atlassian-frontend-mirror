import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const AtlassianIntelligenceDarkIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.4467 8.00004C11.4467 7.63185 11.7451 7.33337 12.1133 7.33337H13.3333C13.7015 7.33337 14 7.63185 14 8.00004C14 8.36823 13.7015 8.66671 13.3333 8.66671H12.1133C11.7451 8.66671 11.4467 8.36823 11.4467 8.00004Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8.00004 2C8.36823 2 8.66671 2.29848 8.66671 2.66667V3.88667C8.66671 4.25486 8.36823 4.55333 8.00004 4.55333C7.63185 4.55333 7.33337 4.25486 7.33337 3.88667V2.66667C7.33337 2.29848 7.63185 2 8.00004 2Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2 8.00004C2 7.63185 2.29848 7.33337 2.66667 7.33337H3.88667C4.25486 7.33337 4.55333 7.63185 4.55333 8.00004C4.55333 8.36823 4.25486 8.66671 3.88667 8.66671H2.66667C2.29848 8.66671 2 8.36823 2 8.00004Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8.00004 11.4467C8.36823 11.4467 8.66671 11.7451 8.66671 12.1133V13.3333C8.66671 13.7015 8.36823 14 8.00004 14C7.63185 14 7.33337 13.7015 7.33337 13.3333V12.1133C7.33337 11.7451 7.63185 11.4467 8.00004 11.4467Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9.52864 9.52864C9.78899 9.26829 10.2111 9.26829 10.4714 9.52864L13.1381 12.1953C13.3985 12.4557 13.3985 12.8778 13.1381 13.1381C12.8778 13.3985 12.4557 13.3985 12.1953 13.1381L9.52864 10.4714C9.26829 10.2111 9.26829 9.78899 9.52864 9.52864Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.1381 2.86189C13.3985 3.12224 13.3985 3.54435 13.1381 3.8047L10.4714 6.47136C10.2111 6.73171 9.78899 6.73171 9.52864 6.47136C9.26829 6.21101 9.26829 5.7889 9.52864 5.52855L12.1953 2.86189C12.4557 2.60154 12.8778 2.60154 13.1381 2.86189Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.86189 2.86189C3.12224 2.60154 3.54435 2.60154 3.8047 2.86189L6.47136 5.52855C6.73171 5.7889 6.73171 6.21101 6.47136 6.47136C6.21101 6.73171 5.7889 6.73171 5.52855 6.47136L2.86189 3.8047C2.60154 3.54435 2.60154 3.12224 2.86189 2.86189Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.47136 9.52864C6.73171 9.78899 6.73171 10.2111 6.47136 10.4714L3.8047 13.1381C3.54435 13.3985 3.12224 13.3985 2.86189 13.1381C2.60154 12.8778 2.60154 12.4557 2.86189 12.1953L5.52855 9.52864C5.7889 9.26829 6.21101 9.26829 6.47136 9.52864Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __AtlassianIntelligenceDarkIcon__
 */
const AtlassianIntelligenceDarkIcon = ({
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
		glyph={AtlassianIntelligenceDarkIconGlyph}
	/>
);

export default AtlassianIntelligenceDarkIcon;
