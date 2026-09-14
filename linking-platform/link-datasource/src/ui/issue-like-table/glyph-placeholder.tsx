import React from 'react';

import type { IconProps } from '@atlaskit/icon/types';

export const GlyphPlaceholder = (props: IconProps): React.JSX.Element => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		data-testid={props.testId}
		aria-label={props.label}
	></svg>
);
