import React from 'react';

import ClockIcon from '@atlaskit/icon/core/clock';

const RelatedLinksActionIcon = ({
	iconSize,
}: {
	iconSize?: 'small' | 'medium';
}): React.JSX.Element => (
	<ClockIcon color="currentColor" spacing="spacious" label={''} size={iconSize} />
);

export default RelatedLinksActionIcon;
