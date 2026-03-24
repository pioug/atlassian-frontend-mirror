import React from 'react';

import ClockIcon from '@atlaskit/icon/core/clock';
import { fg } from '@atlaskit/platform-feature-flags';

const RelatedLinksActionIcon = ({
	iconSize,
}: {
	iconSize?: 'small' | 'medium';
}): React.JSX.Element => (
	<ClockIcon
		color="currentColor"
		spacing="spacious"
		label={fg('navx-3698-flexible-card-a11y-fix') ? '' : 'View related links...'}
		size={iconSize}
	/>
);

export default RelatedLinksActionIcon;
