import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AvatarRequestIconGlyph = (props: CustomGlyphProps) => (
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
		<path
			d="M8.71332 11C10.9225 11 12.7133 9.20914 12.7133 7C12.7133 4.79086 10.9225 3 8.71332 3C6.50418 3 4.71332 4.79086 4.71332 7C4.71332 9.20914 6.50418 11 8.71332 11ZM8.71332 9C7.60875 9 6.71332 8.10457 6.71332 7C6.71332 5.89543 7.60875 5 8.71332 5C9.81789 5 10.7133 5.89543 10.7133 7C10.7133 8.10457 9.81789 9 8.71332 9ZM10.3244 12.2814C9.94176 12.8354 9.63175 13.4435 9.40813 14.0918C9.17843 14.0313 8.94614 14 8.71332 14C6.85013 14 5.02145 16.0015 4.28023 19H9.41327C9.66451 19.7234 10.0234 20.3965 10.4707 21H1.96332C2.27461 15.9542 5.17783 12 8.71332 12C9.26847 12 9.80803 12.0975 10.3244 12.2814Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M17.5 15.5385V14.5385C17.5 13.9862 17.0523 13.5385 16.5 13.5385C15.9477 13.5385 15.5 13.9862 15.5 14.5385V15.5385H14.5C13.9477 15.5385 13.5 15.9862 13.5 16.5385C13.5 17.0908 13.9477 17.5385 14.5 17.5385H15.5V18.5385C15.5 19.0908 15.9477 19.5385 16.5 19.5385C17.0523 19.5385 17.5 19.0908 17.5 18.5385V17.5385H18.5C19.0523 17.5385 19.5 17.0908 19.5 16.5385C19.5 15.9862 19.0523 15.5385 18.5 15.5385H17.5ZM16.5 22.0385C13.4624 22.0385 11 19.576 11 16.5385C11 13.5009 13.4624 11.0385 16.5 11.0385C19.5376 11.0385 22 13.5009 22 16.5385C22 19.576 19.5376 22.0385 16.5 22.0385Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __AvatarRequestIcon__
 */
const AvatarRequestIcon = ({
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
		glyph={AvatarRequestIconGlyph}
	/>
);

export default AvatarRequestIcon;
