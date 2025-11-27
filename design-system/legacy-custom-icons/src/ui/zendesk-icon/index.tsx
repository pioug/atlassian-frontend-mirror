import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const ZendeskIconGlyph = (props: CustomGlyphProps) => (
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
			d="M15.0857 11.8028V25.1868H4L15.0857 11.8028ZM15.0857 7C15.0857 8.47005 14.5017 9.8799 13.4622 10.9194C12.4227 11.9589 11.0129 12.5428 9.54284 12.5428C8.07279 12.5428 6.66295 11.9589 5.62346 10.9194C4.58398 9.8799 4 8.47005 4 7H15.0857ZM16.9119 25.188C16.9119 23.7179 17.4959 22.3081 18.5354 21.2686C19.5749 20.2291 20.9847 19.6451 22.4548 19.6451C23.9248 19.6451 25.3347 20.2291 26.3742 21.2686C27.4137 22.3081 27.9976 23.7179 27.9976 25.188H16.9119ZM16.9119 20.3851V7H28L16.9119 20.3839V20.3851Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __ZendeskIcon__
 */
const ZendeskIcon = ({
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
		glyph={ZendeskIconGlyph}
	/>
);

export default ZendeskIcon;
