import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const GoogleCalendarIconGlyph = (props: CustomGlyphProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="50 50 410 410 "
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path fill="#4285f4" d="M100 340h74V174h166v-74H137q-37 0-37 35" />
		<path fill="#1967d2" d="M338 100v76h74v-41q0-35-35-35" />
		<path fill="#fbbc04" d="M338 174h74v164h-74" />
		<path fill="#188038" d="M100 338v39q0 35 35 35h41v-74" />
		<path fill="#34a853" d="M174 338h164v74H174" />
		<path fill="#ea4335" d="M338 412v-74h74" />
		<path
			fill="none"
			stroke="#4285f4"
			strokeLinejoin="bevel"
			strokeWidth={15}
			d="M204 229a25 22 1 1 1 25 27h-9 9a25 22 1 1 1-25 27m66-52 27-19h4v-7 103"
		/>
	</svg>
);

/**
 * __GoogleCalendarIcon__
 */
const GoogleCalendarIcon = ({
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
		glyph={GoogleCalendarIconGlyph}
	/>
);

export default GoogleCalendarIcon;
