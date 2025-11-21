import React from 'react';

import Badge from '@atlaskit/badge';

const BadgeMaxValueExample = (): React.JSX.Element => {
	return (
		<Badge appearance="added" max={500}>
			{1000}
		</Badge>
	);
};

export default BadgeMaxValueExample;
