import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag/flag';

const FlagSuccessExample = (): React.JSX.Element => {
	return (
		<Flag
			appearance="success"
			title="Welcome to the room"
			description="You’re now part of Coffee Club."
			id="success"
			actions={[{ content: 'Join the conversation', onClick: noop }]}
		/>
	);
};

export default FlagSuccessExample;
