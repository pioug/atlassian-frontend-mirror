import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

import Icon from '../../icon';

const AutomationNewIconGlyph = (props: CustomGlyphProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path d="M14 5L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M14 5L7 12H17L10 19"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * __AutomationNewIcon__
 */
const AutomationNewIcon = ({ label, primaryColor, size, testId }: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={token('utility.UNSAFE.transparent')}
		size={size}
		testId={testId}
		glyph={AutomationNewIconGlyph}
	/>
);

export default AutomationNewIcon;
