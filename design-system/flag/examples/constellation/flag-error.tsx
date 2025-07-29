import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';

const FlagErrorExample = () => {
	return (
		<Flag
			appearance="error"
			title="We're having trouble connecting"
			description="Check your internet connection and try again."
			id="error"
			actions={[{ content: 'Try again', onClick: noop }]}
		/>
	);
};

export default FlagErrorExample;
