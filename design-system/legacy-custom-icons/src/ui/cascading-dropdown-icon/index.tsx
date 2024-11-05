import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const CascadingDropdownIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g clipPath="url(#clip0_60_16582)">
			<path
				d="M5.02634 7.07143H12.9737C13.4036 7.07143 13.6205 7.59375 13.3152 7.89509L9.34152 11.8446C9.15268 12.0335 8.85134 12.0335 8.6625 11.8446L4.68884 7.89509C4.37946 7.59375 4.59643 7.07143 5.02634 7.07143ZM18 1.92857V16.0714C18 17.1362 17.1362 18 16.0714 18H1.92857C0.863839 18 0 17.1362 0 16.0714V1.92857C0 0.863839 0.863839 0 1.92857 0H16.0714C17.1362 0 18 0.863839 18 1.92857ZM16.0714 15.8304V2.16964C16.0714 2.03705 15.9629 1.92857 15.8304 1.92857H2.16964C2.03705 1.92857 1.92857 2.03705 1.92857 2.16964V15.8304C1.92857 15.9629 2.03705 16.0714 2.16964 16.0714H15.8304C15.9629 16.0714 16.0714 15.9629 16.0714 15.8304Z"
				fill="currentColor"
			/>
		</g>
		<defs>
			<clipPath id="clip0_60_16582">
				<rect width="18" height="18" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __CascadingDropdownIcon__
 */
const CascadingDropdownIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={CascadingDropdownIconGlyph}
	/>
);

export default CascadingDropdownIcon;
