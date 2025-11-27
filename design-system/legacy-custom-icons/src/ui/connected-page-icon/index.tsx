import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const ConnectedPageIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.4123 10.1551C12.8378 10.1525 12.3701 9.68475 12.3675 9.11027L12.3598 7.39768L5.63605 14.1215C5.24553 14.512 4.61236 14.512 4.22184 14.1215C3.83132 13.731 3.83132 13.0978 4.22184 12.7073L10.9456 5.98347L9.23304 5.97583C8.65857 5.97326 8.19079 5.50548 8.18823 4.93101C8.18567 4.35654 8.64929 3.89291 9.22376 3.89548L13.3845 3.91404C13.9589 3.9166 14.4267 4.38438 14.4293 4.95886L14.4478 9.11955C14.4504 9.69403 13.9868 10.1577 13.4123 10.1551Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15.8118 19.0691C15.8093 18.4946 15.3415 18.0269 14.767 18.0243L13.0544 18.0166L19.7782 11.2929C20.1687 10.9023 20.1687 10.2692 19.7782 9.87864C19.3877 9.48812 18.7545 9.48811 18.364 9.87864L11.6402 16.6024L11.6326 14.8898C11.63 14.3154 11.1622 13.8476 10.5877 13.845C10.0133 13.8425 9.54965 14.3061 9.55222 14.8806L9.57078 19.0413C9.57334 19.6157 10.0411 20.0835 10.6156 20.0861L14.7763 20.1046C15.3508 20.1072 15.8144 19.6436 15.8118 19.0691Z"
			fill="currentColor"
		/>
		<mask
			id="mask0"
			mask-type="alpha"
			maskUnits="userSpaceOnUse"
			x="7"
			y="7"
			width="16"
			height="16"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15.8118 19.0691C15.8093 18.4946 15.3415 18.0269 14.767 18.0243L13.0544 18.0166L19.7782 11.2929C20.1687 10.9023 20.1687 10.2692 19.7782 9.87864C19.3877 9.48812 18.7545 9.48811 18.364 9.87864L11.6402 16.6024L11.6326 14.8898C11.63 14.3154 11.1622 13.8476 10.5877 13.845C10.0133 13.8425 9.54965 14.3061 9.55222 14.8806L9.57078 19.0413C9.57334 19.6157 10.0411 20.0835 10.6156 20.0861L14.7763 20.1046C15.3508 20.1072 15.8144 19.6436 15.8118 19.0691Z"
				fill="white"
			/>
		</mask>
		<g mask="url(#mask0)" />
	</svg>
);

/**
 * __ConnectedPageIcon__
 */
const ConnectedPageIcon = ({
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
		glyph={ConnectedPageIconGlyph}
	/>
);

export default ConnectedPageIcon;
