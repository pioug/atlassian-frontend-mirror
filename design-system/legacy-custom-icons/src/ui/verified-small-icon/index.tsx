import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const VerifiedSmallIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="16"
		height="16"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			transform="translate(0,-1)"
			d="M9.15 1.406a1.713 1.713 0 0 0-2.3 0L5.7 2.448a.213.213 0 0 1-.15.055L4 2.443a1.713 1.713 0 0 0-1.763 1.48l-.21 1.536a.212.212 0 0 1-.08.139l-1.225.95c-.697.54-.87 1.52-.4 2.266l.827 1.312c.03.047.04.104.027.159L.848 11.8A1.713 1.713 0 0 0 2 13.793l1.477.474a.213.213 0 0 1 .123.103l.723 1.372c.41.78 1.346 1.12 2.162.787l1.436-.586a.212.212 0 0 1 .16 0l1.436.586a1.713 1.713 0 0 0 2.162-.787l.723-1.372a.212.212 0 0 1 .123-.103l1.477-.474a1.713 1.713 0 0 0 1.15-1.993l-.328-1.515a.213.213 0 0 1 .028-.159l.827-1.312a1.712 1.712 0 0 0-.4-2.266l-1.225-.95a.213.213 0 0 1-.08-.14l-.21-1.536A1.713 1.713 0 0 0 12 2.443l-1.55.06a.213.213 0 0 1-.15-.055L9.15 1.406Zm3.176 5.074-1.152-.96-4.424 5.309-1.924-2.31-1.152.961 2.5 3a.75.75 0 0 0 1.152 0l5-6Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __VerifiedSmallIcon__
 */
const VerifiedSmallIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={VerifiedSmallIconGlyph}
	/>
);

export default VerifiedSmallIcon;
