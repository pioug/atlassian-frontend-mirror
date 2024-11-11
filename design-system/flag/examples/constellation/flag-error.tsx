import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { token } from '@atlaskit/tokens';

const FlagErrorExample = () => {
	return (
		<Flag
			appearance="error"
			icon={<ErrorIcon label="Error" secondaryColor={token('color.background.danger.bold')} />}
			id="error"
			key="error"
			title="We're having trouble connecting"
			description="Check your internet connection and try again."
			actions={[{ content: 'Try again', onClick: noop }]}
		/>
	);
};

export default FlagErrorExample;
