import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const RovoIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.7752 5.21224C12.3029 4.93307 11.7214 4.92931 11.2462 5.20093C11.2394 5.20599 11.2323 5.21073 11.2248 5.21512L11.2248 5.21516L11.2237 5.21577C10.9177 5.39703 10.6863 5.67726 10.5594 6.00375C10.4892 6.18616 10.4517 6.38319 10.4517 6.58598V8.68258L13.0149 10.1983L13.0151 10.1984C13.6446 10.5693 14.0306 11.255 14.0306 11.9985V17.4111C14.0306 17.6539 13.989 17.8909 13.9111 18.1129L17.3498 16.0786L17.3502 16.0784C17.8304 15.7955 18.125 15.2727 18.125 14.7048V9.29226C18.125 8.72659 17.8287 8.20154 17.3499 7.91852L17.3498 7.91848L12.7752 5.21224Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.5483 17.4141C13.5483 17.6172 13.5107 17.8144 13.4403 17.9971C13.3132 18.3236 13.0816 18.6038 12.7752 18.7849L12.7751 18.785C12.7677 18.7893 12.7606 18.7941 12.7538 18.7991C12.2786 19.0708 11.6971 19.067 11.2249 18.7879L11.2248 18.7878L6.65013 16.0816L6.65006 16.0816C6.17129 15.7985 5.875 15.2735 5.875 14.7078L5.875 9.29525C5.875 8.72734 6.16955 8.20457 6.64975 7.92169L10.0889 5.88721C10.0109 6.10916 9.96935 6.34615 9.96935 6.58897V12.0015C9.96935 12.745 10.3553 13.4307 10.9847 13.8016L10.985 13.8018L13.5483 15.3175V17.4141Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __RovoIcon__
 */
const RovoIcon = ({
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
		glyph={RovoIconGlyph}
	/>
);

export default RovoIcon;
