import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const DataNumberIconGlyph = (props: CustomGlyphProps) => (
	<svg
		viewBox="0 0 24 24"
		focusable="false"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm.417 10.636h1.15V9.141H7.42L6 10.12v1.07l1.348-.93h.069v4.376zm1.923-3.85v.02h1.067v-.024c0-.506.365-.857.898-.857.503 0 .861.313.861.755 0 .357-.194.643-.967 1.397l-1.794 1.756v.803h3.964v-.955h-2.406v-.069l1.05-1.002c.953-.895 1.277-1.409 1.277-2.007 0-.944-.8-1.603-1.947-1.603-1.188 0-2.003.724-2.003 1.786zm5.811 1.466h.682c.617 0 .994.297.994.777 0 .469-.4.792-.975.792-.59 0-.983-.293-1.017-.757h-1.1c.05 1.035.88 1.713 2.106 1.713 1.253 0 2.159-.697 2.159-1.66 0-.724-.472-1.226-1.226-1.31v-.069c.613-.125 1.013-.62 1.013-1.257 0-.864-.811-1.481-1.939-1.481-1.2 0-1.972.655-2.01 1.695H14.9c.03-.476.385-.777.918-.777.537 0 .88.282.88.723 0 .45-.355.754-.876.754h-.67v.857z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

/**
 * __DataNumberIcon__
 */
const DataNumberIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size = 'small',
	testId,
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={DataNumberIconGlyph}
	/>
);

export default DataNumberIcon;
