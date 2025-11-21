import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
const FlagWarningExample = (): React.JSX.Element => {
	return (
		<Flag
			appearance="warning"
			title="This page is visible to people outside your organization"
			description="Are you sure you want to publish?"
			id="warning"
			actions={[
				{ content: 'Publish', onClick: noop },
				{ content: 'Go back', onClick: noop },
			]}
		/>
	);
};

export default FlagWarningExample;
