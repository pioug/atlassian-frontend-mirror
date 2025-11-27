import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const CloudResourceIconGlyph = (props: CustomGlyphProps) => (
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
			fill="none"
			d="M6.07585 10.4798C4.70269 10.7573 3.66883 11.9708 3.66883 13.4258C3.66883 15.0857 4.83719 16.4314 6.49712 16.4314M16.6409 16.4314C18.9648 16.4314 20.5 14.5475 20.5 12.2236C20.5 9.89967 18.6161 8.01578 16.2922 8.01578C15.8909 8.01578 15.5027 8.07196 15.1351 8.17688M15.1399 8.18267C14.3348 6.65375 12.7302 5.61133 10.8822 5.61133C8.22631 5.61133 6.07329 7.76435 6.07329 10.4202V10.4803"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			fill="none"
			d="M14.1963 16.4036C14.1963 17.8203 13.0479 18.9688 11.6312 18.9688C10.2146 18.9688 9.06612 17.8203 9.06612 16.4036C9.06612 14.987 10.2146 13.8385 11.6312 13.8385C13.0479 13.8385 14.1963 14.987 14.1963 16.4036Z"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * __CloudResourceIcon__
 */
const CloudResourceIcon = ({
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
		glyph={CloudResourceIconGlyph}
	/>
);

export default CloudResourceIcon;
