import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const VerifiedIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="33"
		height="32"
		viewBox="0 0 33 32"
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
			d="M18.6666 6.65507C17.7592 4.89362 15.2407 4.89362 14.3332 6.65507C13.7879 7.7135 12.5577 8.22306 11.4237 7.86022C9.53648 7.25639 7.75565 9.03721 8.35949 10.9244C8.72232 12.0584 8.21276 13.2886 7.15434 13.8339C5.39289 14.7414 5.39289 17.2599 7.15434 18.1674C8.21276 18.7127 8.72232 19.9429 8.35949 21.0769C7.75565 22.9641 9.53648 24.7449 11.4237 24.1411C12.5577 23.7783 13.7879 24.2878 14.3332 25.3462C15.2407 27.1077 17.7592 27.1077 18.6666 25.3462C19.212 24.2878 20.4421 23.7783 21.5761 24.1411C23.4634 24.7449 25.2442 22.9641 24.6404 21.0769C24.2775 19.9429 24.7871 18.7127 25.8455 18.1674C27.607 17.2599 27.607 14.7414 25.8455 13.8339C24.7871 13.2886 24.2775 12.0584 24.6404 10.9244C25.2442 9.03721 23.4634 7.25639 21.5761 7.86022C20.4421 8.22306 19.212 7.7135 18.6666 6.65507ZM20.7898 12.7002L20.8932 12.7923C21.323 13.2221 21.3537 13.8998 20.9853 14.365L20.8932 14.4684L16.1524 19.2091C15.7226 19.6389 15.0449 19.6696 14.5797 19.3012L14.4764 19.2091L12.106 16.8388C11.6431 16.3759 11.6431 15.6255 12.106 15.1627C12.5358 14.7329 13.2135 14.7022 13.6787 15.0706L13.7821 15.1627L15.3146 16.6944L19.2171 12.7923C19.6469 12.3625 20.3246 12.3318 20.7898 12.7002Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __VerifiedIcon__
 */
const VerifiedIcon = ({
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
		glyph={VerifiedIconGlyph}
	/>
);

export default VerifiedIcon;
