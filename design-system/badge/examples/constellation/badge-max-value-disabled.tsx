import React from 'react';

import Badge from '@atlaskit/badge';

const BadgeMaxValueDisabledExample = (): React.JSX.Element => {
	return (
		<Badge appearance="added" max={false}>
			{1000}
		</Badge>
	);
};

export default BadgeMaxValueDisabledExample;
