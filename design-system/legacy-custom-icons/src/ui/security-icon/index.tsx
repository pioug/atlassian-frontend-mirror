import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SecurityIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="18"
		viewBox="0 0 16 18"
		fill="none"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M7 2.73607L2.14177 5.16518L2.64261 9.67271C2.7995 11.0848 3.54972 12.3634 4.70584 13.1892L7 14.8279V2.73607ZM9 2.73607V14.8279L11.2942 13.1892C12.4503 12.3634 13.2005 11.0848 13.3574 9.67271L13.8582 5.16518L9 2.73607ZM0 4L8 0L16 4L15.3452 9.89357C15.1255 11.8705 14.0752 13.6606 12.4566 14.8167L8.58124 17.5848C8.23354 17.8332 7.76646 17.8332 7.41876 17.5848L3.54336 14.8167C1.9248 13.6606 0.874496 11.8705 0.654841 9.89357L0 4Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __SecurityIcon__
 */
const SecurityIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={SecurityIconGlyph}
	/>
);

export default SecurityIcon;
