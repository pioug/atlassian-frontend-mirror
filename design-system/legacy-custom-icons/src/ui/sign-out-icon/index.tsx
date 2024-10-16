import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SignOutIconGlyph = (props: CustomGlyphProps) => (
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
			fill="currentColor"
			d="m6.023 4.3-.149.005A2 2 0 0 0 4.024 6.3v12l.005.15a2 2 0 0 0 1.994 1.85h5l.117-.007a1 1 0 0 0-.117-1.993h-5v-12h5l.117-.007a1 1 0 0 0-.117-1.993h-5Zm9.293 4.293a1 1 0 0 0-.083 1.32l.084.094 1.292 1.292H9.023a1 1 0 0 0-.125 1.993l.125.008 7.586-.001-1.293 1.294a1 1 0 0 0-.083 1.32l.084.094a1 1 0 0 0 1.32.083l.094-.083 2.974-2.975c.096-.09.175-.198.23-.32l.011-.028a.757.757 0 0 0 .031-.083l.008-.027a.767.767 0 0 0 .02-.08l.007-.042a.767.767 0 0 0 .011-.133v-.039c0-.024-.002-.05-.004-.074l.004.094a1 1 0 0 0-.022-.215l-.008-.031a.807.807 0 0 0-.021-.074l-.018-.046a.64.64 0 0 0-.025-.062l-.019-.035a.64.64 0 0 0-.049-.083.667.667 0 0 0-.047-.07l-.084-.093-3-2.998a1 1 0 0 0-1.414 0Z"
		/>
	</svg>
);

/**
 * __SignOutIcon__
 */
const SignOutIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={SignOutIconGlyph}
	/>
);

export default SignOutIcon;
