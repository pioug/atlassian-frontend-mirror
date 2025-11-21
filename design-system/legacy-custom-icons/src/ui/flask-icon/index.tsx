import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const FlaskIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M5.4675 3V5.369L3.4985 9.5H8.501L6.532 5.369V3H5.4675ZM9.404 9.07C9.47661 9.22244 9.50943 9.39079 9.49941 9.55934C9.48939 9.72789 9.43686 9.89116 9.3467 10.0339C9.25655 10.1767 9.13171 10.2943 8.98384 10.3758C8.83596 10.4573 8.66985 10.5 8.501 10.5H3.4985C3.32969 10.4999 3.16365 10.4572 3.01584 10.3756C2.86803 10.2941 2.74326 10.1765 2.65316 10.0337C2.56307 9.89096 2.51058 9.72772 2.50058 9.55921C2.49059 9.3907 2.52341 9.2224 2.596 9.07L4.4675 5.143V2H7.5325V5.143L9.404 9.07Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4.5 6.5H7.5L9 10H3L4.5 6.5Z"
			fill="currentColor"
		/>
		<path
			d="M7.5 1.5H4.5C4.22386 1.5 4 1.72386 4 2C4 2.27614 4.22386 2.5 4.5 2.5H7.5C7.77614 2.5 8 2.27614 8 2C8 1.72386 7.77614 1.5 7.5 1.5Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __FlaskIcon__
 */
const FlaskIcon = ({
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
		glyph={FlaskIconGlyph}
	/>
);

export default FlaskIcon;
