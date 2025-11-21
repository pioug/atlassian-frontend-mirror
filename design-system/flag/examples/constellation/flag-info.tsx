import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';

const FlagInfoExample = (): React.JSX.Element => {
	return (
		<Flag
			appearance="info"
			title="There’s no one in this project"
			description="Add yourself or your team to get the party started."
			id="info"
			actions={[
				{ content: 'Add teammates', onClick: noop },
				{ content: 'Close', onClick: noop },
			]}
		/>
	);
};

export default FlagInfoExample;
