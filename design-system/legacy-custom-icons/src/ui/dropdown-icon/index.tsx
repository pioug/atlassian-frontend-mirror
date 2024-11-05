import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const DropdownIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		focusable="false"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M18.1166211,7.00672773 L18,7 L3,7 L3,5 L19,5 C20.0543618,5 20.9181651,5.81587779 20.9945143,6.85073766 L21,7 L21,17 C21,18.1045695 20.1045695,19 19,19 L3,19 L3,17 L18,17 C18.5128358,17 18.9355072,16.6139598 18.9932723,16.1166211 L19,16 L19,8 C19,7.48716416 18.6139598,7.06449284 18.1166211,7.00672773 Z"
			fill="currentColor"
		/>
		<path
			d="M8.292,9.793 C7.90322601,10.1861135 7.90322601,10.8188865 8.292,11.212 L11.231,14.177 C11.449,14.392 11.731,14.499 12.01,14.499 C12.289,14.499 12.566,14.392 12.779,14.177 L15.709,11.222 C16.097233,10.8286643 16.097233,10.1963357 15.709,9.803 C15.5235039,9.61477051 15.270271,9.50879145 15.006,9.50879145 C14.741729,9.50879145 14.4884961,9.61477051 14.303,9.803 L12.005,12.12 L9.698,9.793 C9.51210329,9.60551885 9.25902039,9.50005882 8.995,9.50005882 C8.73097961,9.50005882 8.47789671,9.60551885 8.292,9.793 L8.292,9.793 Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __DropdownIcon__
 */
const DropdownIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={DropdownIconGlyph}
	/>
);

export default DropdownIcon;
