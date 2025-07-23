import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import { token } from '@atlaskit/tokens';

const FlagErrorExample = () => {
	return (
		<Flag
			appearance="error"
			icon={
				<ErrorIcon
					label="Error"
					LEGACY_secondaryColor={token('color.background.danger.bold')}
					color={token('color.icon.inverse')}
					spacing="spacious"
				/>
			}
			id="error"
			key="error"
			title="We're having trouble connecting"
			description="Check your internet connection and try again."
			actions={[{ content: 'Try again', onClick: noop }]}
		/>
	);
};

export default FlagErrorExample;
